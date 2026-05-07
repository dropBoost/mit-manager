// src/app/admin/signup/components/signup-gate.jsx
"use client";

import { useState } from "react";
import { SignupForm } from "./signup-form";
import { checkSuperAdminPassword } from "../action/checkSuperAdminPassword";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SignupGate() {
  
  const [allowed, setAllowed] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(formData) {
    setError("");

    const result = await checkSuperAdminPassword(formData);

    if (!result.success) {
      setError(result.message);
      return;
    }

    setAllowed(true);
  }

  return (
    <>
      {!allowed && (
        <Dialog open={true}>
          <DialogContent
            showCloseButton={false}
            onInteractOutside={(e) => e.preventDefault()}
            onEscapeKeyDown={(e) => e.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle>Accesso riservato</DialogTitle>
              <DialogDescription>
                Inserisci la password super admin per continuare.
              </DialogDescription>
            </DialogHeader>

            <form action={handleSubmit} className="space-y-4">
              <Input
                name="password"
                type="password"
                placeholder="Password"
                required
              />

              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}

              <Button type="submit" className="w-full">
                Accedi
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {allowed && <SignupForm />}
    </>
  );
}