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
        *,
        evasione:ordine_spedizioni(*),
        prodotto:prodotto (
          id,
          id_fornitore,
          fornitore:fornitore_prodotto (
            id,
            ragione_sociale
          )
        )
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