import { createSupabaseServerClient } from "@/utils/supabase/server";

export async function getProdottoUnita() {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("prodotto_unita")
    .select(`*`)
    .order("alias", { ascending: true });

  if (error) {
    console.error("Errore Recupero Dati prodotto_unita:", error.message);
    return [];
  }

  return data;
}