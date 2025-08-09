"use client";
import { useState } from 'react';

export default function Page() {
  const [projectType, setProjectType] = useState('تربية دواجن لحم');
  const [country, setCountry] = useState('مصر');
  const [location, setLocation] = useState('الفيوم');
  const [capital, setCapital] = useState(10000);
  const [plan, setPlan] = useState('');

  const generatePlan = () => {
    const summary = `\n📋 خطة مشروع: ${projectType}\nالدولة/المنطقة: ${country} – ${location}\nرأس المال: ${capital} دولار\n\n✅ ملخص تنفيذي:\nمشروع ${projectType} في ${location} يستهدف السوق المحلي والإقليمي بإنتاج عالي الجودة وبهيكل تكلفة مدروس.\n\n✅ التشغيل:\n- الدورة: 35 يوم تربية + 15 يوم تطهير\n- نموذج المبيعات: مستهلك نهائي + مطاعم + موردين\n\n✅ تحليل SWOT:\n• القوة: طلب مستقر على البروتين الحيواني\n• الضعف: حساسية أسعار العلف\n• الفرص: التوسع الإقليمي\n• التهديدات: الأمراض وتقلبات السوق\n\n📈 توقع مبدئي للسنة الأولى:\nسيتم تحسينه لاحقًا عبر الذكاء الاصطناعي وربطه بالأسعار الفعلية حسب الدولة.`;
    setPlan(summary);
  };

  return (
    <div className="container">
      <div className="card">
        <span className="badge">MVP • يعمل الآن</span>
        <h1>توليد خطة مشروع</h1>
        <div className="grid">
          <div>
            <label>نوع المشروع</label>
            <select value={projectType} onChange={(e)=>setProjectType(e.target.value)}>
              <option>تربية دواجن لحم</option>
              <option>مصنع أعلاف</option>
              <option>زراعة مدخلات أعلاف (ذرة/صويا)</option>
              <option>تربية ماشية (تسمين)</option>
            </select>
          </div>
          <div>
            <label>الدولة</label>
            <input value={country} onChange={(e)=>setCountry(e.target.value)} placeholder="الدولة" />
          </div>
          <div>
            <label>المنطقة/المدينة</label>
            <input value={location} onChange={(e)=>setLocation(e.target.value)} placeholder="المنطقة" />
          </div>
          <div>
            <label>رأس المال (دولار)</label>
            <input type="number" value={capital} onChange={(e)=>setCapital(parseInt(e.target.value||'0'))} />
          </div>
        </div>
        <button onClick={generatePlan}>توليد الخطة الآن</button>
        {plan && (<>
          <hr />
          <label>الخطة المولّدة</label>
          <textarea readOnly value={plan} />
        </>)}
        <div className="footer">mybusiness.com © {new Date().getFullYear()} — نسخة أولية قابلة للنشر على Vercel</div>
      </div>
    </div>
  );
}
