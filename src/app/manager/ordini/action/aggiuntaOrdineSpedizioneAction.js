"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/utils/supabase/server";

export async function createOrdineSpedizioneAction(prevState, formData) {
  const supabase = await createSupabaseServerClient();

  const id_ordine = formData.get("id_ordine")?.trim();
  const id_ordine_riga = formData.get("id_ordine_riga")?.trim();
  const cod_corriere = formData.get("cod_corriere")?.trim();
  const tracking = formData.get("tracking")?.trim() || null;
  const costo_spedizione = formData.get("costo_spedizione");

  if (!id_ordine || !id_ordine_riga || !cod_corriere || !costo_spedizione) {
    return {
      success: false,
      message: "Compila tutti i campi obbligatori.",
    };
  }

  const { error } = await supabase.from("ordine_spedizioni").insert({
    id_ordine,
    id_ordine_riga,
    cod_corriere,
    tracking,
    costo_spedizione: Number(costo_spedizione),
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  revalidatePath("/manager/ordini");

  return {
    success: true,
    message: "Spedizione inserita correttamente.",
  };
}