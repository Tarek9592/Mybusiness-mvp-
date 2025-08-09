export const metadata = { title: 'mybusiness – Business Plan Generator', description: 'Generate Arabic/English business plans for poultry, feed, and livestock.' };
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
