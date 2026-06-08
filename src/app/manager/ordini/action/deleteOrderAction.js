"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/utils/supabase/server";

const allowedTables = [
  "ordine",
];

export async function deleteOrderAction({ tableName, idField = "id", id, pathToRevalidate }) {
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
    message: "Ordine eliminato correttamente.",
  };
}