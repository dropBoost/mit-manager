import { createSupabaseServerClient } from "@/utils/supabase/server";

export async function getOrdiniQuery({
  page = 1,
  limit = 10,
  search = "",
  sede = "",
  stato_ordine = "CRT",
  data = "",
} = {}) {
  const supabase = await createSupabaseServerClient();

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("ordine")
    .select(
      `
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
      ),
      righe:ordine_riga (*),
      stato:stato_avanzamento_ordine (*)
    `,
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(from, to);

  if (stato_ordine === "parzial") {
    query = query.in("stato_ordine", ["CRT", "LVR"]);
  } else if (stato_ordine && stato_ordine !== "all") {
    query = query.eq("stato_ordine", stato_ordine);
  }

  if (sede && sede !== "all") {
    query = query.eq("id_sede", sede);
  }

  if (data) {
    const start = `${data}T00:00:00`;
    const end = `${data}T23:59:59`;

    query = query.gte("created_at", start).lte("created_at", end);
  }

  if (search) {
    query = query.or(`note.ilike.%${search}%`);
  }

  const { data: ordini, error, count } = await query;

  if (error) {
    console.error("Errore Recupero Ordini:", error.message);

    return {
      ordini: [],
      count: 0,
      page,
      limit,
      totalPages: 0,
    };
  }

  return {
    ordini: ordini || [],
    count: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  };
}