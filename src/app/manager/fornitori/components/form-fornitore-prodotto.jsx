"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { Check, ChevronsUpDown } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { createFornitoreProdottoAction } from "../action/aggiuntaFornitoriAction";

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
      {pending ? "Inserimento..." : "Inserisci fornitore"}
    </Button>
  );
}

function Field({ name, label, required = false, type = "text", colspan }) {
  return (
    <div className={`space-y-2 ${colspan}`}>
      <Label htmlFor={name}>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <Input id={name} name={name} type={type} required={required} />
    </div>
  );
}

function StatoCombobox({ stati = [], value, onChange, colspan }) {
  const [open, setOpen] = useState(false);

  const selected = stati.find((item) => item.value === value);

  return (
    <div className={`space-y-2 ${colspan}`}>
      <Label>
        Stato <span className="text-destructive">*</span>
      </Label>

      <input type="hidden" name="stato" value={value} required />

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            className="w-full justify-between"
          >
            {selected ? selected.label : "Seleziona stato"}
            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
          <Command>
            <CommandInput placeholder="Cerca stato..." />
            <CommandList>
              <CommandEmpty>Nessuno stato trovato.</CommandEmpty>
              <CommandGroup>
                {stati.map((stato) => (
                  <CommandItem
                    key={stato.value}
                    value={stato.label}
                    onSelect={() => {
                      onChange(stato.value);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === stato.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {stato.label}
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

export function FormFornitoreProdotto({ stati = [] }) {
  const [state, formAction] = useActionState(
    createFornitoreProdottoAction,
    initialState
  );

  const [stato, setStato] = useState("");
  const isItalia = stato === "IT";
  const isEstero = stato && stato !== "IT";
  const selectedStato = stati.find((item) => item.value === stato);
  
  return (
    <Card>
      <CardContent>
        <form action={formAction} className="space-y-8">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
            <Field name="ragione_sociale" label="Ragione sociale" colspan={`2xl:col-span-2 col-span-12`} required />
            <StatoCombobox stati={stati} value={stato} onChange={setStato}  colspan={`xl:col-span-2 col-span-12`} />

            <div className="space-y-2 lg:col-span-1 col-span-2">
              <Label htmlFor="id_stato">ID</Label>
              <Input
                id="id_stato"
                value={selectedStato?.value || ""}
                disabled
                placeholder="Seleziona prima uno stato"
              />
            </div>

            <Field name="partita_iva" label="Partita IVA" required   colspan={`lg:col-span-2 col-span-10`} />
            <Field name="codice_univoco" label="Codice univoco"  colspan={`lg:col-span-2 col-span-12`} />

            <Field name="pec" label="PEC" type="email"  colspan={`lg:col-span-3 col-span-12`} />
            <Field name="email" label="Email" type="email" required  colspan={`lg:col-span-3 col-span-12`} />

            <Field name="tel" label="Telefono"  colspan={`lg:col-span-2 col-span-12`} />
            <Field name="referente" label="Referente"  colspan={`lg:col-span-2 col-span-12`} />

            <Field name="mobile_ref" label="Mobile referente"  colspan={`lg:col-span-2 col-span-12`} />
            <Field name="email_ref" label="Email referente" type="email"  colspan={`lg:col-span-3 col-span-12`} />
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

              <div>
                <h3 className="text-lg font-semibold">Sede operativa</h3>
                <p className="text-sm text-muted-foreground">
                  Indirizzo italiano della sede operativa.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
                <Field name="cap_so" label="CAP"  />
                <Field name="citta_so" label="Città"  />
                <Field name="provincia_so" label="Provincia"  />
                <Field name="indirizzo_so" label="Indirizzo"  />
              </div>
            </div>
          )}

          {isEstero && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold">Indirizzi esteri</h3>
                <p className="text-sm text-muted-foreground">
                  Per stati diversi da IT vengono richiesti solo gli indirizzi
                  estesi.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Field
                  name="indirizzo_sl_ext"
                  label="Indirizzo estero sede legale"
                  required
                />
                <Field
                  name="indirizzo_so_ext"
                  label="Indirizzo estero sede operativa"
                  
                />
              </div>
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