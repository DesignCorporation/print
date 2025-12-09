import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Print Design Corp",
  description: "Online Printing Services",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
