"use client";

import { useMemo, useState, useTransition } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { postOrdineRigaAction } from "../action/postOrdineRigaAction";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function FormOrdineRiga({ idOrdine, prodotti = [], indirizzoSpedizione = "" }) {

  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [quantita, setQuantita] = useState(1);
  const [prezzo, setPrezzo] = useState("");
  const [sconto, setSconto] = useState(0);
  const [tipologiaSconto, setTipologiaSconto] = useState("");
  const [isPending, startTransition] = useTransition();

  const prodottoSelezionato = useMemo(() => {
    return prodotti.find((item) => item.id === selectedId);
  }, [prodotti, selectedId]);

  function handleSelectProduct(id) {
    const prodotto = prodotti.find((item) => item.id === id);

    setSelectedId(id);
    setOpen(false);

    if (prodotto) {
      setPrezzo(prodotto.prezzo ?? "");
      setQuantita(1);
      setSconto(0);
      setTipologiaSconto(null);
    }
  }

  function handleSubmit(formData) {
    startTransition(async () => {
      const result = await postOrdineRigaAction(formData);

      if (!result?.success) {
        toast.error(result?.message || "Errore durante il salvataggio.");
        return;
      }

      toast.success(result.message);

      setSelectedId("");
      setQuantita(1);
      setPrezzo("");
      setSconto("");
      setTipologiaSconto("");
    });
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <input type="hidden" name="id_ordine" value={idOrdine ?? ""} />
      <input type="hidden" name="id_prodotto" value={prodottoSelezionato?.id ?? ""} />
      <input type="hidden" name="nome_prodotto" value={prodottoSelezionato?.nome ?? ""} />
      <input type="hidden" name="codice_prodotto" value={prodottoSelezionato?.codice_prodotto ?? ""} />
      <input type="hidden" name="sku" value={prodottoSelezionato?.sku ?? ""} />
      <input type="hidden" name="ean" value={prodottoSelezionato?.ean ?? ""} />
      <input type="hidden" name="unita" value={prodottoSelezionato?.unita ?? ""} />
      <input type="hidden" name="aliquota_iva" value={prodottoSelezionato?.aliquota_iva ?? ""} />
      <input type="hidden" name="indirizzo_spedizione" value={indirizzoSpedizione ?? ""} />

      <div className="grid gap-4 md:grid-cols-12">
        <div className="md:col-span-5">
          <label className="mb-2 block text-sm font-medium">
            Prodotto
          </label>

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                role="combobox"
                className="w-full justify-between"
              >
                {prodottoSelezionato
                  ? `${prodottoSelezionato.nome} - ${prodottoSelezionato.codice || ""}`
                  : "Seleziona prodotto"}

                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
              <Command>
                <CommandInput placeholder="Cerca prodotto..." />
                <CommandList>
                  <CommandEmpty>Nessun prodotto trovato.</CommandEmpty>

                  <CommandGroup>
                    {prodotti.map((prodotto) => (
                      <CommandItem
                        key={prodotto.id}
                        value={`${prodotto.nome} ${prodotto.codice} ${prodotto.sku}`}
                        onSelect={() => handleSelectProduct(prodotto.id)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedId === prodotto.id
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />

                        <div className="flex flex-col">
                          <span>{prodotto.nome}</span>
                          <span className="text-xs text-muted-foreground">
                            {prodotto.codice} {prodotto.sku ? `- ${prodotto.sku}` : ""}
                          </span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium">
            Quantità
          </label>
          <Input
            name="quantita"
            type="number"
            step="1"
            value={quantita}
            onChange={(e) => setQuantita(e.target.value)}
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium">
            Prezzo
          </label>
          <Input
            name="prezzo"
            type="number"
            step="0.01"
            value={prezzo}
            onChange={(e) => setPrezzo(e.target.value)}
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium">
            Sconto
          </label>
          <Input
            name="sconto"
            type="number"
            step="0.01"
            value={sconto}
            onChange={(e) => setSconto(e.target.value)}
          />
        </div>

        <div className="md:col-span-1 flex items-end">
          <Button
            type="submit"
            disabled={isPending || !prodottoSelezionato}
            className="w-full"
          >
            +
          </Button>
        </div>
      </div>

      <input
        type="hidden"
        name="tipologia_sconto"
        value={tipologiaSconto}
      />
    </form>
  );
}