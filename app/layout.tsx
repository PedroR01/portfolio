import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "sonner";

const clashDisplay = localFont({
  src: "../public/fonts/clash-display/ClashDisplay-Semibold.woff2",
  variable: "--font-clash-display",
});

const archivo = localFont({
  src: [
    {
      path: "../public/fonts/archivo/Archivo-Light.woff2",
      weight: "300",
    },
    {
      path: "../public/fonts/archivo/Archivo-Regular.woff2",
      weight: "400",
    },
    {
      path: "../public/fonts/archivo/Archivo-SemiBold.woff2",
      weight: "600",
    },
  ],
  variable: "--font-archivo",
});

export const metadata: Metadata = {
  title: "Portfolio - Soy Pep",
  description:
    "¡Bienvenido! Soy Pedro, mirá tranquilo/a mi portfolio y si te gusta algo de lo que ves, no dudes en contactarme.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${clashDisplay.variable} ${archivo.variable} antialiased`}
      >
        {children}
        <Toaster position="bottom-right" richColors theme="dark" />
      </body>
    </html>
  );
}
