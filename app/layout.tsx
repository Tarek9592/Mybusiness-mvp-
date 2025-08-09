import "./globals.css";
import React from "react";
import Link from "next/link";

export const metadata = {
  title: "mybusiness – مولد خطط أعمال",
  description: "توليد خطط جاهزة (عربي/إنجليزي) للدواجن، الأعلاف، الزراعة، والمواشي.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <header className="border-b border-zinc-800">
          <nav className="container flex items-center justify-between py-4">
            <Link href="/" className="font-extrabold text-xl">mybusiness</Link>
            <div className="flex gap-4 text-sm">
              <Link href="/pricing">الأسعار</Link>
              <Link href="/about">من نحن</Link>
              <Link href="/contact">تواصل</Link>
              <Link href="/dashboard">لوحة التحكم</Link>
            </div>
          </nav>
        </header>
        {children}
        <footer className="border-t border-zinc-800 mt-16">
          <div className="container py-6 text-sm" style={{color:"#9ca3af"}}>
            © {new Date().getFullYear()} mybusiness — نسخة تجريبية (MVP)
          </div>
        </footer>
      </body>
    </html>
  );
}
