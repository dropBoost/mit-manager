"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { getSpedizioneOrdineById } from "@/utils/dataDB/getSpedizioniOrdineByID";
import { getOrdineCountProductByOrderID } from "@/utils/dataDB/getOrdiniCountProductByOrderID";

export async function createOrdineSpedizioneAction(prevState, formData) {

  const supabase = await createSupabaseServerClient();
  const id_ordine = formData.get("id_ordine")?.trim();
  const id_ordine_riga = formData.get("id_ordine_riga")?.trim();
  const cod_corriere = formData.get("cod_corriere")?.trim();
  const tracking = formData.get("tracking")?.trim() || null;
  const costo_spedizione = formData.get("costo_spedizione");
  const data_consegna = formData.get("data_consegna")
  const spedizioniOrdine = await getSpedizioneOrdineById(id_ordine)
  const numeroProdottiOrdine = await getOrdineCountProductByOrderID(id_ordine)
  const numeroSpedizioni = spedizioniOrdine?.length || 0

  if (numeroProdottiOrdine > 0 && numeroSpedizioni >= numeroProdottiOrdine) return

  if (!id_ordine || !id_ordine_riga || !cod_corriere || !costo_spedizione) {
    return {
      success: false,
      message: "Compila tutti i campi obbligatori.",
    };
  }

  if (numeroProdottiOrdine > 0 && numeroSpedizioni >= numeroProdottiOrdine) {
    return {
      success: false,
      message: "Tutti i prodotti dell'ordine risultano già spediti.",
    };
  }

  const { error } = await supabase.from("ordine_spedizioni").insert({
    id_ordine,
    id_ordine_riga,
    cod_corriere,
    tracking,
    data_consegna,
    costo_spedizione: Number(costo_spedizione),
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  const { errorStatoEvasione } = await supabase
    .from("ordine_riga")
    .update({stato_evasione: "evaso"})
    .eq("id", id_ordine_riga);

  if (errorStatoEvasione) {
    return {
      success: false,
      message: errorStatoEvasione.message,
    };
  }

  revalidatePath("/manager/ordini");

  return {
    success: true,
    message: "Spedizione inserita correttamente.",
  };

}