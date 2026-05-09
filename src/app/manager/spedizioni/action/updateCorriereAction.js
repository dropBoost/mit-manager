"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/utils/supabase/server";

export async function updateCorriereAction(prevState, formData) {
  const supabase = await createSupabaseServerClient();

  const cod = formData.get("cod")?.trim();

  if (!cod) {
    return {
      success: false,
      message: "Codice corriere mancante.",
    };
  }

  const payload = {
    nome_corriere: formData.get("nome_corriere")?.trim() || null,
    email: formData.get("email")?.trim() || null,
    riferimento: formData.get("riferimento")?.trim() || null,
    mobile: formData.get("mobile")?.trim() || null,
    tel: formData.get("tel")?.trim() || null,
    link_tracking: formData.get("link_tracking")?.trim() || null,
  };

  const { error } = await supabase
    .from("corriere")
    .update(payload)
    .eq("cod", cod);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  revalidatePath("/manager/corrieri");

  return {
    success: true,
    message: "Corriere aggiornato correttamente.",
  };
}