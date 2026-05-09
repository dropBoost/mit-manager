import { createSupabaseServerClient } from "@/utils/supabase/server";

export async function getProdottoBrand() {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("prodotto_brand")
    .select(`*`)
    .order("brand", { ascending: true });

  if (error) {
    console.error("Errore Recupero Dati prodotto_brand", error.message);
    return [];
  }

  return data;
}