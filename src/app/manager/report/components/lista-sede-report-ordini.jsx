"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { DialogGeneric } from "@/components/dialogGeneric";
import { FormFiltroSedeDate } from "./form-sede-date";
import { DatabaseSearch } from "lucide-react";

export function ListaSediReportOrdini({ sedi = [], fornitori = [], prodotti = [] }) {
  const [search, setSearch] = useState("");
  const [filtroAttivo, setFiltroAttivo] = useState("all");

  const sediFiltrate = useMemo(() => {
    return sedi.filter((sede) => {
      const searchValue = search.toLowerCase();

      const citta = sede.citta?.toLowerCase() || "";

      const matchSearch = citta.includes(searchValue)

      const matchAttivo =
        filtroAttivo === "all" ||
        (filtroAttivo === "true" && sede.attivo === true) ||
        (filtroAttivo === "false" && sede.attivo === false);

      return matchSearch && matchAttivo;
    });
  }, [sedi, search, filtroAttivo]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Elenco Sedi</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_220px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cerca per franchisee, città, località, indirizzo, email o referente..."
              className="pl-9"
            />
          </div>

          <Select value={filtroAttivo} onValueChange={setFiltroAttivo}>
            <SelectTrigger>
              <SelectValue placeholder="Filtra per attivo" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">Tutte</SelectItem>
              <SelectItem value="true">Solo attive</SelectItem>
              <SelectItem value="false">Solo non attive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Franchisee</TableHead>
                <TableHead>Stato</TableHead>
                <TableHead>Città</TableHead>
                <TableHead>Località</TableHead>
                <TableHead className="text-center w-20">Report</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {sediFiltrate.length > 0 ? (
                sediFiltrate.map((sede) => {
                  const franchiseeLabel =
                    sede.franchisee?.ragione_sociale || "-";

                  const statoLabel = sede?.stato?.id || "-"

                  return (
                    <TableRow key={sede.id}>
                      <TableCell className="font-medium">
                        {franchiseeLabel}
                      </TableCell>

                      <TableCell>{statoLabel}</TableCell>
                      <TableCell>{sede.citta || "-"}</TableCell>
                      <TableCell>{sede.localita || "-"}</TableCell>

                      <TableCell className="w-20 text-center">
                        <DialogGeneric label={<DatabaseSearch />} title={"Elenca Riepilogo"} description={`Packing list ordini sede`}
                          data={<FormFiltroSedeDate sede={sede} fornitori={fornitori} prodotti={prodotti}/>}
                        />
                      </TableCell>
                      
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={10}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Nessuna sede trovata.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <p className="text-sm text-muted-foreground">
          Totale risultati: {sediFiltrate.length}
        </p>
      </CardContent>
    </Card>
  );
}