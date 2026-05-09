"use client";

import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteRecordAction } from "./deleteRecordDB";

export function DeleteRecordButton({ tableName, idField = "id", id }) {
  async function handleDelete() {
    toast("Vuoi davvero eliminare questo record?", {
      description: "Questa azione non può essere annullata.",
      action: {
        label: "Elimina",
        onClick: async () => {
          const result = await deleteRecordAction({
            tableName,
            idField,
            id,
            pathToRevalidate: "/admin/fornitori-prodotto",
          });

          if (result.success) {
            toast.success(result.message);
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
    <Button type="button" variant="destructive" size="icon" onClick={handleDelete}>
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}