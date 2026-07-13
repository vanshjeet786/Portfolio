import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vanshjeet Singh // Product Engineer",
  description: "Product Engineer building AI products, interactive experiences, and scalable systems.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen technical-grid">
        {children}
      </body>
    </html>
  );
}
