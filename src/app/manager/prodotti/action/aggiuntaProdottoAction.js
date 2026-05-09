"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const MAX_FILE_SIZE = 3 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

function onlyConsonants(value = "") {
  return value
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Z]/g, "")
    .replace(/[AEIOU]/g, "");
}

function shuffleString(value = "") {
  return value
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
}

async function generateCodiceProdotto(supabase, { fornitore, brand, nome }) {
  const baseFornitore = onlyConsonants(fornitore).slice(0, 3);
  const baseBrand = onlyConsonants(brand).slice(0, 3);
  const baseNome = onlyConsonants(nome).slice(0, 3);

  const base = `${baseFornitore}${baseBrand}${baseNome}` || "PRD";

  let codice = shuffleString(base);

  for (let i = 0; i < 20; i++) {
    const { data } = await supabase
      .from("prodotto")
      .select("id")
      .eq("codice_prodotto", codice)
      .maybeSingle();

    if (!data) {
      return codice;
    }

    const random = Math.floor(100 + Math.random() * 900);
    codice = `${shuffleString(baseNome || base)}${random}`;
  }

  return `${base}${Date.now()}`;
}

export async function createProdottoAction(prevState, formData) {
  const supabase = await createSupabaseServerClient();

  const sku = formData.get("sku")?.trim() || null;
  const ean = formData.get("ean")?.trim() || null;
  const nome = formData.get("nome")?.trim();
  const descrizione = formData.get("descrizione")?.trim() || "";
  const prezzo_riferimento = formData.get("prezzo_riferimento");
  const prezzo_vendita = formData.get("prezzo_vendita");
  const costo_acquisto = formData.get("costo_acquisto");
  const unita = formData.get("unita")?.trim();
  const id_fornitore = formData.get("id_fornitore")?.trim();
  const id_categoria = formData.get("id_categoria")?.trim();
  const brand = formData.get("brand")?.trim();
  const id_aliquota_iva_vendita = formData.get("id_aliquota_iva_vendita")?.trim();
  const id_aliquota_iva_acquisto = formData.get("id_aliquota_iva_acquisto")?.trim();
  const immagineFile = formData.get("immagine");

  if (
    !nome ||
    !prezzo_riferimento ||
    !prezzo_vendita ||
    !costo_acquisto ||
    !unita ||
    !id_fornitore ||
    !id_categoria ||
    !brand ||
    !id_aliquota_iva_vendita ||
    !id_aliquota_iva_acquisto
  ) {
    return {
      success: false,
      message: "Compila tutti i campi obbligatori.",
    };
  }

  let immagineUrl = null;

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

    immagineUrl = publicUrlData.publicUrl;
  }

  const { data: fornitoreData, error: fornitoreError } = await supabase
    .from("fornitore_prodotto")
    .select("ragione_sociale")
    .eq("id", id_fornitore)
    .single();

  if (fornitoreError || !fornitoreData) {
    return {
      success: false,
      message: "Fornitore non trovato.",
    };
  }

  const codice_prodotto = await generateCodiceProdotto(supabase, {
    fornitore: fornitoreData.ragione_sociale,
    brand,
    nome,
  });

  const payload = {
    sku,
    ean,
    codice_prodotto,
    immagine: immagineUrl,
    nome,
    descrizione,
    prezzo_riferimento: Number(prezzo_riferimento),
    prezzo_vendita: Number(prezzo_vendita),
    costo_acquisto: Number(costo_acquisto),
    unita,
    id_fornitore,
    id_categoria,
    brand,
    id_aliquota_iva_vendita,
    id_aliquota_iva_acquisto,
  };

  const { error } = await supabase.from("prodotto").insert(payload);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  redirect("/manager/prodotti/anagrafica")
  
  return {
    success: true,
    message: `Prodotto inserito correttamente. Codice: ${codice_prodotto}`,
  };
  
}