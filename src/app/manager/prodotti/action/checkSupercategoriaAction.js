"use server";

import { createSupabaseServerClient } from "@/utils/supabase/server";

export async function checkSupercategoriaExistsAction(supercategoria) {
  const supabase = await createSupabaseServerClient();

  const value = supercategoria?.trim();

  if (!value) {
    return {
      exists: false,
      message: "",
    };
  }

  const { data, error } = await supabase
    .from("supercategoria_prodotto")
    .select("supercategoria")
    .ilike("supercategoria", value)
    .maybeSingle();

  if (error) {
    return {
      exists: false,
      message: error.message,
    };
  }

  return {
    exists: !!data,
    message: data ? "Questa supercategoria esiste già." : "",
  };
}