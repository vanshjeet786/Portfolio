import type { Metadata } from "next";
import "./globals.css";
import LenisProvider from "@/components/LenisProvider";
import Navigation from "@/components/Navigation";
import CustomCursor from "@/components/CustomCursor";

export const metadata: Metadata = {
  title: "Vanshjeet Singh | Product Engineer",
  description: "I build products. An interactive engineering narrative.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <LenisProvider>
          <CustomCursor />
          <Navigation />
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
