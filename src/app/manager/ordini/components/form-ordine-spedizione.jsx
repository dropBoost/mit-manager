"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { Check, ChevronsUpDown } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

import { createOrdineSpedizioneAction } from "../action/aggiuntaOrdineSpedizioneAction";

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
      {pending ? "Inserimento..." : "Registra spedizione"}
    </Button>
  );

}

function ComboboxField({ label, name, value, onChange, options = [], placeholder = "Seleziona", required = false }) {

  const [open, setOpen] = useState(false);

  const selected = options.find((item) => item.value === value);

  return (
    <div className="space-y-2">
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
            <CommandInput placeholder="Cerca corriere..." />
            <CommandList>
              <CommandEmpty>Nessun corriere trovato.</CommandEmpty>
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

export function FormOrdineSpedizione({ idOrdine, idOrdineRiga, corrieri = [] }) {

  const [state, formAction] = useActionState(createOrdineSpedizioneAction, initialState);
  const [selectedCorriere, setSelectedCorriere] = useState("");

  return (
    <Card>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <input type="hidden" name="id_ordine" value={idOrdine || ""} />
          <input
            type="hidden"
            name="id_ordine_riga"
            value={idOrdineRiga || ""}
          />

          <div className="space-y-2">
            <Label htmlFor="tracking">Data di Consegna</Label>
            <Input
              type="date"
              id="data_consegna"
              name="data_consegna"
            />
          </div>

          <ComboboxField
            name="cod_corriere"
            label="Corriere"
            value={selectedCorriere}
            onChange={setSelectedCorriere}
            options={corrieri}
            required
            placeholder="Seleziona corriere"
          />

          <div className="space-y-2">
            <Label htmlFor="tracking">Tracking</Label>
            <Input
              id="tracking"
              name="tracking"
              placeholder="Codice tracking"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="costo_spedizione">
              Costo spedizione <span className="text-destructive">*</span>
            </Label>
            <Input
              id="costo_spedizione"
              name="costo_spedizione"
              type="number"
              step="0.01"
              min="0"
              required
              placeholder="0.00"
            />
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