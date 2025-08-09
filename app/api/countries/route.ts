export const dynamic = "force-dynamic";

type RC = { cca2:string; name:{common:string}; currencies?:Record<string,{name:string; symbol?:string}> };

export async function GET() {
  try {
    const [countriesRes, ratesRes] = await Promise.all([
      fetch("https://restcountries.com/v3.1/all", { cache: "no-store" }),
      fetch("https://api.exchangerate.host/latest?base=USD", { cache: "no-store" }),
    ]);
    const countries: RC[] = await countriesRes.json();
    const ratesJson = await ratesRes.json();
    const usdBaseRates: Record<string, number> = ratesJson?.rates || {};

    let mapped = countries
      .filter((c) => c.name?.common)
      .filter((c) => c.name.common.toLowerCase() !== "israel")
      .map((c) => {
        const code = c.cca2 || "";
        const currencyCode = c.currencies ? Object.keys(c.currencies)[0] : "USD";
        const currencyName = c.currencies?.[currencyCode]?.name || "Currency";
        const rateFromUSD = usdBaseRates[currencyCode] || null;
        const usdPerCurrency = rateFromUSD ? 1 / rateFromUSD : null;
        return {
          name: c.name.common === "Palestine, State of" ? "Palestine" : c.name.common,
          code,
          currencyCode,
          currencyName,
          usdPerCurrency,
        };
      });

    if (!mapped.some((m) => m.name === "Palestine")) {
      const rateFromUSD = usdBaseRates["ILS"] || null;
      mapped.unshift({
        name: "Palestine",
        code: "PS",
        currencyCode: "ILS",
        currencyName: "Israeli new shekel",
        usdPerCurrency: rateFromUSD ? 1 / rateFromUSD : null,
      });
    }

    mapped.sort((a, b) => a.name.localeCompare(b.name));

    return new Response(JSON.stringify({ countries: mapped }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ countries: [] }), { status: 200 });
  }
}
