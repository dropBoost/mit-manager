"use server";

import { createSupabaseServerClient } from "@/utils/supabase/server";

export async function checkBrandExistsAction(brand) {
  const supabase = await createSupabaseServerClient();

  const value = brand?.trim();

  if (!value) {
    return {
      exists: false,
      message: "",
    };
  }

  const { data, error } = await supabase
    .from("prodotto_brand")
    .select("brand")
    .ilike("brand", value)
    .maybeSingle();

  if (error) {
    return {
      exists: false,
      message: error.message,
    };
  }

  return {
    exists: !!data,
    message: data ? "Questo brand esiste già." : "",
  };
}