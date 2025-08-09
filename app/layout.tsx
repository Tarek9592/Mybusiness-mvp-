import "./globals.css";
import Link from "next/link";
import { ClerkProvider, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export const metadata = {
  title: "mybusiness – Business Plans Pro",
  description: "Professional business plan generator for MENA & Africa.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="ar" dir="rtl">
        <body>
          <header className="border-b border-neutral-800">
            <nav className="container flex items-center justify-between py-4">
              <Link href="/" className="text-xl font-extrabold">mybusiness</Link>
              <div className="flex items-center gap-4 text-sm text-neutral-300">
                <Link href="/pricing">الأسعار</Link>
                <Link href="/about">من نحن</Link>
                <Link href="/contact">تواصل</Link>
                <Link href="/dashboard">لوحة التحكم</Link>
                <SignedOut>
                  <Link className="btn" href="/sign-in">دخول</Link>
                  <Link className="btn" href="/sign-up">حساب جديد</Link>
                </SignedOut>
                <SignedIn>
                  <UserButton appearance={{ elements: { userButtonAvatarBox: "w-8 h-8" }}} />
                </SignedIn>
              </div>
            </nav>
          </header>
          {children}
          <footer className="border-t border-neutral-800 mt-16">
            <div className="container py-6 text-sm text-neutral-400">
              © {new Date().getFullYear()} mybusiness — Pro
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
