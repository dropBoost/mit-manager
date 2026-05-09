"use client";

function Row({ label, value }) {
  return (
    <div className="grid grid-cols-1 gap-1 border-b py-3 md:grid-cols-[180px_1fr]">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <span className="text-sm">{value || "-"}</span>
    </div>
  );
}

export function DettaglioFranchisee({ franchisee }) {
  const stato =
    typeof franchisee?.stato === "object"
      ? `${franchisee.stato.stato} (${franchisee.stato.id})`
      : franchisee?.id_stato;

  const iva =
    typeof franchisee?.iva === "object"
      ? `${franchisee.iva.nome} - ${franchisee.iva.valore}%`
      : franchisee?.cod_iva;

  const indirizzo =
    franchisee?.id_stato === "IT"
      ? `${franchisee?.indirizzo_sl || ""}, ${franchisee?.cap_sl || ""} ${
          franchisee?.citta_sl || ""
        } ${franchisee?.provincia_sl || ""}`.trim()
      : franchisee?.indirizzo_sl_ext;

  return (
    <div className="space-y-1">
      <Row label="Ragione sociale" value={franchisee?.ragione_sociale} />
      <Row label="Partita IVA" value={franchisee?.partita_iva} />
      <Row label="Stato" value={stato} />
      <Row label="Aliquota IVA" value={iva} />
      <Row label="Codice univoco" value={franchisee?.codice_univoco} />
      <Row label="PEC" value={franchisee?.pec} />
      <Row label="Email" value={franchisee?.email} />
      <Row label="Telefono" value={franchisee?.tel} />
      <Row label="Mobile" value={franchisee?.mobile} />
      <Row label="Referente" value={franchisee?.referente} />
      <Row label="Mobile referente" value={franchisee?.mobile_ref} />
      <Row label="Email referente" value={franchisee?.email_ref} />
      <Row label="Indirizzo" value={indirizzo} />
      <Row label="Attivo" value={franchisee?.attivo ? "Sì" : "No"} />
      <Row
        label="Creato il"
        value={
          franchisee?.created_at
            ? new Date(franchisee.created_at).toLocaleDateString("it-IT")
            : "-"
        }
      />
    </div>
  );
}