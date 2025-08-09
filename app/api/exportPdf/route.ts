import PDFDocument from "pdfkit";
import { auth } from "@clerk/nextjs";
import { isActive } from "@/lib/subscriptions";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });
  const ok = await isActive(userId);
  if (!ok) return new Response("Subscription required", { status: 402 });

  try {
    const data = await req.json();
    const doc = new PDFDocument({ margin: 50 });
    const chunks: Buffer[] = [];
    doc.on("data", (c) => chunks.push(c as unknown as Buffer));
    const done = new Promise<Buffer>((resolve) => doc.on("end", () => resolve(Buffer.concat(chunks))));

    doc.fontSize(18).text("Business Plan – Poultry (Pro)", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Location: ${data?.summary?.location || ""}`);
    doc.text(`Currency: ${data?.summary?.currency || ""}`);
    doc.moveDown();
    doc.fontSize(14).text("Assumptions");
    doc.fontSize(10).text(JSON.stringify(data?.assumptions || {}, null, 2));
    doc.moveDown();
    doc.fontSize(14).text("Calculations");
    doc.fontSize(10).text(JSON.stringify(data?.calculations || {}, null, 2));
    doc.moveDown();
    doc.fontSize(14).text("Sensitivity");
    doc.fontSize(10).text(JSON.stringify(data?.sensitivity || {}, null, 2));
    doc.moveDown();
    doc.fontSize(10).fillColor("gray").text("Disclaimer: Estimates only. Review with a professional before investing.");

    doc.end();
    const buffer = await done;

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="business-plan.pdf"'
      }
    });
  } catch {
    return new Response("Bad request", { status: 400 });
  }
}
