"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/utils/supabase/server";

const allowedTables = [
  "ordine_spedizioni",
  "ordine_riga",
];

export async function deleteEvasioneAction({ idSpedizione, idRiga, pathToRevalidate }) {

  if (!idSpedizione) {
    return {
      success: false,
      message: "Id mancante per eliminare il record.",
    };
  }

  if (!allowedTables.includes("ordine_spedizioni")) {
    return {
      success: false,
      message: "Tabella non autorizzata.",
    };
  }

  const supabase = await createSupabaseServerClient();

  const { errorSpedizione } = await supabase
    .from("ordine_spedizioni")
    .delete()
    .eq("id", idSpedizione);

  if (errorSpedizione) {
    return {
      success: false,
      message: errorSpedizione.message,
    };
  }

  const { errorEvasione } = await supabase
    .from("ordine_riga")
    .update({stato_evasione: "inevaso"})
    .eq("id", idRiga);

  if (errorEvasione) {
    return {
      success: false,
      message: errorSpedizione.message,
    };
  }

  if (pathToRevalidate) {
    revalidatePath(pathToRevalidate);
  }

  return {
    success: true,
    message: "Evasione Annullata",
  };
}