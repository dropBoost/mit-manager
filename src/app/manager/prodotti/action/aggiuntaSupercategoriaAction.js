"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/utils/supabase/server";

export async function createSupercategoriaAction(prevState, formData) {
  const supabase = await createSupabaseServerClient();

  const supercategoria = formData.get("supercategoria")?.trim();

  if (!supercategoria) {
    return {
      success: false,
      message: "Inserisci il nome della supercategoria.",
    };
  }

  const { data: existing, error: checkError } = await supabase
    .from("supercategoria_prodotto")
    .select("supercategoria")
    .ilike("supercategoria", supercategoria)
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
      message: "Questa supercategoria esiste già.",
    };
  }

  const { error } = await supabase
    .from("supercategoria_prodotto")
    .insert({
      supercategoria,
    });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  revalidatePath("/manager/prodotti/categorie");

  return {
    success: true,
    message: "Supercategoria inserita correttamente.",
  };
}