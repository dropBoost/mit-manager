import { createSupabaseServerClient } from "@/utils/supabase/server";

export async function getCurrentAccount() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user?.email) {
    return null;
  }

  const { data: account, error: accountError } = await supabase
    .from("account")
    .select(`
      *,
      ruolo:ruolo (
        *
      )
    `)
    .eq("email", user.email)
    .maybeSingle();

  if (accountError) {
    console.error("Errore recupero account loggato:", accountError.message);
    return null;
  }

  return account;
}