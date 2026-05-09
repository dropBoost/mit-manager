import { createSupabaseServerClient } from "@/utils/supabase/server";

export async function getSpedizioneProdottoById(id) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("ordine_spedizioni")
    .select(`
      *,
      corriere:corriere(*)
    `)
    .eq("id_ordine_riga", id)
    .single();

  if (error) {
    console.error("Errore Recupero Spedizione", error.message);
    return null;
  }

  return data;
}