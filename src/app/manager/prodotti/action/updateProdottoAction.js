"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/utils/supabase/server";

const MAX_FILE_SIZE = 3 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export async function updateProdottoAction(prevState, formData) {
  const supabase = await createSupabaseServerClient();

  const id = formData.get("id");
  const nome = formData.get("nome")?.trim();
  const descrizione = formData.get("descrizione")?.trim() || "";
  const prezzo_riferimento = formData.get("prezzo_riferimento");
  const prezzo_vendita = formData.get("prezzo_vendita");
  const costo_acquisto = formData.get("costo_acquisto");
  const id_aliquota_iva_vendita = formData.get("id_aliquota_iva_vendita");
  const id_aliquota_iva_acquisto = formData.get("id_aliquota_iva_acquisto");
  const immagineFile = formData.get("immagine");

  if (!id) {
    return {
      success: false,
      message: "ID prodotto mancante.",
    };
  }

  if (
    !nome ||
    !prezzo_riferimento ||
    !prezzo_vendita ||
    !costo_acquisto ||
    !id_aliquota_iva_vendita ||
    !id_aliquota_iva_acquisto
  ) {
    return {
      success: false,
      message: "Compila tutti i campi obbligatori.",
    };
  }

  const payload = {
    nome,
    descrizione,
    prezzo_riferimento: Number(prezzo_riferimento),
    prezzo_vendita: Number(prezzo_vendita),
    costo_acquisto: Number(costo_acquisto),
    id_aliquota_iva_vendita,
    id_aliquota_iva_acquisto,
  };

  if (immagineFile && immagineFile.size > 0) {
    if (!ALLOWED_IMAGE_TYPES.includes(immagineFile.type)) {
      return {
        success: false,
        message: "Formato immagine non valido. Usa jpg, jpeg, png o webp.",
      };
    }

    if (immagineFile.size > MAX_FILE_SIZE) {
      return {
        success: false,
        message: "L'immagine non può superare i 3MB.",
      };
    }

    const ext = immagineFile.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${ext}`;
    const filePath = `prodotti/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("prodotti")
      .upload(filePath, immagineFile, {
        cacheControl: "3600",
        upsert: false,
        contentType: immagineFile.type,
      });

    if (uploadError) {
      return {
        success: false,
        message: uploadError.message,
      };
    }

    const { data: publicUrlData } = supabase.storage
      .from("prodotti")
      .getPublicUrl(filePath);

    payload.immagine = publicUrlData.publicUrl;
  }

  const { error } = await supabase
    .from("prodotto")
    .update(payload)
    .eq("id", id);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  revalidatePath("/manager/prodotti/anagrafica");

  return {
    success: true,
    message: "Prodotto aggiornato correttamente.",
  };
}