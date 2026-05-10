"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/utils/supabase/server";

const allowedTables = ["ordine"];

const allowedFields = ["stato_ordine"];

export async function toggleStatoOrdineAction({
  tableName,
  idField = "id",
  id,
  updateField,
  currentValue,
  pathToRevalidate,
}) {
  if (!tableName || !idField || !id || !updateField || !currentValue) {
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

  if (!allowedFields.includes(updateField)) {
    return {
      success: false,
      message: "Campo non autorizzato.",
    };
  }

  let setValue;

  if (currentValue === "CRT") {
    setValue = "LVR";
  } else if (currentValue === "LVR") {
    setValue = "CRT";
  } else {
    return {
      success: false,
      message: "Questo stato non può essere modificato manualmente.",
    };
  }

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from(tableName)
    .update({
      [updateField]: setValue,
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
    value: setValue,
  };
}