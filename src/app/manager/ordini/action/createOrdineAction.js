"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/utils/supabase/server";

export async function createOrdineAction(prevState, formData) {
  const supabase = await createSupabaseServerClient();

  const id_sede = formData.get("id_sede")?.trim();
  const id_account = formData.get("id_account")?.trim() || null;
  const note = formData.get("note")?.trim() || null;
  const righeRaw = formData.get("righe");

  if (!id_sede) {
    return {
      success: false,
      message: "Seleziona una sede.",
    };
  }

  let righe = [];

  try {
    righe = JSON.parse(righeRaw || "[]");
  } catch {
    return {
      success: false,
      message: "Errore nella lettura delle righe ordine.",
    };
  }

  if (!righe.length) {
    return {
      success: false,
      message: "Aggiungi almeno un prodotto all'ordine.",
    };
  }

  const { data: ordine, error: ordineError } = await supabase
    .from("ordine")
    .insert({
      id_sede,
      id_account,
      note,
    })
    .select("id")
    .single();

  if (ordineError) {
    return {
      success: false,
      message: ordineError.message,
    };
  }

  const righePayload = righe.map((riga) => ({
    id_ordine: ordine.id,
    id_prodotto: riga.id_prodotto,
    nome_prodotto: riga.nome_prodotto,
    codice_prodotto: riga.codice_prodotto,
    quantita: Number(riga.quantita),
    unita: riga.unita,
    prezzo: Number(riga.prezzo),
    sconto: riga.sconto ? Number(riga.sconto) : null,
    tipologia_sconto: riga.tipologia_sconto || null,
    aliquota_iva: riga.aliquota_iva ? Number(riga.aliquota_iva) : null,
    sku: riga.sku || null,
    ean: riga.ean || null,
    indirizzo_spedizione: riga.indirizzo_spedizione,
  }));

  const { error: righeError } = await supabase
    .from("ordine_riga")
    .insert(righePayload);

  if (righeError) {
    await supabase.from("ordine").delete().eq("id", ordine.id);

    return {
      success: false,
      message: righeError.message,
    };
  }

  revalidatePath("/manager/ordini");

  return {
    success: true,
    message: "Ordine creato correttamente.",
  };
}