"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export function ButtonPdfOrdineFornitore({
  ordine,
  righe = [],
  fornitore = null,
  label = "Genera PDF",
}) {
  const [loading, setLoading] = useState(false);

  async function handleGeneraPdf() {
    try {
      setLoading(true);

      const payload = {
        ordine: {
          id: ordine.id,
          created_at: ordine.created_at,
          note: ordine.note,
          sede: ordine.sede,
        },
        fornitore,
        righe,
      };

      const response = await fetch("/api/ordini/pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Errore generazione PDF");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      window.open(url, "_blank");

      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 10000);
    } catch (error) {
      console.error(error);
      alert("Errore durante la generazione del PDF.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      type="button"
      onClick={handleGeneraPdf}
      disabled={loading || righe.length === 0}
      className="gap-2"
    >
      {loading && <Spinner data-icon="inline-start" />}
      {loading ? "Generazione..." : label}
    </Button>
  );
}