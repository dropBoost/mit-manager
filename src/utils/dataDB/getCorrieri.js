import { createSupabaseServerClient } from "@/utils/supabase/server";

export async function getCorrieri() {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("corriere")
    .select("*")
    .order("nome_corriere", { ascending: true });

  if (error) {
    console.error("Errore Recupero Corrieri:", error.message);
    return [];
  }

  return data;
}