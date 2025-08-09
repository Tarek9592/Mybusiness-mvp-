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
    <div style={{maxWidth:960, margin:"0 auto", padding:24}}>
      <div style={{background:"#111", padding:24, borderRadius:16, boxShadow:"0 10px 30px rgba(0,0,0,.25)"}}>
        <span style={{display:"inline-block", background:"#0d1f12", color:"#9ef8c9", padding:"6px 10px", borderRadius:999, fontSize:12, marginBottom:12}}>MVP • يعمل الآن</span>
        <h1>توليد خطة مشروع</h1>
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12}}>
          <div>
            <label>نوع المشروع</label>
            <select value={projectType} onChange={(e)=>setProjectType(e.target.value)} style={{width:"100%", padding:"12px 14px", borderRadius:10, background:"#0f0f0f", color:"#fff", border:"1px solid #222"}}>
              <option>تربية دواجن لحم</option>
              <option>مصنع أعلاف</option>
              <option>زراعة مدخلات أعلاف (ذرة/صويا)</option>
              <option>تربية ماشية (تسمين)</option>
            </select>
          </div>
          <div>
            <label>الدولة</label>
            <input value={country} onChange={(e)=>setCountry(e.target.value)} placeholder="الدولة" style={{width:"100%", padding:"12px 14px", borderRadius:10, background:"#0f0f0f", color:"#fff", border:"1px solid #222"}}/>
          </div>
          <div>
            <label>المنطقة/المدينة</label>
            <input value={location} onChange={(e)=>setLocation(e.target.value)} placeholder="المنطقة" style={{width:"100%", padding:"12px 14px", borderRadius:10, background:"#0f0f0f", color:"#fff", border:"1px solid #222"}}/>
          </div>
          <div>
            <label>رأس المال (دولار)</label>
            <input type="number" value={capital} onChange={(e)=>setCapital(parseInt(e.target.value||'0'))} style={{width:"100%", padding:"12px 14px", borderRadius:10, background:"#0f0f0f", color:"#fff", border:"1px solid #222"}}/>
          </div>
        </div>
        <button onClick={generatePlan} style={{marginTop:16, width:"100%", padding:"12px 16px", border:0, borderRadius:10, background:"#16a34a", color:"#fff", fontWeight:700, cursor:"pointer"}}>توليد الخطة الآن</button>
        {plan && (<>
          <hr style={{border:0, height:1, background:"#222", margin:"16px 0"}}/>
          <label>الخطة المولّدة</label>
          <textarea readOnly value={plan} style={{width:"100%", minHeight:220, padding:12, borderRadius:10, background:"#0f0f0f", color:"#fff", border:"1px solid #222"}}/>
        </>)}
        <div style={{marginTop:16, color:"#888", fontSize:12, textAlign:"center"}}>mybusiness.com © {new Date().getFullYear()} — نسخة أولية</div>
      </div>
    </div>
  );
}
