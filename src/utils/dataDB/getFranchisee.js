import { createSupabaseServerClient } from "@/utils/supabase/server";

export async function getFranchisee() {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("franchisee")
    .select(`
      *,
      stato:cod_stato (
        id,
        stato,
        phone_prefix
      ),
      iva:aliquota_iva (
        id,
        nome,
        valore,
        cod_stato
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Errore Recupero Franchisee:", error.message);
    return [];
  }

  return data;
}