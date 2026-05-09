"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { Check, ChevronsUpDown } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

import { createSedeIndirizzoAction } from "../actions/aggiuntaSedeIndirizzoAction";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

const initialState = {
  success: false,
  message: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full gap-2 md:w-auto">
      {pending && <Spinner data-icon="inline-start" />}
      {pending ? "Inserimento..." : "Inserisci indirizzo"}
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

export function FormSedeIndirizzo({ sedi = [] }) {
  const [state, formAction] = useActionState(
    createSedeIndirizzoAction,
    initialState
  );

  const [selectedSede, setSelectedSede] = useState("");

  return (
    <Card>
      <CardContent>
        <form action={formAction} className="space-y-8">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
            <ComboboxField
              name="id_sede"
              label="Sede"
              value={selectedSede}
              onChange={setSelectedSede}
              options={sedi}
              required
              placeholder="Seleziona sede"
              colspan="md:col-span-12"
            />

            <Field
              name="alias_indirizzo"
              label="Alias indirizzo"
              colspan="md:col-span-4"
            />

            <Field
              name="nominativo"
              label="Nominativo"
              colspan="md:col-span-4"
            />

            <Field
              name="mobile"
              label="Mobile"
              colspan="md:col-span-4"
            />

            <Field
              name="email"
              label="Email"
              type="email"
              colspan="md:col-span-4"
            />

            <Field
              name="stato"
              label="Stato"
              colspan="md:col-span-4"
            />

            <Field
              name="provincia"
              label="Provincia"
              colspan="md:col-span-4"
            />

            <Field
              name="citta"
              label="Città"
              colspan="md:col-span-4"
            />

            <Field
              name="cap"
              label="CAP"
              colspan="md:col-span-4"
            />

            <Field
              name="indirizzo"
              label="Indirizzo"
              colspan="md:col-span-3"
            />

            <Field
              name="numero_civico"
              label="Civico"
              colspan="md:col-span-1"
            />

            <div className="space-y-2 md:col-span-12">
              <Label htmlFor="note_indirizzo">Note indirizzo</Label>
              <Textarea
                id="note_indirizzo"
                name="note_indirizzo"
                placeholder="Note interne sull'indirizzo..."
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
  );
}