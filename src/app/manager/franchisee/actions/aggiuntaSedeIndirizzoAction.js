"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/utils/supabase/server";

export async function createSedeIndirizzoAction(prevState, formData) {
  const supabase = await createSupabaseServerClient();

  const payload = {
    id_sede: formData.get("id_sede")?.trim() || null,
    alias_indirizzo: formData.get("alias_indirizzo")?.trim() || null,
    nominativo: formData.get("nominativo")?.trim() || null,
    indirizzo: formData.get("indirizzo")?.trim() || null,
    numero_civico: formData.get("numero_civico")?.trim() || null,
    cap: formData.get("cap")?.trim() || null,
    citta: formData.get("citta")?.trim() || null,
    provincia: formData.get("provincia")?.trim() || null,
    stato: formData.get("stato")?.trim() || null,
    note_indirizzo: formData.get("note_indirizzo")?.trim() || null,
    email: formData.get("email")?.trim() || null,
    mobile: formData.get("mobile")?.trim() || null,
  };

  if (!payload.id_sede) {
    return {
      success: false,
      message: "Seleziona una sede.",
    };
  }

  const { error } = await supabase.from("sede_indirizzo").insert(payload);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  revalidatePath("/manager/sedi/indirizzi");

  return {
    success: true,
    message: "Indirizzo inserito correttamente.",
  };
}