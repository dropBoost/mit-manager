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

export function DettaglioSede({ sede }) {
  const franchiseeLabel =
    sede?.franchisee?.ragione_sociale || sede?.id_franchisee || "";

  const statoLabel = sede?.stato?.stato
    ? `${sede.stato.stato} (${sede.stato.id})`
    : sede?.id_stato || "";

  return (
    <div className="space-y-1">
      <Row label="Franchisee" value={franchiseeLabel} />
      <Row label="Stato" value={statoLabel} />
      <Row label="Città" value={sede?.citta} />
      <Row label="Località" value={sede?.localita} />
      <Row label="Indirizzo" value={sede?.indirizzo} />
      <Row label="Telefono" value={sede?.tel} />
      <Row label="Mobile" value={sede?.mobile} />
      <Row label="Email" value={sede?.email} />
      <Row label="Nominativo referente" value={sede?.nominativo_ref} />
      <Row label="Mobile referente" value={sede?.mobile_ref} />
      <Row label="Email referente" value={sede?.email_ref} />
      <Row label="Attiva" value={sede?.attivo ? "Sì" : "No"} />
      <Row
        label="Creata il"
        value={
          sede?.created_at
            ? new Date(sede.created_at).toLocaleDateString("it-IT")
            : "-"
        }
      />
    </div>
  );
}