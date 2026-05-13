"use client";

import { useMemo, useState } from "react";
import { Check, ChevronsUpDown, Search, Pen, ShoppingBasket } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FormUpdatePrezziRecord } from "./form-update-prezzi-record";
import { DialogGeneric } from "@/components/dialogGeneric";

function ComboboxField({ value, onChange, options = [], placeholder = "Seleziona" }) {

  const [open, setOpen] = useState(false);
  const selected = options.find((item) => item.value === value);

  return (
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
          <CommandInput placeholder="Cerca sede..." />
          <CommandList>
            <CommandEmpty>Nessuna sede trovata.</CommandEmpty>
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
  );
}

export function ListaListinoProdotti({ sedi = [], listini = [] }) {
  const [selectedSede, setSelectedSede] = useState("");
  const [search, setSearch] = useState("");

  const listiniFiltrati = useMemo(() => {
    if (!selectedSede) return [];

    return listini.filter((item) => {
      const searchValue = search.toLowerCase();

      const matchSede = item.id_sede === selectedSede;

      const nomeProdotto = item.prodotto?.nome?.toLowerCase() || "";
      const codiceProdotto =
        item.prodotto?.codice_prodotto?.toLowerCase() || "";
      const brand =
        typeof item.prodotto?.brand === "object"
          ? item.prodotto?.brand?.brand?.toLowerCase() || ""
          : item.prodotto?.brand?.toLowerCase() || "";

      const matchSearch =
        nomeProdotto.includes(searchValue) ||
        codiceProdotto.includes(searchValue) ||
        brand.includes(searchValue);

      return matchSede && matchSearch;
    });
  }, [listini, selectedSede, search]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Listino prodotti per sede</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr]">
          <ComboboxField
            value={selectedSede}
            onChange={setSelectedSede}
            options={sedi}
            placeholder="Seleziona sede"
          />

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cerca prodotto, codice o brand..."
              className="pl-9"
              disabled={!selectedSede}
            />
          </div>
        </div>

        {!selectedSede ? (
          <div className="rounded-md border p-6 text-center text-sm text-muted-foreground">
            Seleziona una sede per visualizzare il listino.
          </div>
        ) : (
          <div className="overflow-hidden rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-40">Brand</TableHead>
                  <TableHead className="w-40">Codice</TableHead>
                  <TableHead className="w-36">EAN</TableHead>
                  <TableHead className="w-36">SKU</TableHead>
                  <TableHead>Prodotto</TableHead>
                  <TableHead className="w-36 text-center justify-items-center">
                    Minimo Ordine
                  </TableHead>
                  <TableHead className="w-36 text-right">
                    Prezzo vendita
                  </TableHead>
                  <TableHead className="w-22 text-right">
                    Aggiorna
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {listiniFiltrati.length > 0 ? (
                  listiniFiltrati.map((item) => {
                    const brandLabel =
                      typeof item.prodotto?.brand === "object"
                        ? item.prodotto?.brand?.brand
                        : item.prodotto?.brand;

                    return (
                      <TableRow key={item.id}>
                        <TableCell>{brandLabel || "-"}</TableCell>
                        <TableCell>
                          {item.prodotto?.codice_prodotto || "-"}
                        </TableCell>
                        <TableCell>
                          {item.prodotto?.ean || "-"}
                        </TableCell>
                        <TableCell>
                          {item.prodotto?.sku || "-"}
                        </TableCell>


                        <TableCell className="font-medium">
                          {item.prodotto?.nome || "-"}
                        </TableCell>

                        <TableCell className="text-center">
                          {item.minimo_ordine || "-"} {item.prodotto.unita || "-"}
                        </TableCell>

                        

                        <TableCell className="text-right">
                          € {Number(item.prezzo_vendita || 0).toFixed(2)}
                        </TableCell>

                        <TableCell className="text-right">
                         <DialogGeneric
                            label={<Pen/>}
                            title="Modifica prezzi"
                            description="Aggiorna prezzo riferimento e prezzo vendita."
                            data={
                              <FormUpdatePrezziRecord
                                tableName="listino_prodotto"
                                idField="id"
                                id={item.id}
                                minimoOrdine={item.minimo_ordine}
                                prezzoRiferimento={item.prezzo_riferimento}
                                prezzoVendita={item.prezzo_vendita}
                                pathToRevalidate="/manager/listini"
                              />
                            }
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-24 text-center text-muted-foreground"
                    >
                      Nessun prodotto trovato nel listino di questa sede.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}

        <p className="text-sm text-muted-foreground">
          Totale risultati: {listiniFiltrati.length}
        </p>
      </CardContent>
    </Card>
  );
}