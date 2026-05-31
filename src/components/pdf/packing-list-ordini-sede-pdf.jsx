import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 28,
    fontSize: 8,
    fontFamily: "Helvetica",
  },
  title: {
    fontSize: 18,
    marginBottom: 8,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 10,
    marginBottom: 14,
  },
  meta: {
    marginBottom: 12,
    gap: 3,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
    paddingVertical: 5,
  },
  head: {
    backgroundColor: "#f2f2f2",
    fontWeight: "bold",
  },
  cellOrdine: { width: "14%" },
  cellData: { width: "12%" },
  cellFornitore: { width: "18%" },
  cellProdotto: { width: "25%" },
  cellCodice: { width: "13%" },
  cellQta: { width: "8%", textAlign: "right" },
  cellUnita: { width: "6%" },
  cellStato: { width: "10%" },
  footer: {
    marginTop: 18,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#d4d4d4",
  },
});

function formatDate(date) {
  if (!date) return "-";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "-";

  return new Intl.DateTimeFormat("it-IT").format(parsedDate);
}

function statoLabel(value) {
  if (value === "CRT") return "Creato";
  if (value === "LVR") return "Lavorazione";
  if (value === "CPL") return "Completato";
  return "Tutti";
}

export function PackingListOrdiniSedePDF({
  sedeNome,
  dataDa,
  dataA,
  statoOrdine,
  righe = [],
}) {
  const totaleQuantita = righe.reduce((acc, riga) => {
    return acc + Number(riga.quantita || 0);
  }, 0);

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <Text style={styles.title}>Packing list ordini sede</Text>

        <View style={styles.meta}>
          <Text>Sede: {sedeNome || "-"}</Text>
          <Text>
            Periodo: {formatDate(dataDa)} - {formatDate(dataA)}
          </Text>
          <Text>Stato ordine: {statoLabel(statoOrdine)}</Text>
        </View>

        <View style={[styles.row, styles.head]}>
          <Text style={styles.cellOrdine}>Ordine</Text>
          <Text style={styles.cellData}>Data</Text>
          <Text style={styles.cellFornitore}>Fornitore</Text>
          <Text style={styles.cellProdotto}>Prodotto</Text>
          <Text style={styles.cellCodice}>Codice</Text>
          <Text style={styles.cellQta}>Q.tà</Text>
          <Text style={styles.cellUnita}>Unità</Text>
          <Text style={styles.cellStato}>Stato</Text>
        </View>

        {righe.length > 0 ? (
          righe.map((riga) => (
            <View key={riga.id} style={styles.row}>
              <Text style={styles.cellOrdine}>
                {riga.ordine?.id?.slice(0, 8) || "-"}
              </Text>

              <Text style={styles.cellData}>
                {formatDate(riga.ordine?.created_at)}
              </Text>

              <Text style={styles.cellFornitore}>
                {riga.prodotto?.fornitore?.ragione_sociale || "-"}
              </Text>

              <Text style={styles.cellProdotto}>
                {riga.nome_prodotto || "-"}
              </Text>

              <Text style={styles.cellCodice}>
                {riga.codice_prodotto || "-"}
              </Text>

              <Text style={styles.cellQta}>
                {Number(riga.quantita || 0)}
              </Text>

              <Text style={styles.cellUnita}>
                {riga.unita || "-"}
              </Text>

              <Text style={styles.cellStato}>
                {statoLabel(riga.ordine?.stato_ordine)}
              </Text>
            </View>
          ))
        ) : (
          <View style={styles.row}>
            <Text>Nessun ordine trovato per i filtri selezionati.</Text>
          </View>
        )}

        <View style={styles.footer}>
          <Text>Totale righe: {righe.length}</Text>
          <Text>Totale quantità: {totaleQuantita}</Text>
        </View>
      </Page>
    </Document>
  );
}