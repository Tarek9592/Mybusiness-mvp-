"use client";
import React, { useEffect, useState } from "react";

type Country = { name:string; code:string; currencyCode:string; currencyName:string; usdPerCurrency:number|null };

export default function Page(){
  const [countries, setCountries] = useState<Country[]>([]);
  const [sel, setSel] = useState<Country|null>(null);
  const [loading, setLoading] = useState(true);

  const [city, setCity] = useState("");
  const [capacity, setCapacity] = useState(5000);
  const [chickPrice, setChickPrice] = useState(0.5);
  const [feedStarter, setFeedStarter] = useState(0.7);
  const [feedGrower, setFeedGrower] = useState(0.65);
  const [feedFinisher, setFeedFinisher] = useState(0.6);
  const [mortality, setMortality] = useState(5);
  const [marketWeight, setMarketWeight] = useState(2.2);
  const [sellPricePerKg, setSellPricePerKg] = useState(2.2);
  const [medsPerChick, setMedsPerChick] = useState(0.1);
  const [laborPerMonth, setLaborPerMonth] = useState(400);
  const [overheadsPerMonth, setOverheadsPerMonth] = useState(200);

  const [result, setResult] = useState<any>(null);
  const [busy, setBusy] = useState(false);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  useEffect(()=>{
    (async()=>{
      try{
        const res = await fetch("/api/countries",{cache:"no-store"});
        const data = await res.json();
        setCountries(data.countries);
        setSel(data.countries.find((x:Country)=>x.code==="EG") ?? data.countries[0]);
      }catch{ alert("تعذر تحميل الدول"); } finally { setLoading(false); }
    })();
  },[]);

  const currencyNote = sel?.usdPerCurrency ? `1 ${sel.currencyCode} ≈ ${sel.usdPerCurrency.toFixed(4)} USD` : `عملة: ${sel?.currencyCode}`;

  async function generate(){
    if(!sel) return;
    setBusy(true); setResult(null); setAnswer("");
    try{
      const res = await fetch("/api/generatePlan", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          type:"تربية دواجن لحم",
          country: sel.name,
          countryCode: sel.code,
          currencyCode: sel.currencyCode,
          currencyToUSD: sel.usdPerCurrency,
          city, capacity, chickPrice, feedStarter, feedGrower, feedFinisher,
          mortality, marketWeight, sellPricePerKg, medsPerChick, laborPerMonth, overheadsPerMonth
        })
      });
      const json = await res.json();
      if(json.error){ alert(json.error); } else { setResult(json); }
    }catch{ alert("خطأ أثناء الحساب"); } finally { setBusy(false); }
  }

  async function downloadPdf(){
    if(!result) return;
    const res = await fetch("/api/exportPdf", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(result) });
    if(!res.ok){ alert("مطلوب اشتراك فعّال"); return; }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "business-plan.pdf"; a.click();
    URL.revokeObjectURL(url);
  }

  async function savePlan(){
    if(!result) return;
    const res = await fetch("/api/plans/save", {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({
        country: result?.summary?.location?.split(" - ")?.[0] || "",
        city: result?.summary?.location?.split(" - ")?.[1] || "",
        payload: result
      })
    });
    const js = await res.json();
    if(res.ok) alert("تم الحفظ في حسابك."); else alert(js?.error || "فشل الحفظ");
  }

  async function ask(){
    if(!result || !question.trim()) return;
    const res = await fetch("/api/qa", {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ question, context: result })
    });
    const js = await res.json();
    setAnswer(js.answer || "لا توجد إجابة");
  }

  return (
    <main className="container py-10 space-y-8">
      <section className="text-center space-y-3">
        <div className="inline-block text-xs bg-emerald-900/40 text-emerald-300 px-3 py-1 rounded-full">PRO</div>
        <h1 className="text-3xl md:text-5xl">مولّد دراسة جدوى — دواجن لحم</h1>
        <p className="text-neutral-300 max-w-2xl mx-auto">اختر الدولة وأدخل الأرقام، ثم احصل على تقرير مفصل ويمكنك تنزيله PDF وطرح أسئلة.</p>
      </section>

      <section className="card p-6 space-y-4">
        {loading ? <p>تحميل الدول…</p> : (
          <>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label>الدولة</label>
                <select value={sel?.code||""} onChange={(e)=>setSel(countries.find(c=>c.code===e.target.value)||null)}>
                  {countries.map(c=> <option key={c.code} value={c.code}>{c.name} — {c.currencyCode}</option>)}
                </select>
                <div className="text-xs text-neutral-400 mt-1">{currencyNote}</div>
              </div>
              <div>
                <label>المدينة</label>
                <input value={city} onChange={(e)=>setCity(e.target.value)} placeholder="مثال: الفيوم" />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div><label>السعة (طيور/الدورة)</label><input type="number" value={capacity} onChange={(e)=>setCapacity(parseInt(e.target.value||"0"))} /></div>
              <div><label>سعر الكتكوت</label><input type="number" step="0.0001" value={chickPrice} onChange={(e)=>setChickPrice(parseFloat(e.target.value||"0"))} /></div>
              <div><label>نسبة النفوق %</label><input type="number" step="0.1" value={mortality} onChange={(e)=>setMortality(parseFloat(e.target.value||"0"))} /></div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div><label>علف بادي (للكجم)</label><input type="number" step="0.0001" value={feedStarter} onChange={(e)=>setFeedStarter(parseFloat(e.target.value||"0"))} /></div>
              <div><label>علف نامي (للكجم)</label><input type="number" step="0.0001" value={feedGrower} onChange={(e)=>setFeedGrower(parseFloat(e.target.value||"0"))} /></div>
              <div><label>علف ناهي (للكجم)</label><input type="number" step="0.0001" value={feedFinisher} onChange={(e)=>setFeedFinisher(parseFloat(e.target.value||"0"))} /></div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div><label>وزن التسويق (كجم)</label><input type="number" step="0.01" value={marketWeight} onChange={(e)=>setMarketWeight(parseFloat(e.target.value||"0"))} /></div>
              <div><label>سعر البيع/كجم</label><input type="number" step="0.0001" value={sellPricePerKg} onChange={(e)=>setSellPricePerKg(parseFloat(e.target.value||"0"))} /></div>
              <div><label>أدوية/كتكوت</label><input type="number" step="0.0001" value={medsPerChick} onChange={(e)=>setMedsPerChick(parseFloat(e.target.value||"0"))} /></div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div><label>العمالة/شهر</label><input type="number" step="0.01" value={laborPerMonth} onChange={(e)=>setLaborPerMonth(parseFloat(e.target.value||"0"))} /></div>
              <div><label>مصاريف تشغيل/شهر</label><input type="number" step="0.01" value={overheadsPerMonth} onChange={(e)=>setOverheadsPerMonth(parseFloat(e.target.value||"0"))} /></div>
            </div>

            <div className="flex gap-3 flex-wrap">
              <button className="btn" onClick={generate} disabled={busy}>{busy? "جاري الحساب..." : "احسب الدراسة"}</button>
              <button className="btn" onClick={downloadPdf} disabled={!result}>تحميل PDF</button>
              <button className="btn" onClick={savePlan} disabled={!result}>حفظ الخطة</button>
            </div>
          </>
        )}
      </section>

      {result && (
        <section className="card p-6 space-y-4">
          <h2 className="text-xl">النتائج</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg">الملخص</h3>
              <pre className="text-sm bg-neutral-950 border border-neutral-800 rounded-xl p-3 overflow-auto">{JSON.stringify(result.summary, null, 2)}</pre>
            </div>
            <div>
              <h3 className="text-lg">الحسابات</h3>
              <pre className="text-sm bg-neutral-950 border border-neutral-800 rounded-xl p-3 overflow-auto">{JSON.stringify(result.calculations, null, 2)}</pre>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg">تحليل الحساسية</h3>
              <pre className="text-sm bg-neutral-950 border border-neutral-800 rounded-xl p-3 overflow-auto">{JSON.stringify(result.sensitivity, null, 2)}</pre>
            </div>
            <div>
              <h3 className="text-lg">روابط مفيدة</h3>
              <ul className="list-disc pr-5 text-neutral-300">
                <li><a className="underline" href={result.links.suppliers} target="_blank">مورّدين في بلدك</a></li>
                <li><a className="underline" href={result.links.laws} target="_blank">القوانين والترخيص</a></li>
                <li><a className="underline" href={result.links.taxes} target="_blank">الضرائب</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg mb-2">اسأل عن الدراسة</h3>
            <div className="grid md:grid-cols-[1fr_auto] gap-3">
              <input placeholder="مثال: ما هي نقطة التعادل؟ أو أرباح دورة واحدة؟" value={question} onChange={(e)=>setQuestion(e.target.value)} />
              <button className="btn" onClick={ask}>اسأل</button>
            </div>
            {answer && <div className="mt-3 text-sm text-neutral-200">{answer}</div>}
          </div>
        </section>
      )}
    </main>
  );
}
