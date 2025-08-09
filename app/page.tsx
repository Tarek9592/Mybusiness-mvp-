"use client";
import Link from "next/link";
import { useState } from "react";

export default function Page() {
  const [capital, setCapital] = useState<number>(10000);
  const [planPreview, setPlanPreview] = useState<string>("");

  const generatePreview = async () => {
    const res = await fetch("/api/generatePlan", {
      method: "POST",
      body: JSON.stringify({ type: "تربية دواجن لحم", country: "مصر", city: "الفيوم", capital })
    });
    const data = await res.json();
    setPlanPreview(data.preview);
  };

  return (
    <main className="container py-12 space-y-10">
      <section className="text-center space-y-4">
        <div className="inline-block text-xs" style={{background:"#064e3b",color:"#6ee7b7",padding:"4px 10px",borderRadius:"999px"}}>MVP يعمل الآن</div>
        <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
          خطط أعمال جاهزة للعربي وأفريقيا — في دقيقة
        </h1>
        <p className="max-w-2xl mx-auto" style={{color:"#d1d5db"}}>
          ابدأ بالدواجن، مصانع الأعلاف، زراعة المدخلات، والمواشي. جرّب معاينة الخطة مجانًا أو اشترك لتحميل PDF.
        </p>
        <div className="flex gap-3 justify-center">
          <Link className="btn" href="/pricing">الأسعار</Link>
          <button className="btn" onClick={generatePreview}>جرّب توليد خطة</button>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-6">
        <div className="card p-6 space-y-3">
          <h2 className="text-xl font-bold">تجربة سريعة</h2>
          <label className="text-sm" style={{color:"#9ca3af"}}>رأس المال (دولار)</label>
          <input
            type="number"
            className="w-full rounded-xl"
            style={{background:"#0a0a0a",border:"1px solid #1f2937",padding:"8px 12px"}}
            value={capital}
            onChange={(e)=>setCapital(parseInt(e.target.value || "0"))}
          />
          <button className="btn w-full" onClick={generatePreview}>توليد معاينة</button>
          {planPreview && (
            <textarea readOnly className="w-full h-56 mt-3 rounded-xl"
              style={{background:"#0a0a0a",border:"1px solid #1f2937",padding:"12px"}}
              value={planPreview}
            />
          )}
        </div>

        <div className="card p-6 space-y-3">
          <h2 className="text-xl font-bold">المشروعات المدعومة</h2>
          <ul className="list-disc pr-6" style={{color:"#d1d5db"}}>
            <li>🐔 تربية دواجن لحم</li>
            <li>🏭 مصانع أعلاف (صغير/متوسط)</li>
            <li>🌱 زراعة مدخلات الأعلاف (ذرة/صويا)</li>
            <li>🐄 تربية ماشية (تسمين)</li>
          </ul>
          <p className="text-sm" style={{color:"#9ca3af"}}>المزيد قريبًا.</p>
        </div>
      </section>
    </main>
  );
}
