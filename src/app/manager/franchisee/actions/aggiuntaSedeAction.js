"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/utils/supabase/server";

export async function createSedeAction(prevState, formData) {
  const supabase = await createSupabaseServerClient();

  const payload = {
    id_franchisee: formData.get("id_franchisee")?.trim() || null,
    id_stato: formData.get("id_stato")?.trim() || null,
    citta: formData.get("citta")?.trim() || null,
    localita: formData.get("localita")?.trim() || null,
    indirizzo: formData.get("indirizzo")?.trim() || null,
    tel: formData.get("tel")?.trim() || null,
    mobile: formData.get("mobile")?.trim() || null,
    email: formData.get("email")?.trim() || null,
    nominativo_ref: formData.get("nominativo_ref")?.trim() || null,
    mobile_ref: formData.get("mobile_ref")?.trim() || null,
    email_ref: formData.get("email_ref")?.trim() || null,
  };

  if (!payload.id_franchisee || !payload.id_stato) {
    return {
      success: false,
      message: "Seleziona franchisee e stato.",
    };
  }

  const { error } = await supabase.from("sede").insert(payload);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  revalidatePath("/manager/sedi");

  return {
    success: true,
    message: "Sede inserita correttamente.",
  };
}