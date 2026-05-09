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

import { DettaglioSedeIndirizzo } from "./dettaglio-sede-indirizzo";
import { FormUpdateSedeIndirizzo } from "./form-update-sede-indirizzo";

export function ListaSedeIndirizzi({ indirizzi = [], sedi = [] }) {
  const [selectedSede, setSelectedSede] = useState("");
  const [search, setSearch] = useState("");
  const [filtroAttivo, setFiltroAttivo] = useState("all");

  const indirizziFiltrati = useMemo(() => {
    if (!selectedSede) return [];

    return indirizzi.filter((item) => {
      const searchValue = search.toLowerCase();

      const matchSede = item.id_sede === selectedSede;

      const alias = item.alias_indirizzo?.toLowerCase() || "";
      const nominativo = item.nominativo?.toLowerCase() || "";
      const indirizzo = item.indirizzo?.toLowerCase() || "";
      const citta = item.citta?.toLowerCase() || "";
      const email = item.email?.toLowerCase() || "";
      const mobile = item.mobile?.toLowerCase() || "";

      const matchSearch =
        alias.includes(searchValue) ||
        nominativo.includes(searchValue) ||
        indirizzo.includes(searchValue) ||
        citta.includes(searchValue) ||
        email.includes(searchValue) ||
        mobile.includes(searchValue);

      const matchAttivo =
        filtroAttivo === "all" ||
        (filtroAttivo === "true" && item.attivo === true) ||
        (filtroAttivo === "false" && item.attivo === false);

      return matchSede && matchSearch && matchAttivo;
    });
  }, [indirizzi, selectedSede, search, filtroAttivo]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Elenco indirizzi sede</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_220px]">
          <Select value={selectedSede} onValueChange={setSelectedSede}>
            <SelectTrigger>
              <SelectValue placeholder="Seleziona prima una sede" />
            </SelectTrigger>

            <SelectContent>
              {sedi.map((sede) => (
                <SelectItem key={sede.value} value={sede.value}>
                  {sede.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cerca indirizzo, nominativo, città..."
              className="pl-9"
              disabled={!selectedSede}
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

        {!selectedSede ? (
          <div className="rounded-md border p-6 text-center text-sm text-muted-foreground">
            Seleziona una sede per visualizzare gli indirizzi collegati.
          </div>
        ) : (
          <div className="overflow-hidden rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Alias</TableHead>
                  <TableHead>Nominativo</TableHead>
                  <TableHead>Indirizzo</TableHead>
                  <TableHead>Città</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-center w-16">Attivo</TableHead>
                  <TableHead className="text-center w-16">Visualizza</TableHead>
                  <TableHead className="text-center w-16">Modifica</TableHead>
                  <TableHead className="text-center w-16">Elimina</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {indirizziFiltrati.length > 0 ? (
                  indirizziFiltrati.map((item) => {
                    const indirizzoCompleto = [
                      item.indirizzo,
                      item.numero_civico,
                      item.cap,
                      item.citta,
                      item.provincia,
                    ]
                      .filter(Boolean)
                      .join(", ");

                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {item.alias_indirizzo || "-"}
                        </TableCell>

                        <TableCell>{item.nominativo || "-"}</TableCell>
                        <TableCell>{indirizzoCompleto || "-"}</TableCell>
                        <TableCell>{item.citta || "-"}</TableCell>
                        <TableCell>{item.email || "-"}</TableCell>

                        <TableCell className="text-center">
                          <ToggleBooleanRecordButton
                            tableName="sede_indirizzo"
                            idField="id"
                            id={item.id}
                            booleanField="attivo"
                            currentValue={item.attivo}
                          />
                        </TableCell>

                        <TableCell className="text-center">
                          <DialogGeneric
                            label="V"
                            title={item.alias_indirizzo || "Dettaglio indirizzo"}
                            description="Dati completi dell'indirizzo"
                            data={<DettaglioSedeIndirizzo indirizzo={item} />}
                          />
                        </TableCell>

                        <TableCell className="text-center">
                          <DialogGeneric
                            label="E"
                            title="Modifica indirizzo"
                            description="Modifica i dati dell'indirizzo."
                            data={<FormUpdateSedeIndirizzo indirizzo={item} />}
                          />
                        </TableCell>

                        <TableCell className="text-center">
                          <DeleteRecordButton
                            tableName="sede_indirizzo"
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
                      Nessun indirizzo trovato per questa sede.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}

        <p className="text-sm text-muted-foreground">
          Totale risultati: {indirizziFiltrati.length}
        </p>
      </CardContent>
    </Card>
  );
}