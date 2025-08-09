import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@clerk/nextjs";
import { isActive } from "@/lib/subscriptions";

export const dynamic = "force-dynamic";

const Schema = z.object({
  type: z.string(),
  country: z.string(),
  countryCode: z.string().optional().default(""),
  currencyCode: z.string(),
  currencyToUSD: z.number().nullable(),
  city: z.string(),
  capacity: z.number().positive(),
  chickPrice: z.number().nonnegative(),
  feedStarter: z.number().nonnegative(),
  feedGrower: z.number().nonnegative(),
  feedFinisher: z.number().nonnegative(),
  mortality: z.number().min(0).max(100),
  marketWeight: z.number().positive(),
  sellPricePerKg: z.number().positive(),
  medsPerChick: z.number().nonnegative(),
  laborPerMonth: z.number().nonnegative(),
  overheadsPerMonth: z.number().nonnegative(),
});

function round2(n:number){ return Math.round(n*100)/100; }

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const ok = await isActive(userId);
  if (!ok) return NextResponse.json({ error: "Subscription required" }, { status: 402 });

  const body = await req.json();
  const d = Schema.parse(body);

  const alive = Math.max(0, Math.round(d.capacity * (1 - d.mortality / 100)));

  // استهلاك علف (كجم/طائر) مضبوط
  const cStarter = 0.85;
  const cGrower = 1.7;
  const cFinisher = 1.35;
  const totalFeedKg = alive * (cStarter + cGrower + cFinisher);
  const avgFeedPrice = (d.feedStarter + d.feedGrower + d.feedFinisher) / 3;

  const feedCost = totalFeedKg * avgFeedPrice;
  const chicksCost = d.capacity * d.chickPrice;
  const medsCost = d.capacity * d.medsPerChick;

  // CAPEX تقريبي/طائر
  const capexPerBird = 3.5; // USD
  const capex = d.capacity * capexPerBird;

  // الإنتاج والإيراد
  const meatKg = alive * d.marketWeight;
  const revenue = meatKg * d.sellPricePerKg;

  // OPEX (دورة 45 يوم ≈ 1.5 شهر)
  const fixedCosts = d.laborPerMonth * 1.5 + d.overheadsPerMonth * 1.5;
  const variableCosts = feedCost + chicksCost + medsCost;
  const totalCost = variableCosts + fixedCosts;

  const ebitda = revenue - totalCost;
  const roiPct = capex > 0 ? (ebitda / capex) * 100 : null;
  const paybackMonths = ebitda > 0 ? round2(capex / (ebitda / 1.5)) : null;

  // تدفق نقدي 12 شهر (8 دورات/سنة)
  const cyclesPerYear = 8;
  const monthly = Array.from({ length: 12 }, (_, i) => {
    const hit = i % Math.round(12 / cyclesPerYear) === 0;
    const inflow = hit ? revenue : 0;
    const outflow = (hit ? variableCosts : 0) + (d.laborPerMonth + d.overheadsPerMonth);
    return { month: i+1, inflow: round2(inflow), outflow: round2(outflow), net: round2(inflow - outflow) };
  });

  // حساسية ±10%
  const sens = {
    sellMinus10: round2((meatKg * (d.sellPricePerKg*0.9)) - totalCost),
    sellPlus10: round2((meatKg * (d.sellPricePerKg*1.1)) - totalCost),
    feedPlus10: round2(revenue - ((variableCosts*1.1) + fixedCosts)),
    feedMinus10: round2(revenue - ((variableCosts*0.9) + fixedCosts)),
  };

  const enc = encodeURIComponent;
  const countryCity = `${d.country} ${d.city}`.trim();
  const suppliersURL = `https://www.google.com/search?q=${enc(`poultry feed chicks suppliers ${countryCity}`)}`;
  const lawsURL = `https://www.google.com/search?q=${enc(`poultry farm license regulations ${d.country}`)}`;
  const taxesURL = `https://www.google.com/search?q=${enc(`taxes VAT agriculture poultry ${d.country}`)}`;

  return NextResponse.json({
    summary: {
      project: d.type,
      location: `${d.country} - ${d.city}`,
      currency: d.currencyToUSD ? `1 ${d.currencyCode} ≈ ${d.currencyToUSD.toFixed(4)} USD` : d.currencyCode,
    },
    assumptions: {
      capacity: d.capacity,
      mortalityPct: d.mortality,
      marketWeightKg: d.marketWeight,
      prices: {
        chickPrice: d.chickPrice,
        feedPerKg: { starter: d.feedStarter, grower: d.feedGrower, finisher: d.feedFinisher },
        sellPricePerKg: d.sellPricePerKg,
        medsPerChick: d.medsPerChick,
      },
      ops: { laborPerMonth: d.laborPerMonth, overheadsPerMonth: d.overheadsPerMonth },
      capex: { capexPerBird, capex },
    },
    calculations: {
      alive,
      totalFeedKg: round2(totalFeedKg),
      avgFeedPrice: round2(avgFeedPrice),
      feedCost: round2(feedCost),
      chicksCost: round2(chicksCost),
      medsCost: round2(medsCost),
      meatKg: round2(meatKg),
      revenue: round2(revenue),
      fixedCosts: round2(fixedCosts),
      variableCosts: round2(variableCosts),
      totalCost: round2(totalCost),
      ebitda: round2(ebitda),
      roiPct: roiPct === null ? null : round2(roiPct),
      paybackMonths,
      monthlyCashflow: monthly
    },
    sensitivity: sens,
    links: { suppliers: suppliersURL, laws: lawsURL, taxes: taxesURL },
    disclaimer: "هذه تقديرات تعتمد على مدخلاتك. راجع مختصًا قبل الاستثمار."
  });
}
