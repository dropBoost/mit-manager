import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { PackingListOrdiniFornitorePDF } from "@/components/pdf/packing-list-ordini-fornitore-pdf";

export async function POST(request) {
  try {
    const payload = await request.json();

    const {
      id_fornitore,
      fornitore_nome,
      data_da,
      data_a,
      stato_ordine,
      id_prodotto,
    } = payload;

    if (!id_fornitore || !data_da || !data_a) {
      return NextResponse.json(
        { message: "Dati mancanti." },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseServerClient();

    let query = supabase
      .from("ordine_riga")
      .select(`
        *,
        ordine:ordine (
          id,
          created_at,
          stato_ordine,
          note,
          sede:sede (
            id,
            citta,
            localita,
            indirizzo,
            franchisee:franchisee (
              id,
              ragione_sociale
            )
          )
        ),
        prodotto:prodotto (
          id,
          id_fornitore,
          fornitore:fornitore_prodotto (
            id,
            ragione_sociale
          )
        )
      `)
      .eq("prodotto.id_fornitore", id_fornitore)
      .gte("ordine.created_at", `${data_da}T00:00:00`)
      .lte("ordine.created_at", `${data_a}T23:59:59`)
      .order("created_at", { ascending: true });

    if (stato_ordine) {
      query = query.eq("ordine.stato_ordine", stato_ordine);
    }

    if (id_prodotto) {
      query = query.eq("id_prodotto", id_prodotto);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        { message: error.message },
        { status: 500 }
      );
    }

    const righe = (data || []).filter((riga) => {
      return riga.ordine && riga.prodotto?.id_fornitore === id_fornitore;
    });

    const pdfBuffer = await renderToBuffer(
      <PackingListOrdiniFornitorePDF
        fornitoreNome={fornitore_nome}
        dataDa={data_da}
        dataA={data_a}
        statoOrdine={stato_ordine}
        idProdotto={id_prodotto}
        righe={righe}
      />
    );

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="packing-list-${fornitore_nome || "fornitore"}.pdf"`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Errore generazione PDF." },
      { status: 500 }
    );
  }
}