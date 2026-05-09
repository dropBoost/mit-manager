"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Spinner } from "@/components/ui/spinner";

import { updateCorriereAction } from "../action/updateCorriereAction";

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
      {pending ? "Aggiornamento..." : "Aggiorna corriere"}
    </Button>
  );
}

function Field({
  name,
  label,
  required = false,
  type = "text",
  colspan = "",
  defaultValue = "",
}) {
  return (
    <div className={`space-y-2 ${colspan}`}>
      <Label htmlFor={name}>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>

      <Input
        id={name}
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue || ""}
      />
    </div>
  );
}

function DisabledField({ label, value, colspan = "" }) {
  return (
    <div className={`space-y-2 ${colspan}`}>
      <Label>{label}</Label>
      <Input value={value || ""} disabled />
    </div>
  );
}

export function FormUpdateCorriere({ corriere }) {
  const [state, formAction] = useActionState(
    updateCorriereAction,
    initialState
  );

  return (
    <Card>
      <CardContent>
        <form action={formAction} className="space-y-8">
          <input type="hidden" name="cod" value={corriere?.cod || ""} />

          <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
            <DisabledField
              label="Codice corriere"
              value={corriere?.cod}
              colspan="md:col-span-3"
            />

            <Field
              name="nome_corriere"
              label="Nome corriere"
              defaultValue={corriere?.nome_corriere}
              colspan="md:col-span-5"
            />

            <Field
              name="email"
              label="Email"
              type="email"
              defaultValue={corriere?.email}
              colspan="md:col-span-4"
            />

            <Field
              name="riferimento"
              label="Riferimento"
              defaultValue={corriere?.riferimento}
              colspan="md:col-span-4"
            />

            <Field
              name="mobile"
              label="Mobile"
              defaultValue={corriere?.mobile}
              colspan="md:col-span-4"
            />

            <Field
              name="tel"
              label="Telefono"
              defaultValue={corriere?.tel}
              colspan="md:col-span-4"
            />

            <Field
              name="link_tracking"
              label="Link tracking"
              defaultValue={corriere?.link_tracking}
              colspan="md:col-span-12"
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