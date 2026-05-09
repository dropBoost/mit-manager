import { createSupabaseServerClient } from "@/utils/supabase/server";

export async function getSedeIndirizzi() {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("sede_indirizzo")
    .select(`
      *,
      sede:sede (
        id,
        citta,
        localita,
        indirizzo,
        franchisee:franchisee (
          id,
          ragione_sociale
        )
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Errore Recupero Indirizzi Sede:", error.message);
    return [];
  }

  return data;
}