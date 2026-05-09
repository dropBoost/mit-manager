"use client";

import { useMemo, useState } from "react";
import { Search, ImageIcon, EyeIcon, PencilIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { DeleteRecordButton } from "@/utils/functions/deleteRecordDB/buttonDeleteRecordDB";
import { ToggleBooleanRecordButton } from "@/utils/functions/toggleBooleandRecord/buttonToggleBooleanRecord";
import { Button } from "@/components/ui/button";
import { DrawerInfoProdotto } from "@/app/manager/prodotti/components/drawer-info-prodotto";
import Link from "next/link";

export function ListaProdotti({ prodotti = [] }) {
  const [search, setSearch] = useState("");
  const [filtroAttivo, setFiltroAttivo] = useState("all");

  const prodottiFiltrati = useMemo(() => {
    return prodotti.filter((prodotto) => {
      const nome = prodotto.nome?.toLowerCase() || "";
      const codice = prodotto.codice_prodotto?.toLowerCase() || "";
      const brand = prodotto.brand?.brand?.toLowerCase() || "";
      const searchValue = search.toLowerCase();

      const matchSearch =
        nome.includes(searchValue) ||
        codice.includes(searchValue) ||
        brand.includes(searchValue);

      const matchAttivo =
        filtroAttivo === "all" ||
        (filtroAttivo === "true" && prodotto.attivo === true) ||
        (filtroAttivo === "false" && prodotto.attivo === false);

      return matchSearch && matchAttivo;
    });
  }, [prodotti, search, filtroAttivo]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Elenco Prodotti</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_220px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cerca per nome, codice prodotto o brand..."
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
                <TableHead className="w-20">Img</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Codice</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead className="text-right">Prezzo vendita</TableHead>
                <TableHead className="text-center w-16">Attivo</TableHead>
                <TableHead className="text-center w-16">Modifica</TableHead>
                <TableHead className="text-center w-16">Visualizza</TableHead>
                <TableHead className="text-center w-16">Elimina</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {prodottiFiltrati.length > 0 ? (
                prodottiFiltrati.map((prodotto) => (
                    <TableRow key={prodotto.id} >
                      <TableCell>
                        {prodotto.immagine ? (
                          <img
                            src={prodotto.immagine}
                            alt={prodotto.nome || "Prodotto"}
                            className="h-12 w-12 rounded-md border object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-md border bg-muted">
                            <ImageIcon className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                      </TableCell>

                      <TableCell className="font-medium">
                        {prodotto.nome || "-"}
                      </TableCell>

                      <TableCell>{prodotto.codice_prodotto || "-"}</TableCell>

                      <TableCell>{prodotto.brand || "-"}</TableCell>

                      <TableCell>{prodotto.id_categoria || "-"}</TableCell>

                      <TableCell className="text-right">
                        {prodotto.prezzo_vendita
                          ? `€ ${Number(prodotto.prezzo_vendita).toFixed(2)}`
                          : "-"}
                      </TableCell>

                      <TableCell className="text-center">
                        <ToggleBooleanRecordButton
                          tableName="prodotto"
                          idField="id"
                          id={prodotto.id}
                          booleanField="attivo"
                          currentValue={prodotto.attivo}
                        />
                      </TableCell>

                      <TableCell className="text-center">
                        <Link href={`/manager/prodotti/anagrafica/modifica-prodotto/${prodotto.id}`}>
                          <Button size="icon"><PencilIcon/></Button>
                        </Link>
                      </TableCell>

                      <TableCell className="text-center">
                        <DrawerInfoProdotto title={prodotto.nome} data={prodotto} description={""} label={<EyeIcon/>}/>
                      </TableCell>

                      <TableCell className="text-center">
                        <DeleteRecordButton
                          tableName="prodotto"
                          idField="id"
                          id={prodotto.id}
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
                    Nessun prodotto trovato.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <p className="text-sm text-muted-foreground">
          Totale risultati: {prodottiFiltrati.length}
        </p>
      </CardContent>
    </Card>
  );
}