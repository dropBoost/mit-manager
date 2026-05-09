"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/utils/supabase/server";

export async function updateSedeAction(prevState, formData) {
  const supabase = await createSupabaseServerClient();

  const id = formData.get("id");

  if (!id) {
    return {
      success: false,
      message: "ID sede mancante.",
    };
  }

  const payload = {
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

  const { error } = await supabase
    .from("sede")
    .update(payload)
    .eq("id", id);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  revalidatePath("/manager/sedi");

  return {
    success: true,
    message: "Sede aggiornata correttamente.",
  };
}