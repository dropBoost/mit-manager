import { createSupabaseServerClient } from "../supabase/server";

export async function getOrdineById(id) {
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
    .eq("id", id)
    .single();

  if (error) {
    console.error("Errore recupero ordine:", error.message);
    return null;
  }

  return data;
}