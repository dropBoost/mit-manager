"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/utils/supabase/server";

export async function updateFornitoreProdottoAction(prevState, formData) {
  const supabase = await createSupabaseServerClient();

  const id = formData.get("id");

  if (!id) {
    return {
      success: false,
      message: "ID fornitore mancante.",
    };
  }

  const { data: currentFornitore, error: fetchError } = await supabase
    .from("fornitore_prodotto")
    .select("id, stato, partita_iva")
    .eq("id", id)
    .single();

  if (fetchError || !currentFornitore) {
    return {
      success: false,
      message: "Fornitore non trovato.",
    };
  }

  const stato = currentFornitore.stato;

  const payload = {
    ragione_sociale: formData.get("ragione_sociale")?.trim(),
    partita_iva: currentFornitore.partita_iva,
    codice_univoco: formData.get("codice_univoco")?.trim() || null,
    pec: formData.get("pec")?.trim() || null,
    email: formData.get("email")?.trim(),
    tel: formData.get("tel")?.trim() || null,
    referente: formData.get("referente")?.trim() || null,
    mobile_ref: formData.get("mobile_ref")?.trim() || null,
    email_ref: formData.get("email_ref")?.trim() || null,

    cap_sl: null,
    citta_sl: null,
    provincia_sl: null,
    indirizzo_sl: null,
    cap_so: null,
    citta_so: null,
    provincia_so: null,
    indirizzo_so: null,
    indirizzo_sl_ext: null,
    indirizzo_so_ext: null,
  };

  if (!payload.ragione_sociale || !payload.email) {
    return {
      success: false,
      message: "Compila tutti i campi obbligatori.",
    };
  }

  if (stato === "IT") {
    payload.cap_sl = formData.get("cap_sl")?.trim();
    payload.citta_sl = formData.get("citta_sl")?.trim();
    payload.provincia_sl = formData.get("provincia_sl")?.trim();
    payload.indirizzo_sl = formData.get("indirizzo_sl")?.trim();

    payload.cap_so = formData.get("cap_so")?.trim() || null;
    payload.citta_so = formData.get("citta_so")?.trim() || null;
    payload.provincia_so = formData.get("provincia_so")?.trim() || null;
    payload.indirizzo_so = formData.get("indirizzo_so")?.trim() || null;

    if (
      !payload.cap_sl ||
      !payload.citta_sl ||
      !payload.provincia_sl ||
      !payload.indirizzo_sl
    ) {
      return {
        success: false,
        message: "Compila i campi obbligatori della sede legale.",
      };
    }
  } else {
    payload.indirizzo_sl_ext = formData.get("indirizzo_sl_ext")?.trim();
    payload.indirizzo_so_ext =
      formData.get("indirizzo_so_ext")?.trim() || null;

    if (!payload.indirizzo_sl_ext) {
      return {
        success: false,
        message: "Compila l’indirizzo estero della sede legale.",
      };
    }
  }

  const { error } = await supabase
    .from("fornitore_prodotto")
    .update(payload)
    .eq("id", id);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  revalidatePath("/manager/fornitori-anagrafica");

  return {
    success: true,
    message: "Fornitore aggiornato correttamente.",
  };
}