"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/utils/supabase/server";

const CHUNK_SIZE = 200;

export async function createListinoProdottoBulkAction(prevState, formData) {
  const supabase = await createSupabaseServerClient();

  const id_sede = formData.get("id_sede")?.trim();
  const productIdsRaw = formData.get("product_ids");

  if (!id_sede) {
    return {
      success: false,
      message: "Seleziona una sede.",
    };
  }

  let productIds = [];

  try {
    productIds = JSON.parse(productIdsRaw || "[]");
  } catch {
    return {
      success: false,
      message: "Errore nella lettura dei prodotti.",
    };
  }

  if (!productIds.length) {
    return {
      success: false,
      message: "Non ci sono prodotti da inserire nel listino.",
    };
  }

  const { data: existingRows, error: existingError } = await supabase
    .from("listino_prodotto")
    .select("id_prodotto")
    .eq("id_sede", id_sede)
    .in("id_prodotto", productIds);

  if (existingError) {
    return {
      success: false,
      message: existingError.message,
    };
  }

  const existingIds = new Set(existingRows.map((item) => item.id_prodotto));

  const payload = [];

  for (const id_prodotto of productIds) {
    if (existingIds.has(id_prodotto)) continue;

    const prezzo_riferimento = Number(
      formData.get(`prezzo_riferimento_${id_prodotto}`)
    );

    const prezzo_vendita = Number(
      formData.get(`prezzo_vendita_${id_prodotto}`)
    );

    const minimo_ordine = Number(
      formData.get(`minimo_ordine_${id_prodotto}`)
    );

    if (
      Number.isNaN(prezzo_riferimento) ||
      Number.isNaN(minimo_ordine) ||
      Number.isNaN(prezzo_vendita)
    ) {
      return {
        success: false,
        message: "Controlla i prezzi inseriti.",
      };
    }

    if (prezzo_vendita > prezzo_riferimento) {
      return {
        success: false,
        message: "Il prezzo vendita non può essere maggiore del prezzo riferimento.",
      };
    }

    payload.push({
      id_sede,
      id_prodotto,
      prezzo_riferimento,
      prezzo_vendita,
      minimo_ordine,
      attivo: true,
    });
  }

  if (!payload.length) {
    return {
      success: false,
      message: "Tutti i prodotti selezionati sono già presenti nel listino.",
    };
  }

  for (let i = 0; i < payload.length; i += CHUNK_SIZE) {
    const chunk = payload.slice(i, i + CHUNK_SIZE);

    const { error } = await supabase
      .from("listino_prodotto")
      .insert(chunk);

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  revalidatePath("/manager/listini");

  return {
    success: true,
    message: `Listino creato correttamente per ${payload.length} prodotti.`,
  };
}