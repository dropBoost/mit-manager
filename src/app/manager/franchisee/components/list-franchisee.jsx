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

import { FormUpdateFranchisee } from "./form-update-franchisee";
import { DettaglioFranchisee } from "./dettaglio-franchisee";

export function ListaFranchisee({ franchisee = [] }) {
  const [search, setSearch] = useState("");
  const [filtroAttivo, setFiltroAttivo] = useState("all");

  const franchiseeFiltrati = useMemo(() => {
    return franchisee.filter((item) => {
      const searchValue = search.toLowerCase();

      const ragioneSociale = item.ragione_sociale?.toLowerCase() || "";
      const partitaIva = item.partita_iva?.toLowerCase() || "";
      const email = item.email?.toLowerCase() || "";
      const referente = item.referente?.toLowerCase() || "";

      const matchSearch =
        ragioneSociale.includes(searchValue) ||
        partitaIva.includes(searchValue) ||
        email.includes(searchValue) ||
        referente.includes(searchValue);

      const matchAttivo =
        filtroAttivo === "all" ||
        (filtroAttivo === "true" && item.attivo === true) ||
        (filtroAttivo === "false" && item.attivo === false);

      return matchSearch && matchAttivo;
    });
  }, [franchisee, search, filtroAttivo]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Elenco Franchisee</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_220px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cerca per ragione sociale, partita IVA, email o referente..."
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
                <TableHead>Referente</TableHead>
                <TableHead className="text-center w-16">Attivo</TableHead>
                <TableHead className="text-center w-16">Visualizza</TableHead>
                <TableHead className="text-center w-16">Modifica</TableHead>
                <TableHead className="text-center w-16">Elimina</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {franchiseeFiltrati.length > 0 ? (
                franchiseeFiltrati.map((item) => {
                  const stato =
                    typeof item.stato === "object"
                      ? item.stato?.stato
                      : item.id_stato;

                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {item.ragione_sociale || "-"}
                      </TableCell>

                      <TableCell>{stato || "-"}</TableCell>

                      <TableCell>{item.partita_iva || "-"}</TableCell>

                      <TableCell>{item.email || "-"}</TableCell>

                      <TableCell>{item.referente || "-"}</TableCell>

                      <TableCell className="text-center">
                        <ToggleBooleanRecordButton
                          tableName="franchisee"
                          idField="id"
                          id={item.id}
                          booleanField="attivo"
                          currentValue={item.attivo}
                        />
                      </TableCell>

                      <TableCell className="text-center">
                        <DialogGeneric
                          label="V"
                          title={item.ragione_sociale || "Dettaglio franchisee"}
                          description="Dati completi del franchisee"
                          data={<DettaglioFranchisee franchisee={item} />}
                        />
                      </TableCell>

                      <TableCell className="text-center">
                        <DialogGeneric
                          label="E"
                          title="Modifica franchisee"
                          description="Modifica i dati del franchisee."
                          data={
                            <FormUpdateFranchisee
                              franchisee={item}
                            />
                          }
                        />
                      </TableCell>

                      <TableCell className="text-center">
                        <DeleteRecordButton
                          tableName="franchisee"
                          idField="id"
                          id={item.id}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Nessun franchisee trovato.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <p className="text-sm text-muted-foreground">
          Totale risultati: {franchiseeFiltrati.length}
        </p>
      </CardContent>
    </Card>
  );
}