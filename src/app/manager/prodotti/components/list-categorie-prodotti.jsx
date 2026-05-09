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

import { DeleteRecordButton } from "@/utils/functions/deleteRecordDB/buttonDeleteRecordDB";
import { ToggleBooleanRecordButton } from "@/utils/functions/toggleBooleandRecord/buttonToggleBooleanRecord";

export function ListaCategorieProdotto({ categorie = [] }) {
  const [search, setSearch] = useState("");
  const [filtroAttivo, setFiltroAttivo] = useState("all");
  const [filtroSupercategoria, setFiltroSupercategoria] = useState("all");

  const supercategorieDisponibili = useMemo(() => {
    const map = new Map();

    categorie.forEach((item) => {
      const nomeSupercategoria = item.supercategoria?.supercategoria;

      if (nomeSupercategoria) {
        map.set(nomeSupercategoria, nomeSupercategoria);
      }
    });

    return Array.from(map.values()).sort((a, b) => a.localeCompare(b));
  }, [categorie]);

  const categorieFiltrate = useMemo(() => {
    return categorie.filter((item) => {
      const nomeCategoria = item.categoria?.toLowerCase() || "";
      const nomeSupercategoria =
        item.supercategoria?.supercategoria?.toLowerCase() || "";

      const searchValue = search.toLowerCase();

      const matchSearch =
        nomeCategoria.includes(searchValue) ||
        nomeSupercategoria.includes(searchValue);

      const matchAttivo =
        filtroAttivo === "all" ||
        (filtroAttivo === "true" && item.attivo === true) ||
        (filtroAttivo === "false" && item.attivo === false);

      const matchSupercategoria =
        filtroSupercategoria === "all" ||
        item.supercategoria?.supercategoria === filtroSupercategoria;

      return matchSearch && matchAttivo && matchSupercategoria;
    });
  }, [categorie, search, filtroAttivo, filtroSupercategoria]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Elenco Categorie Prodotto</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_220px_260px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cerca categoria o supercategoria..."
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

          <Select
            value={filtroSupercategoria}
            onValueChange={setFiltroSupercategoria}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filtra per supercategoria" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">Tutte le supercategorie</SelectItem>

              {supercategorieDisponibili.map((supercategoria) => (
                <SelectItem key={supercategoria} value={supercategoria}>
                  {supercategoria}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Categoria</TableHead>
                <TableHead>Supercategoria</TableHead>
                <TableHead className="text-center w-16">Attivo</TableHead>
                <TableHead className="text-center w-16">Elimina</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {categorieFiltrate.length > 0 ? (
                categorieFiltrate.map((item) => (
                  <TableRow key={item.categoria}>
                    <TableCell className="font-medium">
                      {item.categoria}
                    </TableCell>

                    <TableCell>
                      {item.supercategoria?.supercategoria || "-"}
                    </TableCell>

                    <TableCell className="text-center">
                      <ToggleBooleanRecordButton
                        tableName="categoria_prodotto"
                        idField="categoria"
                        id={item.categoria}
                        booleanField="attivo"
                        currentValue={item.attivo}
                      />
                    </TableCell>

                    <TableCell className="text-center">
                      <DeleteRecordButton
                        tableName="categoria_prodotto"
                        idField="categoria"
                        id={item.categoria}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Nessuna categoria trovata.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <p className="text-sm text-muted-foreground">
          Totale risultati: {categorieFiltrate.length}
        </p>
      </CardContent>
    </Card>
  );
}