"use server";

import { createSupabaseServerClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function signupAction(formData) {
  const supabase = await createSupabaseServerClient();

  const email = formData.get("email");
  const mobile = formData.get("mobile");
  const nome = formData.get("nome");
  const cognome = formData.get("cognome");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirm-password");
  const ruolo = formData.get("ruolo") || "manager";
  const displayName = `${nome} ${cognome}`

  if (password !== confirmPassword) {
    throw new Error("Le password non coincidono");
  }

  if (!email || !password || !nome || !cognome || !mobile) {
    throw new Error("Compila tutti i campi obbligatori");
  }

  const { data, error } = await supabase.auth.signUp({
    display_name:displayName,
    email,
    password,
    options: {
      data: {
        nome,
        cognome,
        email,
        mobile,
        ruolo,
        display_name: displayName,
        full_name: displayName
      },
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  redirect("/login?registered=true");
  
}