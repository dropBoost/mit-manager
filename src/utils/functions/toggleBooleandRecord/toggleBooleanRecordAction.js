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
];

const allowedFields = [
  "attivo",
];

export async function toggleBooleanRecordAction({
  tableName,
  idField = "id",
  id,
  booleanField,
  currentValue,
  pathToRevalidate,
}) {
  if (!tableName || !idField || !id || !booleanField) {
    return {
      success: false,
      message: "Dati mancanti.",
    };
  }

  if (!allowedTables.includes(tableName)) {
    return {
      success: false,
      message: "Tabella non autorizzata.",
    };
  }

  if (!allowedFields.includes(booleanField)) {
    return {
      success: false,
      message: "Campo non autorizzato.",
    };
  }

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from(tableName)
    .update({
      [booleanField]: !currentValue,
    })
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
    message: "Stato aggiornato correttamente.",
  };
}