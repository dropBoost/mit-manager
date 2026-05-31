"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { DialogGeneric } from "@/components/dialogGeneric";
import { FormFiltroFornitoreDate } from "./form-fornitore-date";
import { DatabaseSearch } from "lucide-react";

export function ListaFornitoriReportOrdini({ fornitori = [], prodotti = [] }) {

  const [search, setSearch] = useState("");
  const [filtroAttivo, setFiltroAttivo] = useState("all");

  const fornitoriFiltrati = useMemo(() => {

    return fornitori.filter((fornitore) => {
      const ragioneSociale = fornitore.ragione_sociale?.toLowerCase() || "";
      const searchValue = search.toLowerCase();

      const matchSearch = ragioneSociale.includes(searchValue);

      const matchAttivo =
        filtroAttivo === "all" ||
        (filtroAttivo === "true" && fornitore.attivo === true) ||
        (filtroAttivo === "false" && fornitore.attivo === false);

      return matchSearch && matchAttivo;
    });
  }, [fornitori, search, filtroAttivo]);

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

        </div>

        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ragione sociale</TableHead>
                <TableHead>Stato</TableHead>
                <TableHead>Partita IVA</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className={`w-20 text-center`}>Report</TableHead>
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

                    <TableCell className={`text-center`}>
                      <DialogGeneric label={<DatabaseSearch/>} title={"Elenca Riepilogo"} description={`Packing list ordini fornitore`}
                        data={<FormFiltroFornitoreDate fornitore={fornitore} prodotti={prodotti}/>}
                      />
                    </TableCell>
                    
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