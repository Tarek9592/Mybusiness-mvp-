import Link from "next/link";
const plans = [
  { name: "شهري", price: 10, perks: ["توليد غير محدود", "PDF احترافي", "حفظ الخطط"] },
  { name: "ربع سنوي", price: 27, perks: ["كل مزايا الشهري", "وفر 10% تقريبًا"] },
  { name: "نصف سنوي", price: 45, perks: ["كل مزايا الشهري", "وفر 25%"] },
  { name: "سنوي", price: 60, perks: ["كل مزايا الشهري", "خصم 50%"] },
];
export default function Pricing() {
  return (
    <main className="container py-12">
      <h1 className="text-3xl font-extrabold mb-8 text-center">الأسعار</h1>
      <div className="grid md:grid-cols-4 gap-4">
        {plans.map(p => (
          <div key={p.name} className="card p-6 flex flex-col gap-3">
            <h2 className="text-xl font-bold">{p.name}</h2>
            <div className="text-4xl font-extrabold">${p.price}</div>
            <ul className="text-sm space-y-1 list-disc pr-5">
              {p.perks.map((k)=> <li key={k}>{k}</li>)}
            </ul>
            <Link href="#" className="btn mt-auto text-center">اشترك الآن</Link>
            <div className="text-xs" style={{color:"#9ca3af"}}>الأسعار بالدولار، وتُعرض محليًا حسب سعر الصرف.</div>
          </div>
        ))}
      </div>
    </main>
  );
}
