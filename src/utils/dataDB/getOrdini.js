import { createSupabaseServerClient } from "@/utils/supabase/server";

export async function getOrdini() {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("ordine")
    .select(`
      *,
      sede:sede (
        id,
        citta,
        localita,
        indirizzo,
        franchisee:franchisee (
          id,
          ragione_sociale
        )
      ),
      righe:ordine_riga (
        id,
        id_prodotto,
        nome_prodotto,
        codice_prodotto,
        quantita,
        unita,
        prezzo,
        sconto,
        tipologia_sconto,
        aliquota_iva,
        sku,
        ean,
        indirizzo_spedizione,
        created_at
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Errore Recupero Ordini:", error.message);
    return [];
  }

  return data;
}