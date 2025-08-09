// app/page.tsx
"use client";
import React from "react";

export default function Home() {
  const [type, setType] = React.useState("تربية دواجن لحم");
  const [country, setCountry] = React.useState("مصر");
  const [city, setCity] = React.useState("الفيوم");
  const [capital, setCapital] = React.useState(10000);
  const [loading, setLoading] = React.useState(false);
  const [preview, setPreview] = React.useState<string>("");

  async function generate() {
    try {
      setLoading(true);
      setPreview("");
      const res = await fetch("/api/generatePlan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, country, city, capital }),
      });
      const json = await res.json();
      setPreview(json.preview || "لم يتم إرجاع نص.");
    } catch (e) {
      setPreview("حصل خطأ.. جرّب تاني.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: "20px", maxWidth: 800, margin: "0 auto" }}>
      <h1>مولِّد خطط الأعمال – النسخة التجريبية</h1>
      <p>ادخل البيانات واضغط توليد المعاينة.</p>

      <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
        <label>
          نوع المشروع
          <input
            value={type}
            onChange={(e) => setType(e.target.value)}
            style={{ width: "100%", padding: 8 }}
          />
        </label>

        <label>
          الدولة
          <input
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            style={{ width: "100%", padding: 8 }}
          />
        </label>

        <label>
          المدينة
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            style={{ width: "100%", padding: 8 }}
          />
        </label>

        <label>
          رأس المال (دولار)
          <input
            type="number"
            value={capital}
            onChange={(e) => setCapital(Number(e.target.value))}
            style={{ width: "100%", padding: 8 }}
          />
        </label>

        <button
          onClick={generate}
          disabled={loading}
          style={{
            padding: "10px 16px",
            cursor: "pointer",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "جاري التوليد..." : "توليد المعاينة"}
        </button>
      </div>

      <div style={{ whiteSpace: "pre-wrap", marginTop: 24, background: "#fff", padding: 16, borderRadius: 8 }}>
        {preview ? preview : "سيظهر هنا النص بعد التوليد."}
      </div>
    </main>
  );
}
