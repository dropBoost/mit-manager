"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Spinner } from "@/components/ui/spinner";

import { updateBrandAction } from "../action/updateBrandAction";

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
      {pending ? "Aggiornamento..." : "Aggiorna brand"}
    </Button>
  );
}

export function FormUpdateBrand({ item }) {
  const [state, formAction] = useActionState(updateBrandAction, initialState);

  return (
    <Card>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <input type="hidden" name="old_brand" value={item?.brand || ""} />

          <div className="space-y-2">
            <Label htmlFor="brand">
              Brand <span className="text-destructive">*</span>
            </Label>

            <Input
              id="brand"
              name="brand"
              required
              defaultValue={item?.brand || ""}
            />
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