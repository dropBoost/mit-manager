import { DialogGeneric } from "@/components/dialogGeneric";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getCorrieri } from "@/utils/dataDB/getCorrieri";
import { getSpedizioneOrdineById } from "@/utils/dataDB/getSpedizioniOrdineByID";
import { FormOrdineSpedizione } from "./form-ordine-spedizione";
import { PopoverTracking } from "./popover-tracking";

export default async function SchedaOrdine({ ordine }) {

  const spedizioniOrdine = await getSpedizioneOrdineById(ordine.id)
  const righe = ordine?.righe || [];
  const corrieri = await getCorrieri()
  const totale = righe.reduce((acc, riga) => {
    return acc + Number(riga.prezzo || 0) * Number(riga.quantita || 0);
  }, 0);

  const indirizzoSpedizione = ordine?.righe[0]?.indirizzo_spedizione
  const sedeLabel =
    ordine?.sede?.franchisee?.ragione_sociale ||
    ordine?.sede?.citta ||
    "-";

  const localitaLabel =
    ordine?.sede?.localita ||
    ordine?.sede?.citta ||
    ordine?.sede?.indirizzo ||
    "-";

  const corrieriOptions = corrieri
    .filter((item) => item.attivo === true)
    .map((item) => ({
      value: item.cod,
      label: item.nome_corriere
        ? `${item.nome_corriere} (${item.cod})`
        : item.cod,
  }));

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
          <InfoRow label="Sede" value={sedeLabel} />
          <InfoRow label="Indirizzo Spedizione" value={indirizzoSpedizione} />
          <InfoRow label="Località" value={localitaLabel} />

          <div className="md:col-span-4">
            <InfoRow label="Note" value={ordine.note} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Righe ordine</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="overflow-hidden rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Prodotto</TableHead>
                  <TableHead>Codice</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>EAN</TableHead>
                  <TableHead>Q.tà</TableHead>
                  <TableHead>Unità</TableHead>
                  <TableHead className="text-right">Prezzo</TableHead>
                  <TableHead className="text-right">Totale</TableHead>
                  <TableHead className="text-right">Tracking</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {righe.length > 0 ? (
                  righe.map((riga) => {
                    const totaleRiga =
                      Number(riga.prezzo || 0) * Number(riga.quantita || 0);

                    const spedizione = spedizioniOrdine.find((s) => s.id_ordine_riga == riga.id)

                    return (
                      <TableRow key={riga.id}>
                        <TableCell className="font-medium">
                          {riga.nome_prodotto || "-"}
                        </TableCell>
                        <TableCell>{riga.codice_prodotto || "-"}</TableCell>
                        <TableCell>{riga.sku || "-"}</TableCell>
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
                          {spedizione ? <PopoverTracking label={spedizione.tracking || "evaso"} data={spedizione}/> :
                          <DialogGeneric label="EVADI" title={`Evadi ${riga.nome_prodotto}`}
                              description={`Evadendo il prodotto risulterà spedito`}
                              data={<FormOrdineSpedizione idOrdine={ordine.id} idOrdineRiga={riga.id} corrieri={corrieriOptions} />}/>}
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