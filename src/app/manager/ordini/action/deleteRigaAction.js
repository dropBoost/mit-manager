"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/utils/supabase/server";

const allowedTables = [
  "ordine_riga",
];

export async function deleteRigaAction({ idRiga, statoEvasione, statoOrdine, pathToRevalidate }) {

  if (!idRiga) {
    return {
      success: false,
      message: "Id mancante per eliminare il record.",
    };
  }

  if (!statoEvasione) {
    return {
      success: false,
      message: "Errore: stato evasione mancante",
    };
  }

  if (statoEvasione == "evaso") {
    return {
      success: false,
      message: "Non è possibile eliminare prodotti evasi",
    };
  }

  if (statoOrdine == "CPL") {
    return {
      success: false,
      message: "Non è possibile eliminare prodotti da ordini completati",
    };
  }

  if (!allowedTables.includes("ordine_riga")) {
    return {
      success: false,
      message: "Tabella non autorizzata.",
    };
  }

  const supabase = await createSupabaseServerClient();

  const { errorRiga } = await supabase
    .from("ordine_riga")
    .delete()
    .eq("id", idRiga);

  if (errorRiga) {
    return {
      success: false,
      message: errorRiga.message,
    };
  }

  if (pathToRevalidate) {
    revalidatePath(pathToRevalidate);
  }

  return {
    success: true,
    message: "Prodotto Eliminato",
  };
}