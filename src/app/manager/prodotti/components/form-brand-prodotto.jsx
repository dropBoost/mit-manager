"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { Spinner } from "@/components/ui/spinner";

import { createBrandAction } from "../action/aggiuntaBrandAction";
import { checkBrandExistsAction } from "../action/checkBrandAction";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

const initialState = {
  success: false,
  message: "",
};

function SubmitButton({ disabled }) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending || disabled}
      className="w-full gap-2 md:w-auto"
    >
      {pending && <Spinner data-icon="inline-start" />}
      {pending ? "Inserimento..." : "Inserisci brand"}
    </Button>
  );
}

export function FormBrand() {
  const [state, formAction] = useActionState(createBrandAction, initialState);

  const [brand, setBrand] = useState("");
  const [checking, setChecking] = useState(false);
  const [exists, setExists] = useState(false);
  const [liveMessage, setLiveMessage] = useState("");

  useEffect(() => {
    const value = brand.trim();

    if (!value) {
      setExists(false);
      setLiveMessage("");
      return;
    }

    const timeout = setTimeout(async () => {
      setChecking(true);

      const result = await checkBrandExistsAction(value);

      setExists(result.exists);
      setLiveMessage(result.message);
      setChecking(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, [brand]);

  return (
    <Card>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="brand">
              Brand <span className="text-destructive">*</span>
            </Label>

            <Input
              id="brand"
              name="brand"
              required
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="Es. Barilla, Mutti, Coca-Cola..."
              className={exists ? "border-destructive" : ""}
            />

            {checking && (
              <p className="text-sm text-muted-foreground">
                Verifica in corso...
              </p>
            )}

            {exists && (
              <p className="text-sm text-destructive">{liveMessage}</p>
            )}

            {!exists && brand.trim() && !checking && (
              <p className="text-sm text-green-600">Brand disponibile.</p>
            )}
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
            <SubmitButton disabled={exists || checking} />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}