"use server";

export async function checkSuperAdminPassword(formData) {
  const password = formData.get("password");

  if (!password) {
    return { success: false, message: "Inserisci la password" };
  }

  if (password !== process.env.SUPER_ADMIN_SIGNUP_PASSWORD) {
    return { success: false, message: "Password non corretta" };
  }

  return { success: true };
}