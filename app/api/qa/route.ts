import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { isActive } from "@/lib/subscriptions";

export async function POST(req: Request){
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const ok = await isActive(userId);
  if (!ok) return NextResponse.json({ error: "Subscription required" }, { status: 402 });

  const { question, context } = await req.json();
  const q = (question||"").toLowerCase();

  const calc = context?.calculations || {};
  const sens = context?.sensitivity || {};

  let answer = "لم أفهم السؤال. جرّب صياغة أوضح.";

  if(q.includes("التعادل") || q.includes("break") || q.includes("breakeven")){
    answer = `نقطة التعادل التقريبية: ${Math.round((calc?.breakEven?.birds||0))} طائر أو ${Math.round((calc?.breakEven?.kg||0))} كجم.`;
  } else if(q.includes("الربح") || q.includes("profit") || q.includes("هامش")){
    answer = `الربح/الدورة (EBITDA): ${calc?.ebitda ?? 0} بالدولار تقريبًا.`;
  } else if(q.includes("عائد") || q.includes("roi")){
    answer = `العائد على الاستثمار (ROI): ${Math.round((calc?.roiPct||0)*100)/100}% تقريبًا.`;
  } else if(q.includes("استرداد") || q.includes("payback")){
    answer = `مدة الاسترداد: ${calc?.paybackMonths ?? "غير متاح"} شهر تقريبًا.`;
  } else if(q.includes("حساسية") || q.includes("sensitivity")){
    answer = `حساسية: بيع -10% = ${sens?.sellMinus10}, بيع +10% = ${sens?.sellPlus10}, علف +10% = ${sens?.feedPlus10}, علف -10% = ${sens?.feedMinus10}.`;
  } else if(q.includes("التغذية") || q.includes("العلف")){
    answer = `إجمالي العلف المطلوب: ${calc?.totalFeedKg ?? 0} كجم؛ متوسط سعر الكجم: ${calc?.avgFeedPrice ?? 0}$.`;
  } else if(q.includes("الإيراد") || q.includes("revenue")){
    answer = `إجمالي الإيراد/الدورة: ${calc?.revenue ?? 0} دولار.`;
  } else if(q.includes("التكلفة") || q.includes("cost")){
    answer = `التكلفة الإجمالية/الدورة: ${calc?.totalCost ?? 0} دولار (ثابتة ${calc?.fixedCosts ?? 0} + متغيرة ${(calc?.variableCosts ?? 0)}).`;
  }

  return NextResponse.json({ answer });
}
