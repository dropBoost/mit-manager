"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

import { DialogGeneric } from "@/components/dialogGeneric";
import { DeleteRecordButton } from "@/utils/functions/deleteRecordDB/buttonDeleteRecordDB";
import { ToggleBooleanRecordButton } from "@/utils/functions/toggleBooleandRecord/buttonToggleBooleanRecord";

import { FormUpdateSede } from "./form-update-sede";
import { DettaglioSede } from "./dettaglio-sede";

export function ListaSedi({ sedi = [] }) {
  const [search, setSearch] = useState("");
  const [filtroAttivo, setFiltroAttivo] = useState("all");

  const sediFiltrate = useMemo(() => {
    return sedi.filter((sede) => {
      const searchValue = search.toLowerCase();

      const franchisee =
        sede.franchisee?.ragione_sociale?.toLowerCase() || "";
      const stato = sede.stato?.stato?.toLowerCase() || "";
      const citta = sede.citta?.toLowerCase() || "";
      const localita = sede.localita?.toLowerCase() || "";
      const indirizzo = sede.indirizzo?.toLowerCase() || "";
      const email = sede.email?.toLowerCase() || "";
      const referente = sede.nominativo_ref?.toLowerCase() || "";

      const matchSearch =
        franchisee.includes(searchValue) ||
        stato.includes(searchValue) ||
        citta.includes(searchValue) ||
        localita.includes(searchValue) ||
        indirizzo.includes(searchValue) ||
        email.includes(searchValue) ||
        referente.includes(searchValue);

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
                <TableHead>Indirizzo</TableHead>
                <TableHead>Referente</TableHead>
                <TableHead className="text-center w-16">Attivo</TableHead>
                <TableHead className="text-center w-16">Visualizza</TableHead>
                <TableHead className="text-center w-16">Modifica</TableHead>
                <TableHead className="text-center w-16">Elimina</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {sediFiltrate.length > 0 ? (
                sediFiltrate.map((sede) => {
                  const franchiseeLabel =
                    sede.franchisee?.ragione_sociale || "-";

                  const statoLabel = sede.stato?.stato
                    ? `${sede.stato.stato} (${sede.stato.id})`
                    : sede.id_stato || "-";

                  return (
                    <TableRow key={sede.id}>
                      <TableCell className="font-medium">
                        {franchiseeLabel}
                      </TableCell>

                      <TableCell>{statoLabel}</TableCell>
                      <TableCell>{sede.citta || "-"}</TableCell>
                      <TableCell>{sede.localita || "-"}</TableCell>
                      <TableCell>{sede.indirizzo || "-"}</TableCell>
                      <TableCell>{sede.nominativo_ref || "-"}</TableCell>

                      <TableCell className="text-center">
                        <ToggleBooleanRecordButton
                          tableName="sede"
                          idField="id"
                          id={sede.id}
                          booleanField="attivo"
                          currentValue={sede.attivo}
                        />
                      </TableCell>

                      <TableCell className="text-center">
                        <DialogGeneric
                          label="V"
                          title={franchiseeLabel}
                          description="Dettaglio completo della sede"
                          data={<DettaglioSede sede={sede} />}
                        />
                      </TableCell>

                      <TableCell className="text-center">
                        <DialogGeneric
                          label="E"
                          title="Modifica sede"
                          description="Modifica i dati della sede."
                          data={<FormUpdateSede sede={sede} />}
                        />
                      </TableCell>

                      <TableCell className="text-center">
                        <DeleteRecordButton
                          tableName="sede"
                          idField="id"
                          id={sede.id}
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