import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const display = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap"
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Santerra Negocios Inmobiliarios — Tu inversión, nuestro compromiso.",
  description:
    "Casas, departamentos, terrenos y propiedades comerciales en Paraguay. Encontrá el lugar ideal para vivir o invertir con Santerra.",
  keywords: [
    "inmobiliaria Paraguay",
    "Santerra",
    "casas Asunción",
    "departamentos",
    "terrenos",
    "inversión inmobiliaria"
  ],
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png" }],
    shortcut: "/favicon.png",
    apple: "/favicon.png"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${display.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
