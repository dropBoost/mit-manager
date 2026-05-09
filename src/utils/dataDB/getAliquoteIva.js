import { createSupabaseServerClient } from "@/utils/supabase/server";

export async function getAliquoteIva() {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("aliquota_iva")
    .select(`
      *,
      stato:cod_stato (
        id,
        stato,
        phone_prefix
      )
    `)
    .order("cod_stato", { ascending: true });

  if (error) {
    console.error("Errore Recupero Dati Aliquote IVA", error.message);
    return [];
  }

  return data;
}