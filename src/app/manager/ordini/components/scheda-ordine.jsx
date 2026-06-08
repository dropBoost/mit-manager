import { DialogGeneric } from "@/components/dialogGeneric";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { X } from "lucide-react";
import { getCorrieri } from "@/utils/dataDB/getCorrieri";
import { getProdotto } from "@/utils/dataDB/getProdotto";
import { FormOrdineSpedizione } from "./form-ordine-spedizione";
import { formatDate } from "@/utils/functions/date/dataFormatter";
import { FormOrdineRiga } from "./form-ordine-riga";
import { PopoverTracking } from "./popover-tracking";
import { DialogDocumentsOrdiniFornitore } from "@/components/dialogDocumentsOrdiniFornitore";
import { getListiniProdottoSedeByID } from "@/utils/dataDB/getListiniProdottoSedeByID";
import { ButtonDeleteOrder } from "./button-delete-order";
import { ButtonDeleteRiga } from "./button-delete-riga";

export default async function SchedaOrdine({ ordine }) {

  const sede = ordine?.id_sede
  const prodotti = await getProdotto()
  const listinoSede = await getListiniProdottoSedeByID(sede)
  const righe = ordine?.righe || [];
  const corrieri = await getCorrieri()
  const totale = righe.reduce((acc, riga) => {
    return acc + Number(riga.prezzo || 0) * Number(riga.quantita || 0);
  }, 0);

  const indirizzoSpedizione = ordine?.righe[0]?.indirizzo_spedizione
  const franchisee = ordine?.sede?.franchisee?.ragione_sociale || "-";
  const localitaLabel = ordine?.sede?.localita || "-";

  const corrieriOptions = corrieri
    .filter((item) => item.attivo === true)
    .map((item) => ({
      value: item.cod,
      label: item.nome_corriere
        ? `${item.nome_corriere} (${item.cod})`
        : item.cod,
  }));

  const fornitoriMap = new Map();

  ordine?.righe.forEach((riga) => {

    const idFornitore = riga.prodotto?.id_fornitore || riga.id_fornitore;
    const nomeFornitore = riga.prodotto?.fornitore?.ragione_sociale || riga.fornitore_nome;

    if (!fornitoriMap.has(idFornitore)) {
      fornitoriMap.set(idFornitore, {
        id_fornitore: idFornitore,
        fornitore_nome: nomeFornitore,
        id_ordine: ordine.id,
        righe: [],
      });
    }

    fornitoriMap.get(idFornitore).righe.push(riga);
  });

  const fornitoriUniciOrdine = Array.from(fornitoriMap.values());

  const prodottiListinoSede = prodotti.map((pl) => {
    
    const listinoProdotto = listinoSede.find((l) => l.id_prodotto == pl.id);
    
    return {
      ...pl,
      prezzo_vendita: listinoProdotto?.prezzo_vendita ?? pl.prezzo_vendita,
      minimo_ordine: listinoProdotto?.minimo_ordine || 1,
    };
    
  })

  if (!ordine) {
    return (
      <Card>
        <CardContent className="p-6 text-muted-foreground">
          Ordine non trovato.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle>Scheda ordine</CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-1 gap-5 md:grid-cols-4">
          <InfoRow label="ID ordine" value={ordine.id} />
          <InfoRow
            label="Data ordine"
            value={
              ordine.created_at
                ? new Date(ordine.created_at).toLocaleString("it-IT")
                : "-"
            }
          />
          <InfoRow label="Franchisee" value={franchisee} />
          <InfoRow label="Indirizzo Spedizione" value={indirizzoSpedizione} />
          <InfoRow label="Località" value={localitaLabel} />

          <div className="md:col-span-4">
            <InfoRow label="Note" value={ordine.note} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-row items-center justify-between">
            <CardTitle>Righe ordine</CardTitle>
            <DialogGeneric disabledStatus={ordine.stato_ordine === "CPL"} label={`Aggiungi Prodotto +`}
              data={
              <FormOrdineRiga
              idOrdine={ordine.id}
              prodotti={prodottiListinoSede}
              indirizzoSpedizione={indirizzoSpedizione}/>}
              title={`Aggiungi Prodotto`}
              description={`Aggiungi prodotti all'ordine`}
            />
            <div className="flex flex-row gap-1">
              <DialogDocumentsOrdiniFornitore
                label="Documenti"
                ordine={ordine}
                data={fornitoriUniciOrdine}
                title="Stampa Ordini Fornitore"
              />
              <ButtonDeleteOrder
                tableName="ordine"
                idField="id"
                id={ordine?.id}
                productRow={righe?.length}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-hidden rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Prodotto</TableHead>
                  <TableHead>Codice</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Fornitore</TableHead>
                  <TableHead>EAN</TableHead>
                  <TableHead>Q.tà</TableHead>
                  <TableHead>Unità</TableHead>
                  <TableHead className="text-right">Prezzo</TableHead>
                  <TableHead className="text-right">Totale</TableHead>
                  <TableHead className="text-right">Data di Consegna</TableHead>
                  <TableHead className="text-right">Tracking</TableHead>
                  <TableHead className="flex justify-center items-center text-red-800"><X className="h-3 w-3" /></TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {righe.length > 0 ? (
                  righe.map((riga) => {

                    const totaleRiga = Number(riga.prezzo || 0) * Number(riga.quantita || 0);
                    const spedizione = riga.evasione[0] || []
                    const tracking = spedizione?.tracking
                    
                    return (
                      <TableRow key={riga.id}>
                        <TableCell className="font-medium">
                          {riga.nome_prodotto || "-"}
                        </TableCell>
                        <TableCell>{riga.codice_prodotto || "-"}</TableCell>
                        <TableCell>{riga.sku || "-"}</TableCell>
                        <TableCell>{riga.prodotto.fornitore.ragione_sociale || "-"}</TableCell>
                        <TableCell>{riga.ean || "-"}</TableCell>
                        <TableCell>{riga.quantita || "-"}</TableCell>
                        <TableCell>{riga.unita || "-"}</TableCell>
                        <TableCell className="text-right">
                          € {Number(riga.prezzo || 0).toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          € {totaleRiga.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatDate(spedizione.data_consegna) || "non disponibile"}
                        </TableCell>
                        <TableCell className="text-right">
                          {riga.stato_evasione == "evaso" ? 
                          <PopoverTracking label={tracking || "evaso"} data={spedizione}/> :
                          <DialogGeneric label="Evadi" title={`Evadi ${riga.nome_prodotto}`}
                            description={`Evadendo il prodotto risulterà spedito`}
                            data={<FormOrdineSpedizione idOrdine={ordine.id} idOrdineRiga={riga.id} corrieri={corrieriOptions} />}
                          />
                          }
                        </TableCell>
                        <TableCell className="text-center">
                          <ButtonDeleteRiga idRiga={riga.id} statoEvasione={riga.stato_evasione} statoOrdine={ordine.stato_ordine} pathToRevalidate={`/manager/ordini/gestione/gestione-ordine/${ordine.id}`}/>
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
                      Nessuna riga ordine.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-5 flex-col justify-end gap-3">
            <div className="flex flex-col justify-center items-end rounded-md border bg-muted/40 px-5 py-3">
              <CardDescription>Totale prodotti</CardDescription>
              <CardTitle>€ {totale.toFixed(2)} / iva compresa</CardTitle>
              <CardDescription>Totale Spedizioni</CardDescription>
              <CardTitle>€ {totale.toFixed(2)} / iva compresa</CardTitle>
              {totale <= 0 ? <CardDescription>*i costi di spedizione vengono calcolati dopo l'evasione</CardDescription> : null }
            </div>
          </div>
          <div className="mt-5 flex justify-end gap-3">
            <div className="rounded-md border border-primary bg-muted/40 px-5 py-3">
              <p className="text-sm text-muted-foreground">Totale Ordine</p>
              <p className="text-xl font-semibold">€ {totale.toFixed(2)}</p>
              <CardDescription>*totale prodotti iva compresa</CardDescription>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


function InfoRow({ label, value }) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium">{value || "-"}</p>
    </div>
  );
}