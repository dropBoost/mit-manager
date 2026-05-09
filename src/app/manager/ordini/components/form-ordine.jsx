"use client";

import { useActionState, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { Check, ChevronsUpDown, Trash2 } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

import { createOrdineAction } from "../action/createOrdineAction";

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
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

const initialState = {
  success: false,
  message: "",
};

function SubmitButton({ disabled }) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending || disabled}
      className="w-full gap-2 md:w-auto"
    >
      {pending && <Spinner data-icon="inline-start" />}
      {pending ? "Creazione ordine..." : "Crea ordine"}
    </Button>
  );
}

function ComboboxField({
  label,
  value,
  onChange,
  options = [],
  placeholder = "Seleziona",
  required = false,
  disabled = false,
  colspan = "",
}) {
  const [open, setOpen] = useState(false);

  const selected = options.find((item) => item.value === value);

  return (
    <div className={`space-y-2 ${colspan}`}>
      <Label>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            disabled={disabled}
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

export function FormOrdine({
  idAccount = null,
  sedi = [],
  indirizzi = [],
  prodotti = [],
  listini = [],
}) {
  const [state, formAction] = useActionState(createOrdineAction, initialState);

  const [selectedSede, setSelectedSede] = useState("");
  const [selectedIndirizzo, setSelectedIndirizzo] = useState("");
  const [selectedProdotto, setSelectedProdotto] = useState("");
  const [quantita, setQuantita] = useState("1");
  const [note, setNote] = useState("");
  const [righe, setRighe] = useState([]);

  const indirizziSede = useMemo(() => {
    if (!selectedSede) return [];

    return indirizzi
      .filter((item) => item.id_sede === selectedSede && item.attivo !== false)
      .map((item) => {
        const indirizzoCompleto = [
          item.alias_indirizzo,
          item.nominativo,
          item.indirizzo,
          item.numero_civico,
          item.cap,
          item.citta,
          item.provincia,
          item.stato,
        ]
          .filter(Boolean)
          .join(", ");

        return {
          value: item.id,
          label: indirizzoCompleto || item.id,
          raw: item,
          indirizzo_spedizione: indirizzoCompleto,
        };
      });
  }, [indirizzi, selectedSede]);

  const prodottiDisponibili = useMemo(() => {
    if (!selectedSede) return [];

    const prodottiConListino = listini
      .filter((item) => item.id_sede === selectedSede && item.attivo !== false)
      .map((item) => {
        const prodotto = prodotti.find((p) => p.id === item.id_prodotto);

        if (!prodotto) return null;

        return {
          value: prodotto.id,
          label: `${prodotto.nome} ${
            prodotto.codice_prodotto ? `(${prodotto.codice_prodotto})` : ""
          }`,
          prodotto,
          listino: item,
        };
      })
      .filter(Boolean);

    return prodottiConListino;
  }, [listini, prodotti, selectedSede]);

  const selectedProdottoData = prodottiDisponibili.find(
    (item) => item.value === selectedProdotto
  );

  const selectedIndirizzoData = indirizziSede.find(
    (item) => item.value === selectedIndirizzo
  );

  function handleChangeSede(value) {
    setSelectedSede(value);
    setSelectedIndirizzo("");
    setSelectedProdotto("");
    setRighe([]);
  }

  function handleAddRiga() {
    if (!selectedSede || !selectedIndirizzo || !selectedProdottoData) return;

    const prodotto = selectedProdottoData.prodotto;
    const listino = selectedProdottoData.listino;

    const ivaVendita =
      prodotto.ivaVendita?.valore ||
      prodotto.iva_vendita_valore ||
      prodotto.aliquota_iva ||
      null;

    const prezzo =
      listino.prezzo_vendita ??
      listino.prezzo_riferimento ??
      prodotto.prezzo_vendita ??
      prodotto.prezzo_riferimento ??
      0;

    const nuovaRiga = {
      temp_id: crypto.randomUUID(),
      id_prodotto: prodotto.id,
      nome_prodotto: prodotto.nome,
      codice_prodotto: prodotto.codice_prodotto,
      quantita: Number(quantita),
      unita:
        typeof prodotto.unita === "object"
          ? prodotto.unita?.unita
          : prodotto.unita,
      prezzo,
      sconto: listino.sconto || null,
      tipologia_sconto: listino.tipologia_sconto || null,
      aliquota_iva: ivaVendita,
      sku: prodotto.sku || null,
      ean: prodotto.ean || null,
      indirizzo_spedizione: selectedIndirizzoData?.indirizzo_spedizione || "",
    };

    setRighe((prev) => [...prev, nuovaRiga]);
    setSelectedProdotto("");
    setQuantita("1");
  }

  function handleRemoveRiga(tempId) {
    setRighe((prev) => prev.filter((item) => item.temp_id !== tempId));
  }

  const totale = righe.reduce((acc, riga) => {
    return acc + Number(riga.prezzo || 0) * Number(riga.quantita || 0);
  }, 0);

  return (
    <Card>
      <CardContent>
        <form action={formAction} className="space-y-8">
          <input type="hidden" name="id_sede" value={selectedSede} />
          <input type="hidden" name="id_account" value={idAccount || ""} />
          <input type="hidden" name="righe" value={JSON.stringify(righe)} />

          <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
            <ComboboxField
              label="Sede"
              value={selectedSede}
              onChange={handleChangeSede}
              options={sedi}
              required
              placeholder="Seleziona sede"
              colspan="md:col-span-6"
            />

            <ComboboxField
              label="Indirizzo spedizione"
              value={selectedIndirizzo}
              onChange={setSelectedIndirizzo}
              options={indirizziSede}
              required
              disabled={!selectedSede}
              placeholder={
                selectedSede
                  ? "Seleziona indirizzo"
                  : "Seleziona prima una sede"
              }
              colspan="md:col-span-6"
            />

            <ComboboxField
              label="Prodotto"
              value={selectedProdotto}
              onChange={setSelectedProdotto}
              options={prodottiDisponibili}
              required
              disabled={!selectedSede}
              placeholder={
                selectedSede
                  ? "Seleziona prodotto"
                  : "Seleziona prima una sede"
              }
              colspan="md:col-span-7"
            />

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="quantita">Quantità</Label>
              <Input
                id="quantita"
                type="number"
                step="1"
                min="1"
                value={quantita}
                onChange={(e) => setQuantita(e.target.value)}
              />
            </div>

            <div className="flex items-end md:col-span-3">
              <Button
                type="button"
                className="w-full"
                disabled={
                  !selectedSede ||
                  !selectedIndirizzo ||
                  !selectedProdotto ||
                  !quantita
                }
                onClick={handleAddRiga}
              >
                Aggiungi prodotto
              </Button>
            </div>

            {selectedProdottoData && (
              <div className="rounded-md border bg-muted/40 p-4 md:col-span-12">
                <p className="text-sm">
                  <strong>Prezzo listino:</strong>{" "}
                  €{" "}
                  {Number(
                    selectedProdottoData.listino.prezzo_vendita ||
                      selectedProdottoData.listino.prezzo_riferimento ||
                      0
                  ).toFixed(2)}
                </p>
                <p className="text-sm">
                  <strong>Unità:</strong>{" "}
                  {typeof selectedProdottoData.prodotto.unita === "object"
                    ? selectedProdottoData.prodotto.unita?.unita
                    : selectedProdottoData.prodotto.unita || "-"}
                </p>
              </div>
            )}

            <div className="space-y-2 md:col-span-12">
              <Label htmlFor="note">Note ordine</Label>
              <Textarea
                id="note"
                name="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Note interne sull'ordine..."
              />
            </div>
          </div>

          <div className="overflow-hidden rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Prodotto</TableHead>
                  <TableHead>Codice</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>EAN</TableHead>
                  <TableHead>Q.tà</TableHead>
                  <TableHead>Unità</TableHead>
                  <TableHead className="text-right">Prezzo</TableHead>
                  <TableHead className="text-right">Totale</TableHead>
                  <TableHead className="text-center w-16">Rimuovi</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {righe.length > 0 ? (
                  righe.map((riga) => (
                    <TableRow key={riga.temp_id}>
                      <TableCell className="font-medium">
                        {riga.nome_prodotto}
                      </TableCell>
                      <TableCell>{riga.codice_prodotto || "-"}</TableCell>
                      <TableCell>{riga.sku || "-"}</TableCell>
                      <TableCell>{riga.ean || "-"}</TableCell>
                      <TableCell>{riga.quantita}</TableCell>
                      <TableCell>{riga.unita || "-"}</TableCell>
                      <TableCell className="text-right">
                        € {Number(riga.prezzo || 0).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        €{" "}
                        {(
                          Number(riga.prezzo || 0) * Number(riga.quantita || 0)
                        ).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          type="button"
                          size="icon"
                          variant="destructive"
                          onClick={() => handleRemoveRiga(riga.temp_id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="h-24 text-center text-muted-foreground"
                    >
                      Nessun prodotto aggiunto all'ordine.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Totale righe: {righe.length}
            </p>

            <p className="text-lg font-semibold">
              Totale: € {totale.toFixed(2)}
            </p>
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
            <SubmitButton disabled={!selectedSede || righe.length === 0} />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}