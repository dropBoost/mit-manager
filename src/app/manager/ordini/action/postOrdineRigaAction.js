"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/utils/supabase/server";

export async function postOrdineRigaAction(formData) {
  const supabase = await createSupabaseServerClient();

  const payload = {
    id_ordine: formData.get("id_ordine"),
    id_prodotto: formData.get("id_prodotto"),
    nome_prodotto: formData.get("nome_prodotto"),
    codice_prodotto: formData.get("codice_prodotto"),
    quantita: Number(formData.get("quantita") || 1),
    unita: formData.get("unita"),
    prezzo: Number(formData.get("prezzo") || 0),
    sconto: Number(formData.get("sconto") || 0),
    tipologia_sconto: formData.get("tipologia_sconto") || null,
    aliquota_iva: Number(formData.get("aliquota_iva") || 0),
    sku: formData.get("sku") || null,
    ean: formData.get("ean") || null,
    indirizzo_spedizione: formData.get("indirizzo_spedizione"),
  };

  if (!payload.id_ordine || !payload.id_prodotto) {
    return {
      success: false,
      message: "Ordine o prodotto mancante.",
    };
  }

  if (!payload.indirizzo_spedizione) {
    return {
      success: false,
      message: "Indirizzo spedizione obbligatorio.",
    };
  }

  const { error } = await supabase
    .from("ordine_riga")
    .insert(payload);

  if (error) {
    console.error("Errore inserimento riga ordine", error.message);

    return {
      success: false,
      message: error.message,
    };
  }

  revalidatePath("/manager/ordini");

  return {
    success: true,
    message: "Prodotto aggiunto all'ordine.",
  };
}