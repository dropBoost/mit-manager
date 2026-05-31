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
    fontSize: 9,
    fontFamily: "Helvetica",
  },
  title: {
    fontSize: 18,
    marginBottom: 8,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 10,
    marginBottom: 16,
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
  cellOrdine: { width: "18%" },
  cellData: { width: "13%" },
  cellProdotto: { width: "30%" },
  cellCodice: { width: "14%" },
  cellQta: { width: "8%", textAlign: "right" },
  cellUnita: { width: "7%" },
  cellSede: { width: "10%" },
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

export function PackingListOrdiniFornitorePDF({
  fornitoreNome,
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
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Packing list ordini fornitore</Text>

        <Text style={styles.subtitle}>
          Fornitore: {fornitoreNome || "-"} | Periodo: {formatDate(dataDa)} -{" "}
          {formatDate(dataA)} | Stato: {statoLabel(statoOrdine)}
        </Text>

        <View style={[styles.row, styles.head]}>
          <Text style={styles.cellOrdine}>Ordine</Text>
          <Text style={styles.cellData}>Data</Text>
          <Text style={styles.cellProdotto}>Prodotto</Text>
          <Text style={styles.cellCodice}>Codice</Text>
          <Text style={styles.cellQta}>Q.tà</Text>
          <Text style={styles.cellUnita}>Unità</Text>
          <Text style={styles.cellSede}>Sede</Text>
        </View>

        {righe.map((riga) => (
          <View key={riga.id} style={styles.row}>
            <Text style={styles.cellOrdine}>
              {riga.ordine?.id?.slice(0, 8) || "-"}
            </Text>

            <Text style={styles.cellData}>
              {formatDate(riga.ordine?.created_at)}
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

            <Text style={styles.cellSede}>
              {riga.ordine?.sede?.localita ||
                riga.ordine?.sede?.citta ||
                "-"}
            </Text>
          </View>
        ))}

        <View style={{ marginTop: 18 }}>
          <Text>Totale righe: {righe.length}</Text>
          <Text>Totale quantità: {totaleQuantita}</Text>
        </View>
      </Page>
    </Document>
  );
}