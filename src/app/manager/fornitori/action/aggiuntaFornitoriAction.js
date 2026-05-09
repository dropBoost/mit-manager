"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/utils/supabase/server";

export async function createFornitoreProdottoAction(prevState, formData) {
  const supabase = await createSupabaseServerClient();

  const stato = formData.get("stato")?.trim();

  const payload = {
    ragione_sociale: formData.get("ragione_sociale")?.trim(),
    stato,
    partita_iva: formData.get("partita_iva")?.trim(),
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

  const required = ["ragione_sociale", "stato", "partita_iva", "email"];

  for (const field of required) {
    if (!payload[field]) {
      return {
        success: false,
        message: "Compila tutti i campi obbligatori.",
      };
    }
  }

  if (stato === "IT") {
    payload.cap_sl = formData.get("cap_sl")?.trim();
    payload.citta_sl = formData.get("citta_sl")?.trim();
    payload.provincia_sl = formData.get("provincia_sl")?.trim();
    payload.indirizzo_sl = formData.get("indirizzo_sl")?.trim();

    payload.cap_so = formData.get("cap_so")?.trim();
    payload.citta_so = formData.get("citta_so")?.trim();
    payload.provincia_so = formData.get("provincia_so")?.trim();
    payload.indirizzo_so = formData.get("indirizzo_so")?.trim();

    const addressRequired = [
      "cap_sl",
      "citta_sl",
      "provincia_sl",
      "indirizzo_sl",
    ];

    for (const field of addressRequired) {
      if (!payload[field]) {
        return {
          success: false,
          message: "Compila tutti i campi indirizzo italiani.",
        };
      }
    }
  } else {
    payload.indirizzo_sl_ext = formData.get("indirizzo_sl_ext")?.trim();
    payload.indirizzo_so_ext = formData.get("indirizzo_so_ext")?.trim();

    if (!payload.indirizzo_sl_ext || !payload.indirizzo_so_ext) {
      return {
        success: false,
        message: "Compila gli indirizzi esteri.",
      };
    }
  }

  const { error } = await supabase
    .from("fornitore_prodotto")
    .insert(payload);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  revalidatePath("/admin/fornitori-prodotto");

  return {
    success: true,
    message: "Fornitore prodotto creato correttamente.",
  };
}