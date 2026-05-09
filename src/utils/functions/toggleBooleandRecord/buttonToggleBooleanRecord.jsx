"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Power } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleBooleanRecordAction } from "./toggleBooleanRecordAction";

export function ToggleBooleanRecordButton({
  tableName,
  idField = "id",
  id,
  booleanField,
  currentValue,
  pathToRevalidate = "/manager/fornitori-anagrafica",
}) {
  const [pending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      const result = await toggleBooleanRecordAction({
        tableName,
        idField,
        id,
        booleanField,
        currentValue,
        pathToRevalidate,
      });

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <Button
      type="button"
      variant={currentValue ? "default" : "secondary"}
      size="sm"
      disabled={pending}
      onClick={handleToggle}
      className="gap-2"
    >
      <Power className="h-4 w-4" />
      {currentValue ? "Attivo" : "Non attivo"}
    </Button>
  );
}