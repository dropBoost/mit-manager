"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Spinner } from "@/components/ui/spinner";

import { updatePrezziRecordAction } from "../action/updatePrezziRecordAction";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

const initialState = {
  success: false,
  message: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full gap-2 md:w-auto">
      {pending && <Spinner data-icon="inline-start" />}
      {pending ? "Aggiornamento..." : "Aggiorna prezzi"}
    </Button>
  );
}

export function FormUpdatePrezziRecord({
  tableName,
  idField = "id",
  id,
  prezzoRiferimento,
  prezzoVendita,
  pathToRevalidate = "/manager/listini",
}) {
  const [state, formAction] = useActionState(
    updatePrezziRecordAction,
    initialState
  );

  return (
    <Card>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <input type="hidden" name="tableName" value={tableName} />
          <input type="hidden" name="idField" value={idField} />
          <input type="hidden" name="id" value={id} />
          <input
            type="hidden"
            name="pathToRevalidate"
            value={pathToRevalidate}
          />

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="prezzo_riferimento">
                Prezzo riferimento <span className="text-destructive">*</span>
              </Label>

              <Input
                id="prezzo_riferimento"
                name="prezzo_riferimento"
                type="number"
                step="0.01"
                min="0"
                required
                defaultValue={prezzoRiferimento || 0}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="prezzo_vendita">
                Prezzo vendita <span className="text-destructive">*</span>
              </Label>

              <Input
                id="prezzo_vendita"
                name="prezzo_vendita"
                type="number"
                step="0.01"
                min="0"
                required
                defaultValue={prezzoVendita || 0}
              />
            </div>
          </div>

          {state?.message && (
            <div
              className={cn(
                "rounded-md border p-4 text-sm",
                state.success
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-destructive/30 bg-destructive/10 text-destructive"
              )}
            >
              {state.message}
            </div>
          )}

          <div className="flex justify-end">
            <SubmitButton />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}