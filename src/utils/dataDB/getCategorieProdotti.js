import { createSupabaseServerClient } from "@/utils/supabase/server";

export async function getCategorieProdotto() {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("categoria_prodotto")
    .select(`*,
      supercategoria:supercategoria_prodotto(*)
      `)
    .order("categoria", { ascending: true });

  if (error) {
    console.error("Errore getCategorieProdotto:", error.message);
    return [];
  }

  return data;
}