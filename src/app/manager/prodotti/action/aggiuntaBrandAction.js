"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/utils/supabase/server";

export async function createBrandAction(prevState, formData) {
  const supabase = await createSupabaseServerClient();

  const brand = formData.get("brand")?.trim();

  if (!brand) {
    return {
      success: false,
      message: "Inserisci il nome del brand.",
    };
  }

  const { data: existing, error: checkError } = await supabase
    .from("prodotto_brand")
    .select("brand")
    .ilike("brand", brand)
    .maybeSingle();

  if (checkError) {
    return {
      success: false,
      message: checkError.message,
    };
  }

  if (existing) {
    return {
      success: false,
      message: "Questo brand esiste già.",
    };
  }

  const { error } = await supabase.from("prodotto_brand").insert({
    brand,
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  revalidatePath("/manager/prodotti");

  return {
    success: true,
    message: "Brand inserito correttamente.",
  };
}