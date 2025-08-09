// app/api/generatePlan/route.ts
import { NextResponse } from "next/server";

// اختبار سريع من المتصفح (GET)
export async function GET() {
  return NextResponse.json({
    ok: true,
    hint: "استخدم POST على نفس الرابط مع JSON لإرجاع معاينة الخطة.",
    exampleBody: {
      type: "تربية دواجن لحم",
      country: "مصر",
      city: "الفيوم",
      capital: 12000
    }
  });
}

// توليد معاينة خطة (POST)
export async function POST(req: Request) {
  let data: any = {};
  try {
    data = await req.json();
  } catch {
    data = {};
  }

  const {
    type = "تربية دواجن لحم",
    country = "مصر",
    city = "الفيوم",
    capital = 10000
  } = data;

  const preview =
`📋 خطة مشروع: ${type}
الموقع: ${country} – ${city}
رأس المال: ${capital} دولار

✅ ملخص تنفيذي:
مشروع ${type} يستهدف السوق المحلي بإنتاج عالي الجودة مع ضبط التكاليف.

✅ التشغيل:
- دورة التشغيل: 35 يوم تربية + 15 يوم تطهير
- نموذج البيع: مستهلك نهائي + مطاعم + موردين

✅ تحليل SWOT:
• القوة: طلب مستقر على البروتين الحيواني
• الضعف: حساسية أسعار العلف
• الفرص: التوسع الإقليمي
• التهديدات: الأمراض وتقلبات السوق

📈 ملاحظة: هذه معاينة سريعة. سيتم توليد أرقام تفصيلية في الإصدارات التالية.`;

  return NextResponse.json({
    ok: true,
    input: { type, country, city, capital },
    preview
  });
}
