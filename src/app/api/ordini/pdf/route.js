import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { OrdinePDF } from "@/components/pdf/ordine-pdf";

export async function POST(request) {
  try {
    const payload = await request.json();

    if (!payload?.ordine || !payload?.righe?.length) {
      return NextResponse.json(
        { message: "Payload ordine non valido." },
        { status: 400 }
      );
    }

    const pdfBuffer = await renderToBuffer(
      <OrdinePDF ordine={payload.ordine} righe={payload.righe} />
    );

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="ordine-${payload.ordine.id || "pdf"}.pdf"`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Errore generazione PDF." },
      { status: 500 }
    );
  }
}