"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/utils/supabase/server";

export async function updateBrandAction(prevState, formData) {
  const supabase = await createSupabaseServerClient();

  const oldBrand = formData.get("old_brand")?.trim();
  const brand = formData.get("brand")?.trim();

  if (!oldBrand || !brand) {
    return {
      success: false,
      message: "Brand mancante.",
    };
  }

  const { error } = await supabase
    .from("prodotto_brand")
    .update({ brand })
    .eq("brand", oldBrand);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  revalidatePath("/manager/prodotti");

  return {
    success: true,
    message: "Brand aggiornato correttamente.",
  };
}