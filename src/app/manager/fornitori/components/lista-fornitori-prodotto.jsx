"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { DeleteRecordButton } from "@/utils/functions/deleteRecordDB/buttonDeleteRecordDB";
import { DialogGeneric } from "@/components/dialogGeneric";
import { FormUpdateFornitoreProdotto } from "./form-update-fornitore-prodotto";
import { ToggleBooleanRecordButton } from "@/utils/functions/toggleBooleandRecord/buttonToggleBooleanRecord";

export function ListaFornitoriProdotto({ fornitori = [] }) {

  const [search, setSearch] = useState("");
  const [filtroAttivo, setFiltroAttivo] = useState("all");
  const [filtroStato, setFiltroStato] = useState("all");

  const statiDisponibili = useMemo(() => {
    const statiMap = new Map();

    fornitori.forEach((fornitore) => {
      if (fornitore.stato?.id) {
        statiMap.set(fornitore.stato.id, {
          id: fornitore.stato.id,
          nome: fornitore.stato.stato,
        });
      }
    });

    return Array.from(statiMap.values()).sort((a, b) =>
      a.nome.localeCompare(b.nome)
    );
  }, [fornitori]);

  const fornitoriFiltrati = useMemo(() => {

    return fornitori.filter((fornitore) => {
      const ragioneSociale = fornitore.ragione_sociale?.toLowerCase() || "";
      const searchValue = search.toLowerCase();

      const matchSearch = ragioneSociale.includes(searchValue);

      const matchAttivo =
        filtroAttivo === "all" ||
        (filtroAttivo === "true" && fornitore.attivo === true) ||
        (filtroAttivo === "false" && fornitore.attivo === false);

      const matchStato =
        filtroStato === "all" || fornitore.stato?.id === filtroStato;

      return matchSearch && matchAttivo && matchStato;
    });
  }, [fornitori, search, filtroAttivo, filtroStato]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Elenco Fornitori</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_220px_220px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cerca per ragione sociale..."
              className="pl-9"
            />
          </div>

          <Select value={filtroAttivo} onValueChange={setFiltroAttivo}>
            <SelectTrigger>
              <SelectValue placeholder="Filtra per attivo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tutti</SelectItem>
              <SelectItem value="true">Solo attivi</SelectItem>
              <SelectItem value="false">Solo non attivi</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filtroStato} onValueChange={setFiltroStato}>
            <SelectTrigger>
              <SelectValue placeholder="Filtra per stato" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tutti gli stati</SelectItem>

              {statiDisponibili.map((stato) => (
                <SelectItem key={stato.id} value={stato.id}>
                  {stato.nome} — {stato.id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ragione sociale</TableHead>
                <TableHead>Stato</TableHead>
                <TableHead>Partita IVA</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Referente</TableHead>
                <TableHead className={`text-center w-16`}>Attivo</TableHead>
                <TableHead className={`text-center w-16`}>Modifica</TableHead>
                <TableHead className={`text-center w-16`}>Elimina</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {fornitoriFiltrati.length > 0 ? (
                fornitoriFiltrati.map((fornitore) => (
                  <TableRow key={fornitore.id}>
                    <TableCell className="font-medium">
                      {fornitore.ragione_sociale}
                    </TableCell>

                    <TableCell>
                      {fornitore.stato?.stato || "-"}{" "}
                      {fornitore.stato?.id && (
                        <span className="text-muted-foreground">
                          ({fornitore.stato.id})
                        </span>
                      )}
                    </TableCell>

                    <TableCell>{fornitore.partita_iva}</TableCell>

                    <TableCell>{fornitore.email}</TableCell>

                    <TableCell>{fornitore.referente || "-"}</TableCell>

                    <TableCell className="text-center">
                      <ToggleBooleanRecordButton
                        tableName="fornitore_prodotto"
                        idField="id"
                        id={fornitore.id}
                        booleanField="attivo"
                        currentValue={fornitore.attivo}
                      />
                    </TableCell>

                    <TableCell className={`text-center`}>
                      <DialogGeneric
                        title={"Modifica i dati"}
                        description={"Modifica i dati del fornitore, PARTITA IVA e STATO non possono essere modificati, in tal caso disabilitare il fornitore e crearne uno nuovo"}
                        data={<FormUpdateFornitoreProdotto fornitore={fornitore} />}
                        label="E"
                      />
                    </TableCell>

                    <TableCell className={`text-center`}><DeleteRecordButton tableName={`fornitore_prodotto`} idField={`id`} id={fornitore.id}/></TableCell>
                    
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Nessun fornitore trovato.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <p className="text-sm text-muted-foreground">
          Totale risultati: {fornitoriFiltrati.length}
        </p>
      </CardContent>
    </Card>
  );
}