"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { Check, ChevronsUpDown } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

import { createProdottoAction } from "../action/aggiuntaProdottoAction";

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
      {pending ? "Inserimento..." : "Inserisci prodotto"}
    </Button>
  );
}

function Field({ name, label, required = false, type = "text", colspan, step }) {
  return (
    <div className={`space-y-2 ${colspan || ""}`}>
      <Label htmlFor={name}>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>

      <Input id={name} name={name} type={type} required={required} step={step}/>
    </div>
  );
}

function ComboboxField({ label, name, value, onChange, options = [], placeholder = "Seleziona", required = false, colspan }) {
  const [open, setOpen] = useState(false);

  const selected = options.find((item) => item.value === value);

  return (
    <div className={`space-y-2 ${colspan || ""}`}>
      <Label>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>

      <input type="hidden" name={name} value={value} required={required} />

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
                      onChange(item.value);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === item.value ? "opacity-100" : "opacity-0"
                      )}
                    />
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

export function FormProdotto({ unita = [], fornitori = [], categorie = [], brands = [], aliquoteIva = [] }) {

  const [state, formAction] = useActionState(createProdottoAction, initialState);
  const [selectedUnita, setSelectedUnita] = useState("");
  const [selectedFornitore, setSelectedFornitore] = useState("");
  const [selectedCategoria, setSelectedCategoria] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedIvaVendita, setSelectedIvaVendita] = useState("");
  const [selectedIvaAcquisto, setSelectedIvaAcquisto] = useState("");
  const [previewImage, setPreviewImage] = useState(null);

  function handlePreviewImage(event) {
    const file = event.target.files?.[0];

    if (!file) {
      setPreviewImage(null);
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setPreviewImage(imageUrl);
  }
  
  return (
    <div className="flex flex-row gap-5">
      <Card className={`flex-1 p-5 py-10`}>
        <CardContent>
          <form action={formAction} className="space-y-8">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
              <Field
                name="nome"
                label="Nome prodotto"
                required
                colspan="md:col-span-4"
              />

              <Field name="sku" label="SKU" colspan="md:col-span-2" />

              <Field name="ean" label="EAN" colspan="md:col-span-2" />

              <ComboboxField
                name="brand"
                label="Brand"
                value={selectedBrand}
                onChange={setSelectedBrand}
                options={brands}
                required
                placeholder="Seleziona brand"
                colspan="md:col-span-4"
              />

              <ComboboxField
                name="id_fornitore"
                label="Fornitore"
                value={selectedFornitore}
                onChange={setSelectedFornitore}
                options={fornitori}
                required
                placeholder="Seleziona fornitore"
                colspan="md:col-span-4"
              />

              <ComboboxField
                name="id_categoria"
                label="Categoria"
                value={selectedCategoria}
                onChange={setSelectedCategoria}
                options={categorie}
                required
                placeholder="Seleziona categoria"
                colspan="md:col-span-4"
              />

              <ComboboxField
                name="unita"
                label="Unità"
                value={selectedUnita}
                onChange={setSelectedUnita}
                options={unita}
                required
                placeholder="Seleziona unità"
                colspan="md:col-span-4"
              />

              <Field
                name="prezzo_riferimento"
                label="Prezzo riferimento"
                type="number"
                step="0.01"
                required
                colspan="md:col-span-3"
              />

              <Field
                name="prezzo_vendita"
                label="Prezzo vendita"
                type="number"
                step="0.01"
                required
                colspan="md:col-span-3"
              />

              <Field
                name="costo_acquisto"
                label="Costo acquisto"
                type="number"
                step="0.01"
                required
                colspan="md:col-span-3"
              />

              <ComboboxField
                name="id_aliquota_iva_vendita"
                label="IVA vendita"
                value={selectedIvaVendita}
                onChange={setSelectedIvaVendita}
                options={aliquoteIva}
                required
                placeholder="Seleziona IVA vendita"
                colspan="md:col-span-3"
              />

              <ComboboxField
                name="id_aliquota_iva_acquisto"
                label="IVA acquisto"
                value={selectedIvaAcquisto}
                onChange={setSelectedIvaAcquisto}
                options={aliquoteIva}
                required
                placeholder="Seleziona IVA acquisto"
                colspan="md:col-span-3"
              />

              <div className="space-y-2 md:col-span-6">
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
      <Card className={`basis-3/12`}>
        <CardContent>
        Foto Prodotto:
        {previewImage ? 
          <div className="overflow-hidden rounded-md border aspect-square">
            <img
              src={previewImage}
              alt="Anteprima prodotto"
              className="h-full w-full object-cover"
            />
          </div> : 
          <div className="overflow-hidden rounded-md border aspect-square bg-primary">
            <img
              src={`/logo.png`}
              alt="Anteprima prodotto"
              className="h-full w-full object-cover"
            />
          </div>
        }
        </CardContent>
      </Card>
    </div>
  );
}


