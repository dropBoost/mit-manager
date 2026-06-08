"use client";

import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteEvasioneAction } from "../action/deleteEvasioneAction";
import { redirect } from "next/navigation";

export function ButtonDeleteEvasione({ idSpedizione, idRiga }) {

  async function handleDelete() {

    toast("Annullare evasione?", {
      description: "Questa azione non può essere annullata.",
      action: {
        label: "Elimina",
        onClick: async () => {

          const result = await deleteEvasioneAction({
            idSpedizione,
            idRiga,
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
      <Trash2 className="h-3 w-3" />
    </Button>
  );
}