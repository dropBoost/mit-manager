import { createSupabaseServerClient } from "@/utils/supabase/server";

export async function getSupercategorieProdotto() {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("supercategoria_prodotto")
    .select(`*`)
    .order("supercategoria", { ascending: true });

  if (error) {
    console.error("Errore getsupercategoria:", error.message);
    return [];
  }

  return data;
}