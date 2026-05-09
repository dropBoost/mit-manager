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

import { DettaglioCorriere } from "./dettaglio-corriere";
import { FormUpdateCorriere } from "./form-update-corriere";

export function ListaCorrieri({ corrieri = [] }) {
  const [search, setSearch] = useState("");
  const [filtroAttivo, setFiltroAttivo] = useState("all");

  const corrieriFiltrati = useMemo(() => {
    return corrieri.filter((item) => {
      const searchValue = search.toLowerCase();

      const cod = item.cod?.toLowerCase() || "";
      const nome = item.nome_corriere?.toLowerCase() || "";
      const email = item.email?.toLowerCase() || "";
      const riferimento = item.riferimento?.toLowerCase() || "";

      const matchSearch =
        cod.includes(searchValue) ||
        nome.includes(searchValue) ||
        email.includes(searchValue) ||
        riferimento.includes(searchValue);

      const matchAttivo =
        filtroAttivo === "all" ||
        (filtroAttivo === "true" && item.attivo === true) ||
        (filtroAttivo === "false" && item.attivo === false);

      return matchSearch && matchAttivo;
    });
  }, [corrieri, search, filtroAttivo]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Elenco Corrieri</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_220px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cerca per codice, nome, email o riferimento..."
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
                <TableHead>Codice</TableHead>
                <TableHead>Nome corriere</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Riferimento</TableHead>
                <TableHead className="text-center w-16">Tracking</TableHead>
                <TableHead className="text-center w-16">Attivo</TableHead>
                <TableHead className="text-center w-16">Visualizza</TableHead>
                <TableHead className="text-center w-16">Modifica</TableHead>
                <TableHead className="text-center w-16">Elimina</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {corrieriFiltrati.length > 0 ? (
                corrieriFiltrati.map((item) => (
                  <TableRow key={item.cod}>
                    <TableCell className="font-medium">
                      {item.cod || "-"}
                    </TableCell>

                    <TableCell>{item.nome_corriere || "-"}</TableCell>
                    <TableCell>{item.email || "-"}</TableCell>
                    <TableCell>{item.riferimento || "-"}</TableCell>

                    <TableCell className="text-center">
                      <ToggleBooleanRecordButton
                        tableName="corriere"
                        idField="cod"
                        id={item.cod}
                        booleanField="tracking_attivo"
                        currentValue={item.tracking_attivo}
                      />
                    </TableCell>

                    <TableCell className="text-center">
                      <ToggleBooleanRecordButton
                        tableName="corriere"
                        idField="cod"
                        id={item.cod}
                        booleanField="attivo"
                        currentValue={item.attivo}
                      />
                    </TableCell>

                    <TableCell className="text-center">
                      <DialogGeneric
                        label="V"
                        title={item.nome_corriere || item.cod}
                        description="Scheda dati corriere"
                        data={<DettaglioCorriere corriere={item} />}
                      />
                    </TableCell>

                    <TableCell className="text-center">
                      <DialogGeneric
                        label="E"
                        title="Modifica corriere"
                        description="Aggiorna i dati del corriere."
                        data={<FormUpdateCorriere corriere={item} />}
                      />
                    </TableCell>

                    <TableCell className="text-center">
                      <DeleteRecordButton
                        tableName="corriere"
                        idField="cod"
                        id={item.cod}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Nessun corriere trovato.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <p className="text-sm text-muted-foreground">
          Totale risultati: {corrieriFiltrati.length}
        </p>
      </CardContent>
    </Card>
  );
}