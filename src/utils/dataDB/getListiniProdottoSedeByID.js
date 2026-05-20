import { createSupabaseServerClient } from "@/utils/supabase/server";

export async function getListiniProdottoSedeByID(id) {

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("listino_prodotto")
    .select(`
      id,
      id_sede,
      id_prodotto,
      prezzo_riferimento,
      prezzo_vendita,
      attivo,
      minimo_ordine
    `)
    .eq(`id_sede`, id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Errore Recupero Listini:", error.message);
    return [];
  }

  return data;
}