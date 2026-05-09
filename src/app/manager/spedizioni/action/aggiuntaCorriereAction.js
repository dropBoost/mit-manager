"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/utils/supabase/server";

export async function createCorriereAction(prevState, formData) {
  const supabase = await createSupabaseServerClient();

  const payload = {
    cod: formData.get("cod")?.trim(),
    nome_corriere: formData.get("nome_corriere")?.trim() || null,
    email: formData.get("email")?.trim() || null,
    riferimento: formData.get("riferimento")?.trim() || null,
    mobile: formData.get("mobile")?.trim() || null,
    tel: formData.get("tel")?.trim() || null,
    link_tracking: formData.get("link_tracking")?.trim() || null,
  };

  if (!payload.cod) {
    return {
      success: false,
      message: "Il codice corriere è obbligatorio.",
    };
  }

  const { error } = await supabase.from("corriere").insert(payload);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  revalidatePath("/manager/corrieri");

  return {
    success: true,
    message: "Corriere inserito correttamente.",
  };
}