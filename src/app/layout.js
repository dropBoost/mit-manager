import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  variable: "--inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "MIT-MANAGER / Order Management",
  description: "Sviluppato da dropboost.it",
};

export default function RootLayout({ children }) {
  return (
    <html lang="it" suppressHydrationWarning className={`${inter.variable} h-full antialiased bg-background`}>
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
