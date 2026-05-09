import { createSupabaseServerClient } from "@/utils/supabase/server";

export async function getProdotto() {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("prodotto_completo_left_join")
    .select(`*`)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Errore Recupero Dati Prodotti", error.message);
    return [];
  }

  return data;
}