"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/utils/supabase/server";

export async function createFranchiseeAction(prevState, formData) {

  const supabase = await createSupabaseServerClient();
  const id_stato = formData.get("id_stato")?.trim();

  const payload = {
    ragione_sociale: formData.get("ragione_sociale")?.trim(),
    partita_iva: formData.get("partita_iva")?.trim(),
    cod_iva: formData.get("cod_iva")?.trim(),
    codice_univoco: formData.get("codice_univoco")?.trim() || null,
    pec: formData.get("pec")?.trim() || null,
    email: formData.get("email")?.trim() || null,
    tel: formData.get("tel")?.trim() || null,
    mobile: formData.get("mobile")?.trim() || null,
    referente: formData.get("referente")?.trim() || null,
    mobile_ref: formData.get("mobile_ref")?.trim() || null,
    email_ref: formData.get("email_ref")?.trim() || null,
    id_stato,

    cap_sl: null,
    citta_sl: null,
    provincia_sl: null,
    indirizzo_sl: null,
    indirizzo_sl_ext: null,
  };

  if (!payload.ragione_sociale || !payload.partita_iva || !payload.cod_iva || !payload.id_stato) {
    return {
      success: false,
      message: "Compila tutti i campi obbligatori.",
    };
  }

  if (id_stato === "IT") {
    payload.cap_sl = formData.get("cap_sl")?.trim();
    payload.citta_sl = formData.get("citta_sl")?.trim();
    payload.provincia_sl = formData.get("provincia_sl")?.trim();
    payload.indirizzo_sl = formData.get("indirizzo_sl")?.trim();

    if (!payload.cap_sl || !payload.citta_sl || !payload.provincia_sl || !payload.indirizzo_sl) {
      return {
        success: false,
        message: "Compila tutti i campi dell'indirizzo italiano.",
      };
    }
  } else {
    payload.indirizzo_sl_ext = formData.get("indirizzo_sl_ext")?.trim();

    if (!payload.indirizzo_sl_ext) {
      return {
        success: false,
        message: "Compila l'indirizzo estero.",
      };
    }
  }

  const { error } = await supabase.from("franchisee").insert(payload);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  revalidatePath("/manager/franchisee");

  return {
    success: true,
    message: "Franchisee inserito correttamente.",
  };
}