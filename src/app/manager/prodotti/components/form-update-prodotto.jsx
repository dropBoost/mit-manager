"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { Check, ChevronsUpDown } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

import { updateProdottoAction } from "../action/updateProdottoAction";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

const initialState = {
  success: false,
  message: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full gap-2 md:w-auto">
      {pending && <Spinner data-icon="inline-start" />}
      {pending ? "Aggiornamento..." : "Aggiorna prodotto"}
    </Button>
  );
}

function Field({
  name,
  label,
  required = false,
  type = "text",
  defaultValue = "",
  colspan = "",
}) {
  return (
    <div className={`space-y-2 ${colspan}`}>
      <Label htmlFor={name}>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>

      <Input
        id={name}
        name={name}
        type={type}
        step={type === "number" ? "0.01" : undefined}
        required={required}
        defaultValue={defaultValue || ""}
      />
    </div>
  );
}

function ReadOnlyField({ label, value, colspan = "" }) {
  return (
    <div className={`space-y-2 ${colspan}`}>
      <Label>{label}</Label>
      <Input value={value || ""} disabled />
    </div>
  );
}

function ComboboxField({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = "Seleziona",
  required = false,
  colspan = "",
}) {
  const [open, setOpen] = useState(false);

  const safeValue = value || "";
  const selected = options.find((item) => item.value === safeValue);

  return (
    <div className={`space-y-2 ${colspan}`}>
      <Label>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>

      <input
        type="hidden"
        name={name}
        value={safeValue}
        required={required}
      />

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            className="w-full justify-between"
          >
            {selected ? selected.label : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
          <Command>
            <CommandInput placeholder="Cerca..." />
            <CommandList>
              <CommandEmpty>Nessun risultato trovato.</CommandEmpty>
              <CommandGroup>
                {options.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.label}
                    onSelect={() => {
                      onChange(item.value || "");
                      setOpen(false);
                    }}
                  >
                    {item.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export function FormUpdateProdotto({ prodotto, aliquoteIva = [] }) {
  const [state, formAction] = useActionState(
    updateProdottoAction,
    initialState
  );

  const ivaVenditaInitial =
    prodotto?.ivaVendita?.id || prodotto?.id_aliquota_iva_vendita || "";

  const ivaAcquistoInitial =
    prodotto?.ivaAcquisto?.id || prodotto?.id_aliquota_iva_acquisto || "";

  const [selectedIvaVendita, setSelectedIvaVendita] = useState(
    ivaVenditaInitial || ""
  );

  const [selectedIvaAcquisto, setSelectedIvaAcquisto] = useState(
    ivaAcquistoInitial || ""
  );

  const [previewImage, setPreviewImage] = useState(prodotto?.immagine || null);

  function handlePreviewImage(event) {
    const file = event.target.files?.[0];

    if (!file) {
      setPreviewImage(prodotto?.immagine || null);
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setPreviewImage(imageUrl);
  }

  const brandLabel =
    typeof prodotto?.brand === "object"
      ? prodotto?.brand?.brand
      : prodotto?.brand;

  const categoriaLabel =
    typeof prodotto?.categoria === "object"
      ? prodotto?.categoria?.categoria
      : prodotto?.id_categoria;

  const fornitoreLabel =
    typeof prodotto?.fornitore === "object"
      ? prodotto?.fornitore?.ragione_sociale
      : "";

  const unitaLabel =
    typeof prodotto?.unita === "object"
      ? prodotto?.unita?.unita
      : prodotto?.unita;

  return (
    <div className="flex xl:flex-row flex-col gap-5">
      <Card className={`flex-1 xl:order-1 order-2`}>
        <CardContent>
          <form action={formAction} className="space-y-8">
            <input type="hidden" name="id" value={prodotto?.id || ""} />

            <div className="grid grid-cols-2 gap-5 lg:grid-cols-12">
              <ReadOnlyField
                label="Codice prodotto"
                value={prodotto?.codice_prodotto}
                colspan="md:col-span-12"
              />

              <ReadOnlyField
                label="SKU"
                value={prodotto?.sku}
                colspan="md:col-span-6"
              />

              <ReadOnlyField
                label="EAN"
                value={prodotto?.ean}
                colspan="md:col-span-6"
              />

              <ReadOnlyField
                label="Unità"
                value={unitaLabel}
                colspan="md:col-span-4"
              />

              <ReadOnlyField
                label="Brand"
                value={brandLabel}
                colspan="md:col-span-4"
              />

              <ReadOnlyField
                label="Fornitore"
                value={fornitoreLabel}
                colspan="md:col-span-4"
              />

              <ReadOnlyField
                label="Categoria"
                value={categoriaLabel}
                colspan="md:col-span-6"
              />

              <Field
                name="nome"
                label="Nome prodotto"
                required
                defaultValue={prodotto?.nome}
                colspan="md:col-span-6"
              />

              <Field
                name="prezzo_riferimento"
                label="Prezzo riferimento"
                type="number"
                required
                defaultValue={prodotto?.prezzo_riferimento}
                colspan="md:col-span-4"
              />

              <Field
                name="prezzo_vendita"
                label="Prezzo vendita"
                type="number"
                required
                defaultValue={prodotto?.prezzo_vendita}
                colspan="md:col-span-4"
              />

              <Field
                name="costo_acquisto"
                label="Costo acquisto"
                type="number"
                required
                defaultValue={prodotto?.costo_acquisto}
                colspan="md:col-span-4"
              />

              <ComboboxField
                name="id_aliquota_iva_vendita"
                label="IVA vendita"
                value={selectedIvaVendita}
                onChange={setSelectedIvaVendita}
                options={aliquoteIva}
                required
                placeholder="Seleziona IVA vendita"
                colspan="md:col-span-6"
              />

              <ComboboxField
                name="id_aliquota_iva_acquisto"
                label="IVA acquisto"
                value={selectedIvaAcquisto}
                onChange={setSelectedIvaAcquisto}
                options={aliquoteIva}
                required
                placeholder="Seleziona IVA acquisto"
                colspan="md:col-span-6"
              />

              <div className="space-y-2 md:col-span-12">
                <Label htmlFor="immagine">Immagine prodotto</Label>

                <Input
                  id="immagine"
                  name="immagine"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handlePreviewImage}
                />

                <p className="text-xs text-muted-foreground">
                  Formati accettati: jpg, jpeg, png, webp. Max 3MB.
                </p>

              </div>

              <div className="space-y-2 md:col-span-12">
                <Label htmlFor="descrizione">Descrizione</Label>

                <Textarea
                  id="descrizione"
                  name="descrizione"
                  defaultValue={prodotto?.descrizione || ""}
                  placeholder="Descrizione prodotto..."
                />
              </div>
            </div>

            {state?.message && (
              <div
                className={cn(
                  "rounded-md border p-4 text-sm",
                  state.success
                    ? "border-green-200 bg-green-50 text-green-700"
                    : "border-destructive/30 bg-destructive/10 text-destructive"
                )}
              >
                {state.message}
              </div>
            )}

            <div className="flex justify-end">
              <SubmitButton />
            </div>
          </form>
        </CardContent>
      </Card>
      <Card className={`w-fit xl:order-2 order-1 aspect-square`}>
        <CardContent>
          {previewImage && (
          <div className="overflow-hidden rounded-md border w-fit">
            <img
              src={previewImage}
              alt="Anteprima prodotto"
              className="max-h-50 max-w-50 object-cover object-center aspect-square"
              />
          </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
