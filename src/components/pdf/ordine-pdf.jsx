import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  title: {
    fontSize: 18,
    marginBottom: 12,
    fontWeight: "bold",
  },
  section: {
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
    paddingVertical: 6,
  },
  head: {
    fontWeight: "bold",
    backgroundColor: "#f2f2f2",
  },
  cellProduct: {
    width: "30%",
    paddingRight: 6,
  },
  cell: {
    width: "14%",
    paddingRight: 6,
  },
  cellRight: {
    width: "14%",
    textAlign: "right",
  },
  total: {
    marginTop: 16,
    textAlign: "right",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export function OrdinePDF({ ordine, righe = [] }) {
  const totale = righe.reduce((acc, riga) => {
    return acc + Number(riga.prezzo || 0) * Number(riga.quantita || 0);
  }, 0);

  const sedeLabel =
    ordine?.sede?.franchisee?.ragione_sociale ||
    ordine?.sede?.citta ||
    "-";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Ordine fornitore</Text>

        <View style={styles.section}>
          <Text>ID ordine: {ordine?.id || "-"}</Text>
          <Text>Sede: {sedeLabel}</Text>
          <Text>
            Data:{" "}
            {ordine?.created_at
              ? new Date(ordine.created_at).toLocaleDateString("it-IT")
              : "-"}
          </Text>
          <Text>Note: {ordine?.note || "-"}</Text>
        </View>

        <View style={[styles.row, styles.head]}>
          <Text style={styles.cellProduct}>Prodotto</Text>
          <Text style={styles.cell}>Codice</Text>
          <Text style={styles.cell}>SKU</Text>
          <Text style={styles.cell}>Q.tà</Text>
          <Text style={styles.cell}>Unità</Text>
          <Text style={styles.cellRight}>Prezzo</Text>
        </View>

        {righe.map((riga) => (
          <View key={riga.id} style={styles.row}>
            <Text style={styles.cellProduct}>
              {riga.nome_prodotto || "-"}
            </Text>
            <Text style={styles.cell}>{riga.codice_prodotto || "-"}</Text>
            <Text style={styles.cell}>{riga.sku || "-"}</Text>
            <Text style={styles.cell}>{riga.quantita || "-"}</Text>
            <Text style={styles.cell}>{riga.unita || "-"}</Text>
            <Text style={styles.cellRight}>
              € {Number(riga.prezzo || 0).toFixed(2)}
            </Text>
          </View>
        ))}

        <Text style={styles.total}>
          Totale: € {totale.toFixed(2)}
        </Text>
      </Page>
    </Document>
  );
}