"use client";

import { useMemo, useState, useTransition, useEffect } from "react";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { postOrdineRigaAction } from "../action/postOrdineRigaAction";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function FormOrdineRiga({ idOrdine, prodotti = [], indirizzoSpedizione = "" }) {

  const [selectedId, setSelectedId] = useState("");
  const [search, setSearch] = useState("");
  const [prezzo, setPrezzo] = useState("");
  const [sconto, setSconto] = useState(0);
  const [tipologiaSconto, setTipologiaSconto] = useState("");
  const [isPending, startTransition] = useTransition();
  const [minimoOrdine, setMinimoOrdine] = useState(1)
  const [quantita, setQuantita] = useState(1);

  const prodottoSelezionato = useMemo(() => {
    return prodotti.find((item) => item.id === selectedId);
  }, [prodotti, selectedId]);

  const prodottiFiltrati = useMemo(() => {
    const term = search.toLowerCase().trim();

    if (!term) return prodotti;

    return prodotti.filter((prodotto) => {
      return (
        prodotto.nome?.toLowerCase().includes(term) ||
        prodotto.codice?.toLowerCase().includes(term) ||
        prodotto.codice_prodotto?.toLowerCase().includes(term) ||
        prodotto.sku?.toLowerCase().includes(term) ||
        prodotto.ean?.toLowerCase().includes(term)
      );
    });
  }, [prodotti, search]);

  function handleSelectProduct(id) {
    const prodotto = prodotti.find((item) => item.id === id);

    setSelectedId(id);

    if (prodotto) {
      setPrezzo(prodotto.prezzo ?? "");
      setQuantita(1);
      setSconto(0);
      setTipologiaSconto("");
    }
  }

  useEffect(() => {
    setMinimoOrdine(prodottoSelezionato?.minimo_ordine ?? 1);
    setQuantita(prodottoSelezionato?.minimo_ordine ?? 1)
  }, [prodottoSelezionato]);
  console.log(prodottoSelezionato)
  function handleSubmit(formData) {
    startTransition(async () => {
      const result = await postOrdineRigaAction(formData);

      if (!result?.success) {
        toast.error(result?.message || "Errore durante il salvataggio.");
        return;
      }

      toast.success(result.message);

      setSelectedId("");
      setSearch("");
      setQuantita(1);
      setPrezzo("");
      setSconto(0);
      setTipologiaSconto("");
    });
  }

  return (
    <form action={handleSubmit} className="space-y-4">

      <input type="hidden" name="id_ordine" value={idOrdine ?? ""} />
      <input type="hidden" name="id_prodotto" value={prodottoSelezionato?.id ?? ""} />
      <input type="hidden" name="nome_prodotto" value={prodottoSelezionato?.nome ?? ""} />
      <input type="hidden" name="codice_prodotto" value={prodottoSelezionato?.codice_prodotto ?? prodottoSelezionato?.codice ?? ""} />
      <input type="hidden" name="sku" value={prodottoSelezionato?.sku ?? ""} />
      <input type="hidden" name="ean" value={prodottoSelezionato?.ean ?? ""} />
      <input type="hidden" name="unita" value={prodottoSelezionato?.unita ?? ""} />
      <input type="hidden" name="aliquota_iva" value={prodottoSelezionato?.aliquota_iva ?? ""} />
      <input type="hidden" name="indirizzo_spedizione" value={indirizzoSpedizione ?? ""} />
      <input type="hidden" name="tipologia_sconto" value={tipologiaSconto ?? ""} />

      <div className="grid gap-4 md:grid-cols-12">
        {/* COLONNA SINISTRA */}
        <div className="md:col-span-7 space-y-3">
          <label className="text-sm font-medium">Seleziona prodotto</label>

          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cerca per nome, codice, sku o ean..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="h-120 overflow-y-auto rounded-md border">
            {prodottiFiltrati.length === 0 ? (
              <div className="p-4 text-sm text-muted-foreground">
                Nessun prodotto trovato.
              </div>
            ) : (
              <div className="divide-y">
                {prodottiFiltrati.map((prodotto) => (
                  <button
                    key={prodotto.id}
                    type="button"
                    onClick={() => handleSelectProduct(prodotto.id)}
                    className={cn(
                      "w-full p-3 text-left transition hover:bg-muted",
                      selectedId === prodotto.id && "bg-muted"
                    )}
                  >
                    <div className="font-medium">
                      {prodotto.nome}
                    </div>

                    <div className="mt-1 text-xs text-muted-foreground">
                      Codice: {prodotto.codice_prodotto ?? prodotto.codice ?? "-"}
                    </div>

                    {prodotto.sku || prodotto.ean ?
                    <div className="text-xs text-muted-foreground">
                      {prodotto.sku ? `SKU: ${prodotto.sku}` : " " }
                      {prodotto.ean ? `EAN: ${prodotto.ean}` : " " }
                    </div> : null }

                    <div className="mt-1 text-sm font-medium">
                      € {prodotto.prezzo_vendita.toFixed(2) ?? "0.00"}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* COLONNA DESTRA */}
        <div className="md:col-span-5 space-y-4 rounded-md border p-4">
          <div>
            <h3 className="font-medium">Inserisci nell'ordine</h3>
            <p className="text-sm text-muted-foreground">
              Seleziona un prodotto e imposta quantità, prezzo e sconto.
            </p>
          </div>

          {prodottoSelezionato ? (
            <div className="rounded-md bg-muted p-3">
              <div className="font-medium">{prodottoSelezionato.nome}</div>
              <div className="text-xs text-muted-foreground">
                {prodottoSelezionato.codice_prodotto ?? prodottoSelezionato.codice ?? "-"}
              </div>
            </div>
          ) : (
            <div className="rounded-md bg-muted p-3 text-sm text-muted-foreground">
              Nessun prodotto selezionato.
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium">Quantità</label>
            <Input
              name="quantita"
              type="number"
              step={minimoOrdine}
              min={minimoOrdine}
              value={quantita}
              onChange={(e) => setQuantita(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Prezzo</label>
            <Input
              name="prezzo"
              type="number"
              step="0.01"
              value={prezzo}
              onChange={(e) => setPrezzo(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Sconto</label>
            <Input
              name="sconto"
              type="number"
              step="0.01"
              value={sconto}
              onChange={(e) => setSconto(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            disabled={isPending || !prodottoSelezionato}
            className="w-full"
          >
            {isPending ? "Salvataggio..." : "Aggiungi prodotto"}
          </Button>
        </div>
      </div>
    </form>
  );
}