"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, EyeIcon, CircleCheck, Circle, MessageSquareMore, ShoppingBag, ListRestart, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleStatoOrdine } from "./toggle-stato-ordine";
import { PopoverGeneric } from "@/components/popoverGeneric";
import { PopoverTracking } from "./popover-tracking";
import { formatDateHour } from "@/utils/functions/date/dataFormatter";

export default function ListaOrdini() {

  const [ordini, setOrdini] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [dataFiltro, setDataFiltro] = useState("");
  const [sedeFiltro, setSedeFiltro] = useState("all");
  const [statoOrdine, setStatoOrdine] = useState("parzial");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [count, setCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [update, setUpdate] = useState(0)

  const fetchOrdini = async () => {

    setLoading(true);

    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        search,
        sede: sedeFiltro,
        stato_ordine: statoOrdine,
        data: dataFiltro,
      });

      const res = await fetch(`/api/ordini?${params.toString()}`, {
        cache: "no-store",
      });

      const result = await res.json();

      setOrdini(result.ordini || []);
      setCount(result.count || 0);
      setTotalPages(result.totalPages || 1);
    } catch (error) {
      console.error("Errore fetch ordini:", error);
      setOrdini([]);
      setCount(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdini();
  }, [page, limit, sedeFiltro, statoOrdine, dataFiltro]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPage(1);
      fetchOrdini();
    }, 400);

    return () => clearTimeout(timeout);
  }, [search, update]);

  const resetFiltri = () => {
    setSearch("");
    setDataFiltro("");
    setSedeFiltro("all");
    setStatoOrdine("parzial");
    setPage(1);
    setLimit(25);
  };

  const sedi = useMemo(() => {
    const map = new Map();

    ordini.forEach((ordine) => {
      if (!ordine.sede?.id) return;

      const label =
        ordine.sede?.franchisee?.ragione_sociale ||
        ordine.sede?.localita ||
        ordine.sede?.citta ||
        ordine.sede.id;

      map.set(ordine.sede.id, label);
    });

    return Array.from(map, ([id, label]) => ({ id, label }));
  }, [ordini]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Elenco Ordini</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-col gap-2">
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-row gap-2 basis-4/12">
              <Input
                className="basis-2/4 text-xs"
                type="date"
                value={dataFiltro}
                onChange={(e) => {
                  setDataFiltro(e.target.value);
                  setPage(1);
                }}
              />

              <div className="basis-2/4">
                <Select
                  value={statoOrdine}
                  onValueChange={(value) => {
                    setStatoOrdine(value);
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Stato ordine" />
                  </SelectTrigger>

                  <SelectContent className="w-full">
                    <SelectItem value="all">Tutti</SelectItem>
                    <SelectItem value="LVR">In Lavorazione</SelectItem>
                    <SelectItem value="parzial">In Corso</SelectItem>
                    <SelectItem value="CPL">Completati</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="basis-2/12">
              <Select
                value={sedeFiltro}
                onValueChange={(value) => {
                  setSedeFiltro(value);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filtra per sede" />
                </SelectTrigger>

                <SelectContent className="w-full">
                  <SelectItem value="all">Tutte le sedi</SelectItem>

                  {sedi.map((sede) => (
                    <SelectItem key={sede.id} value={sede.id}>
                      {sede.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-row gap-2 w-full">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cerca ordine..."
                className="pl-9"
              />
            </div>

            <Button type="button" onClick={resetFiltri}>
              <ListRestart />
            </Button>
          </div>
        </div>

        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className={`w-28`}>Data</TableHead>
                <TableHead>Sede</TableHead>
                <TableHead className="justify-items-center w-16">
                  <ShoppingBag className="w-4 h-4" />
                </TableHead>
                <TableHead className="text-right">Totale</TableHead>
                <TableHead className="text-center w-16">Note</TableHead>
                <TableHead className="text-center w-16">Stato</TableHead>
                <TableHead className="text-center w-16">Visualizza</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    Caricamento ordini...
                  </TableCell>
                </TableRow>
              ) : ordini.length > 0 ? (
                ordini.map((ordine) => {
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
                        {formatDateHour(ordine.created_at)}
                      </TableCell>

                      <TableCell className="font-medium">
                        {sedeLabel} {localitaLabel && `- ${localitaLabel}`}
                      </TableCell>

                      <TableCell className="text-center">
                        {righe.length}
                      </TableCell>

                      <TableCell className="text-right">
                        € {totale.toFixed(2)}
                      </TableCell>

                      <TableCell className="text-center">
                        {ordine.note ? (
                          <PopoverGeneric
                            variant="ghost"
                            label={<MessageSquareMore />}
                            data={ordine.note}
                          />
                        ) : (
                          " "
                        )}
                      </TableCell>

                      <TableCell className="text-center">
                        <ToggleStatoOrdine
                          tableName="ordine"
                          idField="id"
                          id={ordine.id}
                          updateField="stato_ordine"
                          currentValue={ordine.stato_ordine}
                          label={ordine.stato.alias}
                          iconTrue={<CircleCheck />}
                          iconFalse={<Circle/>}
                          setUpdate={setUpdate}
                          pathToRevalidate="/manager/ordini/gestione/gestione-ordine"
                        />
                      </TableCell>

                      <TableCell className="text-center">
                        <Link
                          href={`/manager/ordini/gestione/gestione-ordine/${ordine.id}`}
                        >
                          <Button size="icon">
                            <EyeIcon />
                          </Button>
                        </Link>
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
                    Nessun ordine trovato.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-muted-foreground">
            Totale risultati: {count}
          </p>

          <div className="flex items-center gap-2">
            <Select
              value={String(limit)}
              onValueChange={(value) => {
                setLimit(Number(value));
                setPage(1);
              }}
            >
              <SelectTrigger className="w-30">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="25">25 ordini</SelectItem>
                <SelectItem value="50">50 ordini</SelectItem>
                <SelectItem value="75">75 ordini</SelectItem>
                <SelectItem value="100">100 ordini</SelectItem>
              </SelectContent>
            </Select>

            <Button
              type="button"
              variant="outline"
              size="xs"
              disabled={page <= 1 || loading}
              onClick={() => setPage((prev) => prev - 1)}
            >
              <ChevronLeft/>
            </Button>

            <span className="text-xs text-muted-foreground whitespace-nowrap">
              Pagina {page} di {totalPages}
            </span>

            <Button
              type="button"
              size="xs"
              variant="outline"
              disabled={page >= totalPages || loading}
              onClick={() => setPage((prev) => prev + 1)}
            >
              <ChevronRight/>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}