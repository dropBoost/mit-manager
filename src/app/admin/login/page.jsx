"use client"

import { LoginForm } from "@/components/login-form"
import { ToggleDarkMode } from "@/components/ui/toggle-dark-mode";
import { GalleryVerticalEndIcon } from "lucide-react"
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10 bg-primary">
        <div className="flex justify-center gap-2 md:justify-start">
          <ToggleDarkMode/>
          <a href="#" className="flex items-center gap-2 font-bold text-primary-foreground">
            MIT | Michele in The World
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center ">
          <div className="w-full max-w-sm bg-background p-10 rounded-2xl">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative lg:flex hidden min-h-screen items-center justify-center overflow-hidden ">
        <div className="absolute inset-0 bg-cover bg-center brightness-30 grayscale-25 dark:brightness-20 bg-primary" style={{ backgroundImage: "url('/mitjapan2.jpg')" }}/>
        <div className="relative z-10">
          <Image
            src="/logo.png"
            alt="Logo"
            width={200}
            height={200}
            priority
          />
        </div>
      </div>
    </div>
  );
}
