"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/utils/supabase/server";

export async function createCategoriaProdottoAction(prevState, formData) {
  const supabase = await createSupabaseServerClient();

  const categoria = formData.get("categoria")?.trim();
  const supercategoria = formData.get("supercategoria")?.trim();

  if (!categoria || !supercategoria) {
    return {
      success: false,
      message: "Compila categoria e supercategoria.",
    };
  }

  const { error } = await supabase.from("categoria_prodotto").insert({
    categoria,
    supercategoria,
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  revalidatePath("/manager/categorie-prodotto");

  return {
    success: true,
    message: "Categoria inserita correttamente.",
  };
}