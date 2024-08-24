import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";
import ConvexClientProvider from "@/components/providers/ConvexProvider";

const lato = Lato({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "Quicks",
  description: "Faster and no hassle app.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={lato.className}>
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}
