"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { DeleteRecordButton } from "@/utils/functions/deleteRecordDB/buttonDeleteRecordDB";
import Link from "next/link";
import { EyeIcon } from "lucide-react";

function DettaglioOrdine({ ordine }) {
  const righe = ordine.righe || ordine.ordine_riga || [];

  return (
    <div className="space-y-6">
      <div className="grid gap-2 text-sm">
        <p>
          <strong>Sede:</strong>{" "}
          {ordine.sede?.franchisee?.ragione_sociale || ordine.sede?.citta || "-"}
        </p>
        <p>
          <strong>Note:</strong> {ordine.note || "-"}
        </p>
        <p>
          <strong>Data:</strong>{" "}
          {ordine.created_at
            ? new Date(ordine.created_at).toLocaleDateString("it-IT")
            : "-"}
        </p>
      </div>

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Prodotto</TableHead>
              <TableHead>Codice</TableHead>
              <TableHead>Q.tà</TableHead>
              <TableHead>Unità</TableHead>
              <TableHead className="text-right">Prezzo</TableHead>
              <TableHead className="text-right">Totale</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {righe.length > 0 ? (
              righe.map((riga) => (
                <TableRow key={riga.id}>
                  <TableCell>{riga.nome_prodotto || "-"}</TableCell>
                  <TableCell>{riga.codice_prodotto || "-"}</TableCell>
                  <TableCell>{riga.quantita || "-"}</TableCell>
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
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-20 text-center text-muted-foreground"
                >
                  Nessuna riga ordine.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export function ListaOrdini({ ordini = [] }) {
  const [search, setSearch] = useState("");

  const ordiniFiltrati = useMemo(() => {
    return ordini.filter((ordine) => {
      const searchValue = search.toLowerCase();

      const sede =
        ordine.sede?.franchisee?.ragione_sociale?.toLowerCase() || "";
      const citta = ordine.sede?.citta?.toLowerCase() || "";
      const localita = ordine.sede?.localita?.toLowerCase() || "";
      const note = ordine.note?.toLowerCase() || "";

      const righe = ordine.righe || ordine.ordine_riga || [];

      const prodotti = righe
        .map((riga) => `${riga.nome_prodotto || ""} ${riga.codice_prodotto || ""}`)
        .join(" ")
        .toLowerCase();

      return (
        sede.includes(searchValue) ||
        citta.includes(searchValue) ||
        localita.includes(searchValue) ||
        note.includes(searchValue) ||
        prodotti.includes(searchValue)
      );
    });
  }, [ordini, search]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Elenco Ordini</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cerca per sede, città, note o prodotto..."
            className="pl-9"
          />
        </div>

        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Sede</TableHead>
                <TableHead>Località</TableHead>
                <TableHead>Righe</TableHead>
                <TableHead className="text-right">Totale</TableHead>
                <TableHead>Note</TableHead>
                <TableHead className="text-center w-16">Visualizza</TableHead>
                <TableHead className="text-center w-16">Elimina</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {ordiniFiltrati.length > 0 ? (
                ordiniFiltrati.map((ordine) => {
                  const righe = ordine.righe || ordine.ordine_riga || [];

                  const totale = righe.reduce((acc, riga) => {
                    return (
                      acc +
                      Number(riga.prezzo || 0) * Number(riga.quantita || 0)
                    );
                  }, 0);

                  const sedeLabel =
                    ordine.sede?.franchisee?.ragione_sociale ||
                    ordine.sede?.id ||
                    "-";

                  const localitaLabel =
                    ordine.sede?.localita ||
                    ordine.sede?.citta ||
                    ordine.sede?.indirizzo ||
                    "-";

                  return (
                    <TableRow key={ordine.id}>
                      <TableCell>
                        {ordine.created_at
                          ? new Date(ordine.created_at).toLocaleDateString(
                              "it-IT"
                            )
                          : "-"}
                      </TableCell>

                      <TableCell className="font-medium">
                        {sedeLabel}
                      </TableCell>

                      <TableCell>{localitaLabel}</TableCell>

                      <TableCell>{righe.length}</TableCell>

                      <TableCell className="text-right">
                        € {totale.toFixed(2)}
                      </TableCell>

                      <TableCell className="max-w-65 truncate">
                        {ordine.note || "-"}
                      </TableCell>

                      <TableCell className="text-center">
                        <Link href={`/manager/ordini/gestione/gestione-ordine/${ordine.id}`}>
                          <Button size="icon"><EyeIcon/></Button>
                        </Link>
                      </TableCell>

                      <TableCell className="text-center">
                        <DeleteRecordButton
                          tableName="ordine"
                          idField="id"
                          id={ordine.id}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Nessun ordine trovato.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <p className="text-sm text-muted-foreground">
          Totale risultati: {ordiniFiltrati.length}
        </p>
      </CardContent>
    </Card>
  );
}