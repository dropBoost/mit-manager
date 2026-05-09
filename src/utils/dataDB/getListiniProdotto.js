import { createSupabaseServerClient } from "@/utils/supabase/server";

export async function getListiniProdotto() {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("listino_prodotto")
    .select("*")
    .eq("attivo", true);

  if (error) {
    console.error("Errore Recupero Listini:", error.message);
    return [];
  }

  return data;
}