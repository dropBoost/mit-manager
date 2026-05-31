"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileDown } from "lucide-react";

export function FormFiltroSedeDate({ sede, fornitori = [], prodotti = [] }) {

  const [dataDa, setDataDa] = useState("");
  const [dataA, setDataA] = useState("");
  const [statoOrdine, setStatoOrdine] = useState("all");
  const [idFornitore, setIdFornitore] = useState("all");
  const [idProdotto, setIdProdotto] = useState("all");

  const prodottiFiltrati = prodotti.filter((prodotto) => {
    if (idFornitore === "all") return true;

    const prodottoFornitoreId =
      prodotto.id_fornitore || prodotto.fornitore?.id;

    return prodottoFornitoreId === idFornitore;
  });

  async function handleSubmit(event) {
    event.preventDefault();

    const payload = {
      id_sede: sede.id,
      sede_nome: `${sede.franchisee?.ragione_sociale || "Sede"} - ${
        sede.localita || sede.citta || sede.indirizzo || ""
      }`,
      data_da: dataDa,
      data_a: dataA,
      stato_ordine: statoOrdine === "all" ? null : statoOrdine,
      id_fornitore: idFornitore === "all" ? null : idFornitore,
      id_prodotto: idProdotto === "all" ? null : idProdotto,
    };

    const response = await fetch("/api/packinglist-ordini-sede", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      alert("Errore generazione PDF");
      return;
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    window.open(url, "_blank");

    setTimeout(() => URL.revokeObjectURL(url), 10000);
  }

  return (
    <Card className="w-full border-muted bg-background shadow-sm">
      <CardHeader className="space-y-1">
        <CardDescription>Filtro ordini sede</CardDescription>
        <CardTitle className="text-xl">
          {sede.franchisee?.ragione_sociale || "Sede"} -{" "}
          {sede.localita || sede.citta || sede.indirizzo || "-"}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-5">
            <div className="space-y-2">
              <Label>Fornitore</Label>

              <Select
                value={idFornitore}
                onValueChange={(value) => {
                  setIdFornitore(value);
                  setIdProdotto("all");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona fornitore" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="all">Tutti i fornitori</SelectItem>

                  {fornitori.map((fornitore) => (
                    <SelectItem key={fornitore.id} value={fornitore.id}>
                      {fornitore.ragione_sociale}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Prodotto</Label>

              <Select value={idProdotto} onValueChange={setIdProdotto}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona prodotto" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="all">Tutti i prodotti</SelectItem>

                  {prodottiFiltrati.map((prodotto) => (
                    <SelectItem key={prodotto.id} value={prodotto.id}>
                      {prodotto.nome}
                      {prodotto.codice_prodotto
                        ? ` - ${prodotto.codice_prodotto}`
                        : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Stato ordine</Label>

              <Select value={statoOrdine} onValueChange={setStatoOrdine}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona stato ordine" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="CRT">Creato</SelectItem>
                  <SelectItem value="LVR">Lavorazione</SelectItem>
                  <SelectItem value="CPL">Completato</SelectItem>
                  <SelectItem value="all">Tutti</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="data_da">
                Data da <span className="text-destructive">*</span>
              </Label>
              <Input
                id="data_da"
                type="date"
                value={dataDa}
                onChange={(e) => setDataDa(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="data_a">
                Data a <span className="text-destructive">*</span>
              </Label>
              <Input
                id="data_a"
                type="date"
                value={dataA}
                onChange={(e) => setDataA(e.target.value)}
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={!sede?.id || !dataDa || !dataA}
          >
            <FileDown /> Esporta
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}