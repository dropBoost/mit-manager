import { createSupabaseServerClient } from "@/utils/supabase/server";

export async function getSedi() {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("sede")
    .select(`
      *,
      franchisee:franchisee (
        id,
        ragione_sociale
      ),
      stato:cod_stato (
        id,
        stato
      )
    `)
    .order("citta", { ascending: true });

  if (error) {
    console.error("Errore Recupero Sedi:", error.message);
    return [];
  }

  return data;
}