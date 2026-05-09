"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { Check, ChevronsUpDown } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

import { createFranchiseeAction } from "../actions/aggiuntaFranchiseeAction";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
      {pending ? "Inserimento..." : "Inserisci franchisee"}
    </Button>
  );
}

function Field({ name, label, required = false, type = "text", colspan = "" }) {
  return (
    <div className={`space-y-2 ${colspan}`}>
      <Label htmlFor={name}>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>

      <Input id={name} name={name} type={type} required={required} />
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

  const selected = options.find((item) => item.value === value);

  return (
    <div className={`space-y-2 ${colspan}`}>
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

export function FormFranchisee({ stati = [], aliquoteIva = [] }) {
  const [state, formAction] = useActionState(
    createFranchiseeAction,
    initialState
  );

  const [selectedStato, setSelectedStato] = useState("");
  const [selectedIva, setSelectedIva] = useState("");

  const isItalia = selectedStato === "IT";
  const isEstero = selectedStato && selectedStato !== "IT";

  return (
    <Card>
      <CardContent>
        <form action={formAction} className="space-y-8">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
            <Field
              name="ragione_sociale"
              label="Ragione sociale"
              required
              colspan="md:col-span-4"
            />

            <ComboboxField
              name="id_stato"
              label="Stato"
              value={selectedStato}
              onChange={setSelectedStato}
              options={stati}
              required
              placeholder="Seleziona stato"
              colspan="md:col-span-4"
            />

            <ComboboxField
              name="cod_iva"
              label="Aliquota IVA"
              value={selectedIva}
              onChange={setSelectedIva}
              options={aliquoteIva}
              required
              placeholder="Seleziona aliquota IVA"
              colspan="md:col-span-4"
            />

            <Field
              name="partita_iva"
              label="Partita IVA"
              required
              colspan="md:col-span-3"
            />

            <Field
              name="codice_univoco"
              label="Codice univoco"
              colspan="md:col-span-3"
            />

            <Field name="pec" label="PEC" type="email" colspan="md:col-span-3" />

            <Field
              name="email"
              label="Email"
              type="email"
              colspan="md:col-span-3"
            />

            <Field name="tel" label="Telefono" colspan="md:col-span-3" />

            <Field name="mobile" label="Mobile" colspan="md:col-span-3" />

            <Field name="referente" label="Referente" colspan="md:col-span-3" />

            <Field
              name="mobile_ref"
              label="Mobile referente"
              colspan="md:col-span-3"
            />

            <Field
              name="email_ref"
              label="Email referente"
              type="email"
              colspan="md:col-span-3"
            />
          </div>

          {isItalia && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold">Sede legale</h3>
                <p className="text-sm text-muted-foreground">
                  Indirizzo italiano della sede legale.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
                <Field name="cap_sl" label="CAP" required />
                <Field name="citta_sl" label="Città" required />
                <Field name="provincia_sl" label="Provincia" required />
                <Field name="indirizzo_sl" label="Indirizzo" required />
              </div>
            </div>
          )}

          {isEstero && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold">Indirizzo estero</h3>
                <p className="text-sm text-muted-foreground">
                  Per stati diversi da IT viene richiesto solo l’indirizzo
                  estero.
                </p>
              </div>

              <Field
                name="indirizzo_sl_ext"
                label="Indirizzo estero sede legale"
                required
              />
            </div>
          )}

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
  );
}