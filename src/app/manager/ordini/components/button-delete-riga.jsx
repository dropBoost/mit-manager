"use client";

import { toast } from "sonner";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteRigaAction } from "../action/deleteRigaAction";
import { redirect } from "next/navigation";

export function ButtonDeleteRiga({ idRiga, statoEvasione, statoOrdine, pathToRevalidate }) {

  async function handleDelete() {

    toast("Eliminare Prodotto?", {
      description: "Questa azione non può essere annullata.",
      action: {
        label: "Elimina",
        onClick: async () => {

          const result = await deleteRigaAction({
            idRiga,
            statoEvasione,
            statoOrdine,
            pathToRevalidate
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
    <Button type="button" variant="ghost" size="icon" onClick={handleDelete} className={`text-red-900 hover:text-red-800 hover:bg-none!`}>
      <X className="h-3 w-3" />
    </Button>
  );
}