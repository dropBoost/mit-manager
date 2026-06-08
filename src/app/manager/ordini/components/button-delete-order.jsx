"use client";

import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteOrderAction } from "../action/deleteOrderAction";
import { redirect } from "next/navigation";

export function ButtonDeleteOrder({ tableName, idField = "id", id, productRow }) {

  async function handleDelete() {

    if (productRow != 0) return

    toast("Vuoi davvero eliminare quest'ordine?", {
      description: "Questa azione non può essere annullata.",
      action: {
        label: "Elimina",
        onClick: async () => {
          const result = await deleteOrderAction({
            tableName,
            idField,
            id,
            pathToRevalidate: "/admin/fornitori-prodotto",
          });

          if (result.success) {
            toast.success(result.message);
            redirect("/manager/ordini/gestione")
          } else {
            toast.error(result.message);
          }
        },
      },
      cancel: {
        label: "Annulla",
        onClick: () => toast.info("Eliminazione annullata"),
      },
    });

  }

  return (
    <Button type="button" variant="destructive" size="icon" onClick={handleDelete} disabled={productRow > 0}>
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}