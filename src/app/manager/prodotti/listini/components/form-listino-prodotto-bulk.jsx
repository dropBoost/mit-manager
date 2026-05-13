"use client";

import { useActionState, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { Check, ChevronsUpDown } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

import { createListinoProdottoBulkAction } from "../action/createListinoProdottoBulkAction";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const initialState = {
  success: false,
  message: "",
};

function SubmitButton({ disabled }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending || disabled} className="gap-2">
      {pending && <Spinner data-icon="inline-start" />}
      {pending ? "Salvataggio..." : "Crea listino"}
    </Button>
  );
}

function ComboboxField({
  label,
  value,
  onChange,
  options = [],
  placeholder = "Seleziona",
}) {
  const [open, setOpen] = useState(false);

  const selected = options.find((item) => item.value === value);

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

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

export function FormListinoProdottoBulk({
  sedi = [],
  prodotti = [],
  listini = [],
}) {
  const [state, formAction] = useActionState(
    createListinoProdottoBulkAction,
    initialState
  );

  const [selectedSede, setSelectedSede] = useState("");

  const prodottiSenzaListino = useMemo(() => {
    if (!selectedSede) return [];

    const prodottiGiaPresenti = new Set(
      listini
        .filter((item) => item.id_sede === selectedSede)
        .map((item) => item.id_prodotto)
    );

    return prodotti.filter((prodotto) => {
      return !prodottiGiaPresenti.has(prodotto.id);
    });
  }, [selectedSede, prodotti, listini]);

  const productIds = useMemo(() => {
    return prodottiSenzaListino.map((item) => item.id);
  }, [prodottiSenzaListino]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crea listino prodotti per sede</CardTitle>
      </CardHeader>

      <CardContent>
        <form action={formAction} className="space-y-6">
          <input type="hidden" name="id_sede" value={selectedSede} />
          <input
            type="hidden"
            name="product_ids"
            value={JSON.stringify(productIds)}
          />

          <ComboboxField
            label="Sede"
            value={selectedSede}
            onChange={setSelectedSede}
            options={sedi}
            placeholder="Seleziona una sede"
          />

          {!selectedSede ? (
            <div className="rounded-md border p-6 text-center text-sm text-muted-foreground">
              Seleziona una sede per visualizzare i prodotti senza listino.
            </div>
          ) : prodottiSenzaListino.length === 0 ? (
            <div className="rounded-md border p-6 text-center text-sm text-muted-foreground">
              Tutti i prodotti hanno già un listino per questa sede.
            </div>
          ) : (
            <div className="overflow-hidden rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Prodotto</TableHead>
                    <TableHead>Codice</TableHead>
                    <TableHead>Brand</TableHead>
                    <TableHead className="w-44 text-right">
                      Prezzo riferimento
                    </TableHead>
                    <TableHead className="w-44 text-right">
                      Prezzo vendita
                    </TableHead>
                    <TableHead className="w-44 text-right">
                      Minimo d'Ordine
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {prodottiSenzaListino.map((prodotto) => {
                    const brandLabel =
                      typeof prodotto.brand === "object"
                        ? prodotto.brand?.brand
                        : prodotto.brand;

                    return (
                      <TableRow key={prodotto.id}>
                        <TableCell className="font-medium">
                          {prodotto.nome}
                        </TableCell>

                        <TableCell>
                          {prodotto.codice_prodotto || "-"}
                        </TableCell>

                        <TableCell>{brandLabel || "-"}</TableCell>

                        <TableCell>
                          <Input
                            name={`prezzo_riferimento_${prodotto.id}`}
                            type="number"
                            step="0.01"
                            min="0"
                            required
                            defaultValue={prodotto.prezzo_riferimento || 0}
                            className="text-right"
                          />
                        </TableCell>

                        <TableCell>
                          <Input
                            name={`prezzo_vendita_${prodotto.id}`}
                            type="number"
                            step="0.01"
                            min="0"
                            required
                            defaultValue={prodotto.prezzo_vendita || 0}
                            className="text-right"
                          />
                        </TableCell>

                        <TableCell>
                          <Input
                            name={`minimo_ordine_${prodotto.id}`}
                            type="number"
                            step="1"
                            min="1"
                            required
                            defaultValue={1}
                            className="text-right"
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
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
            <SubmitButton
              disabled={!selectedSede || prodottiSenzaListino.length === 0}
            />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}