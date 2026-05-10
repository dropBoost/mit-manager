import { createSupabaseServerClient } from "../supabase/server";

export async function getOrdineCountProductByOrderID(id) {
  const supabase = await createSupabaseServerClient();

  const { count, error } = await supabase
    .from("ordine_riga")
    .select("*", { count: "exact", head: true })
    .eq("id_ordine", id)

  if (error) {
    console.error("Errore recupero ordine:", error.message);
    return 0;
  }

  return count || 0;
}