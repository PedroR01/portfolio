import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "El blog de Pep",
  description:
    "En esta sección encontrarás mis pensamientos, experiencias y aprendizajes relacionados con el desarrollo web, la tecnología y el diseño. Mi objetivo es compartir conocimientos, inspirar a otros y fomentar una comunidad de aprendizaje en torno a estos temas. ¡Espero que disfrutes leyendo mis artículos tanto como yo disfruto escribiéndolos!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
