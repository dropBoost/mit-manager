import { createSupabaseServerClient } from "@/utils/supabase/server";

export async function getListiniProdotto() {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("listino_prodotto")
    .select(`
      *,
      prodotto:prodotto (
        id,
        nome,
        codice_prodotto,
        brand,
        prezzo_riferimento,
        prezzo_vendita,
        unita
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Errore Recupero Listini:", error.message);
    return [];
  }

  return data;
}