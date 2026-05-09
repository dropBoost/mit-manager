"use client";

function Row({ label, value }) {
  return (
    <div className="grid grid-cols-1 gap-1 border-b py-3 md:grid-cols-[180px_1fr]">
      <span className="text-sm font-medium text-muted-foreground">
        {label}
      </span>
      <span className="text-sm">{value || "-"}</span>
    </div>
  );
}

export function DettaglioSedeIndirizzo({ indirizzo }) {
  const sedeLabel = indirizzo?.sede
    ? `${indirizzo.sede.franchisee?.ragione_sociale || ""} - ${
        indirizzo.sede.localita || indirizzo.sede.citta || indirizzo.sede.indirizzo || ""
      }`
    : indirizzo?.id_sede || "";

  const indirizzoCompleto = [
    indirizzo?.indirizzo,
    indirizzo?.numero_civico,
    indirizzo?.cap,
    indirizzo?.citta,
    indirizzo?.provincia,
    indirizzo?.stato,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="space-y-1">
      <Row label="Sede" value={sedeLabel} />
      <Row label="Alias indirizzo" value={indirizzo?.alias_indirizzo} />
      <Row label="Nominativo" value={indirizzo?.nominativo} />
      <Row label="Indirizzo completo" value={indirizzoCompleto} />
      <Row label="Email" value={indirizzo?.email} />
      <Row label="Mobile" value={indirizzo?.mobile} />
      <Row label="Note" value={indirizzo?.note_indirizzo} />
      <Row label="Attivo" value={indirizzo?.attivo ? "Sì" : "No"} />
      <Row
        label="Creato il"
        value={
          indirizzo?.created_at
            ? new Date(indirizzo.created_at).toLocaleDateString("it-IT")
            : "-"
        }
      />
    </div>
  );
}