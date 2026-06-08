"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Power } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleStatoOrdineAction } from "../action/toggleStatoOrdineAction";

export function ToggleStatoOrdine({
  tableName,
  idField = "id",
  id,
  updateField,
  currentValue,
  iconTrue = <Power className="h-4 w-4" />,
  iconFalse = <Power className="h-4 w-4" />,
  label = "Attivo",
  pathToRevalidate = "/manager/fornitori-anagrafica",
  setUpdate,
  righeEvase,
  righeOrdine
}) {

  const [pending, startTransition] = useTransition();

  function handleToggle() {

    startTransition(async () => {

      const result = await toggleStatoOrdineAction({
        tableName,
        idField,
        id,
        updateField,
        currentValue,
        pathToRevalidate,
        righeEvase,
        righeOrdine
      });

      if (result.success) {
        setUpdate(count => count+1)
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  }

  const icon = currentValue !== "CPL" ? iconFalse : iconTrue
  let colorBg = "secondary"

  if (currentValue == "LVR") {
    colorBg = "destructive"
  } else if (currentValue == "CPL") {
    colorBg = "default"
  }

  return (
    <Button type="button" variant={colorBg}
      size="sm"
      disabled={pending}
      onClick={handleToggle}
      className="gap-2"
    >
      {icon} {label}
    </Button>
  );
}