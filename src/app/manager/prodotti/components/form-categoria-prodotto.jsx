"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { Check, ChevronsUpDown } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

import { createCategoriaProdottoAction } from "../action/aggiuntaCategoriaProdottoAction";

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
      {pending ? "Inserimento..." : "Inserisci categoria"}
    </Button>
  );
}

function SupercategoriaCombobox({ supercategorie = [], value, onChange }) {
  const [open, setOpen] = useState(false);

  const selected = supercategorie.find(
    (item) => item.supercategoria === value
  );

  return (
    <div className="space-y-2">
      <Label>
        Supercategoria <span className="text-destructive">*</span>
      </Label>

      <input
        type="hidden"
        name="supercategoria"
        value={value}
        required
      />

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            className="w-full justify-between"
          >
            {selected ? selected.supercategoria : "Seleziona supercategoria"}
            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
          <Command>
            <CommandInput placeholder="Cerca supercategoria..." />
            <CommandList>
              <CommandEmpty>Nessuna supercategoria trovata.</CommandEmpty>
              <CommandGroup>
                {supercategorie.map((item) => (
                  <CommandItem
                    key={item.supercategoria}
                    value={item.supercategoria}
                    onSelect={() => {
                      onChange(item.supercategoria);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === item.supercategoria
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {item.supercategoria}
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

export function FormCategoriaProdotto({ supercategorie = [] }) {
  const [state, formAction] = useActionState(
    createCategoriaProdottoAction,
    initialState
  );

  const [supercategoria, setSupercategoria] = useState("");

  const supercategorieAttive = supercategorie.filter(
    (item) => item.attivo === true
  );

  return (
    <Card>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="categoria">
              Nome categoria <span className="text-destructive">*</span>
            </Label>

            <Input
              id="categoria"
              name="categoria"
              required
              placeholder="Es. Farina, Mozzarella, Bibite..."
            />
          </div>

          <SupercategoriaCombobox
            supercategorie={supercategorieAttive}
            value={supercategoria}
            onChange={setSupercategoria}
          />

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