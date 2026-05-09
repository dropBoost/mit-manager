"use client";

function Row({ label, value }) {
  return (
    <div className="grid grid-cols-1 gap-1 border-b py-3 md:grid-cols-[180px_1fr]">
      <span className="text-sm font-medium text-muted-foreground">
        {label}
      </span>

      <span className="text-sm break-all">{value || "-"}</span>
    </div>
  );
}

export function DettaglioCorriere({ corriere }) {
  return (
    <div className="space-y-1">
      <Row label="Codice" value={corriere?.cod} />
      <Row label="Nome corriere" value={corriere?.nome_corriere} />
      <Row label="Email" value={corriere?.email} />
      <Row label="Riferimento" value={corriere?.riferimento} />
      <Row label="Mobile" value={corriere?.mobile} />
      <Row label="Telefono" value={corriere?.tel} />
      <Row label="Link tracking" value={corriere?.link_tracking} />
      <Row
        label="Tracking attivo"
        value={corriere?.tracking_attivo ? "Sì" : "No"}
      />
      <Row label="Attivo" value={corriere?.attivo ? "Sì" : "No"} />
    </div>
  );
}