import { ENV } from "@/lib/env";

const links = {
  monthly: ENV.PADDLE.MONTHLY,
  quarterly: ENV.PADDLE.QTR,
  semi: ENV.PADDLE.SEMI,
  yearly: ENV.PADDLE.YEARLY,
};

export default function Pricing(){
  const plans = [
    { name: "شهري", price: 10, href: links.monthly },
    { name: "ربع سنوي", price: 27, href: links.quarterly },
    { name: "نصف سنوي", price: 45, href: links.semi },
    { name: "سنوي", price: 60, href: links.yearly },
  ];
  return (
    <main className="container py-12 space-y-4">
      <h1 className="text-3xl font-extrabold text-center">الأسعار</h1>
      <div className="grid md:grid-cols-4 gap-4">
        {plans.map(p=>(
          <a key={p.name} href={p.href} className="card p-6 flex flex-col gap-3" target="_blank">
            <h2 className="text-xl font-bold">{p.name}</h2>
            <div className="text-4xl font-extrabold">${p.price}</div>
            <ul className="text-neutral-300 text-sm space-y-1 list-disc pr-5">
              <li>توليد غير محدود</li>
              <li>PDF احترافي</li>
              <li>حفظ الخطط</li>
            </ul>
            <div className="btn mt-auto text-center">اشترك الآن</div>
            <div className="text-xs text-neutral-400">الأسعار بالدولار؛ تُعرض محليًا حسب سعر الصرف.</div>
          </a>
        ))}
      </div>
    </main>
  );
}
