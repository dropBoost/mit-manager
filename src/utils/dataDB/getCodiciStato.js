import { createSupabaseServerClient } from "@/utils/supabase/server";

export async function getCodStato() {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("cod_stato")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error("Errore getCodStato:", error.message);
    return [];
  }

  return data;
}