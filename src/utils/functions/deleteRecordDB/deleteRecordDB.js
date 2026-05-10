"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/utils/supabase/server";

const allowedTables = [
  "fornitore_prodotto",
  "prodotto",
  "categoria_prodotto",
  "supercategoria_prodotto",
  "listino_prodotto",
  "notifiche",
  "franchisee",
];

export async function deleteRecordAction({ tableName, idField = "id", id, pathToRevalidate }) {
  if (!tableName || !idField || !id) {
    return {
      success: false,
      message: "Dati mancanti per eliminare il record.",
    };
  }

  if (!allowedTables.includes(tableName)) {
    return {
      success: false,
      message: "Tabella non autorizzata.",
    };
  }

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from(tableName)
    .delete()
    .eq(idField, id);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  if (pathToRevalidate) {
    revalidatePath(pathToRevalidate);
  }

  return {
    success: true,
    message: "Record eliminato correttamente.",
  };
}