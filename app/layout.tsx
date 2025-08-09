// app/layout.tsx
export const metadata = {
  title: "MyBusiness MVP",
  description: "Business Plan Generator (Arabic/English)",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body style={{ margin: 0, fontFamily: "Arial, sans-serif", background: "#f5f5f5", color: "#333" }}>
        <header style={{ background: "#111", color: "#fff", padding: "10px 16px" }}>
          <nav style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a href="/" style={{ color: "#fff", textDecoration: "none" }}>الرئيسية</a>
            <a href="/about" style={{ color: "#ccc", textDecoration: "none" }}>عن المنصة</a>
            <a href="/pricing" style={{ color: "#ccc", textDecoration: "none" }}>الأسعار</a>
            <a href="/dashboard" style={{ color: "#ccc", textDecoration: "none" }}>لوحة التحكم</a>
            <a href="/contact" style={{ color: "#ccc", textDecoration: "none" }}>تواصل</a>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
