import { createSupabaseServerClient } from "@/utils/supabase/server";

export async function getFornitoreProdottoById(id) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("fornitore_prodotto")
    .select(`
      *,
      stato:cod_stato (
        id,
        stato,
        phone_prefix
      )
    `)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Errore recupero fornitore:", error.message);
    return null;
  }

  return data;
}