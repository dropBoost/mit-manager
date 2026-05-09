import { createSupabaseServerClient } from "@/utils/supabase/server";

export async function getFornitoriProdotto() {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("fornitore_prodotto")
    .select(`*,
      stato:cod_stato(*)`)
    .order("ragione_sociale", { ascending: true });

  if (error) {
    console.error("Errore getFornitoriProdotto:", error.message);
    return [];
  }

  return data;
}