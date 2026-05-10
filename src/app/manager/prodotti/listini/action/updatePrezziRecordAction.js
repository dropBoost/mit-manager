"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/utils/supabase/server";

const allowedTables = [
  "listino_prodotto",
  "prodotto",
];

const allowedFields = [
  "prezzo_riferimento",
  "prezzo_vendita",
];

export async function updatePrezziRecordAction(prevState, formData) {
  const supabase = await createSupabaseServerClient();

  const tableName = formData.get("tableName")?.trim();
  const idField = formData.get("idField")?.trim() || "id";
  const id = formData.get("id")?.trim();
  const pathToRevalidate = formData.get("pathToRevalidate")?.trim();

  const prezzo_riferimento = Number(formData.get("prezzo_riferimento"));
  const prezzo_vendita = Number(formData.get("prezzo_vendita"));

  if (!tableName || !idField || !id) {
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

  if (
    Number.isNaN(prezzo_riferimento) ||
    Number.isNaN(prezzo_vendita)
  ) {
    return {
      success: false,
      message: "Inserisci prezzi validi.",
    };
  }

  if (prezzo_vendita > prezzo_riferimento) {
    return {
      success: false,
      message: "Il prezzo vendita non può essere maggiore del prezzo riferimento.",
    };
  }

  const payload = {
    prezzo_riferimento,
    prezzo_vendita,
  };

  const { error } = await supabase
    .from(tableName)
    .update(payload)
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
    message: "Prezzi aggiornati correttamente.",
  };
}