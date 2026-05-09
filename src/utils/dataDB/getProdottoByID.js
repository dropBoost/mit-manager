import { createSupabaseServerClient } from "@/utils/supabase/server";

export async function getProdottoById(id) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("prodotto")
    .select(`
      *,
      unita:prodotto_unita (
        unita
      ),
      fornitore:fornitore_prodotto (
        id,
        ragione_sociale
      ),
      categoria:categoria_prodotto (
        categoria,
        supercategoria:supercategoria_prodotto (
          supercategoria
        )
      ),
      brand:prodotto_brand (
        brand
      ),
      ivaVendita:aliquota_iva!prodotto_id_aliquota_iva_vendita_fkey (
        id,
        valore,
        nome,
        cod_stato
      ),
      ivaAcquisto:aliquota_iva!prodotto_id_aliquota_iva_acquisto_fkey (
        id,
        valore,
        nome,
        cod_stato
      )
    `)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Errore Recupero Prodotto:", error.message);
    return null;
  }

  return data;
}