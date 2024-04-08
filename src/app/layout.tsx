import Head from "next/head";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import StoreProvider from "./storeProvider";
import App from "./appProvider";
import { ViewportLayout } from "next/dist/lib/metadata/types/extra-types";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nanni Clock",
  description: "Clock in your nanni's work and generate invoices easily",
  // msapplicationTileColor: "#3182ce",
  // themeColor: "#ffffff",
  icons: {
    icon: "/favicon-32x32.png",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: ViewportLayout = {
  themeColor: "#fff",
  width: "device-width",
  height: "device-height",
  initialScale: 1,
  maximumScale: 1,
  // minimumScale: 1,
  // viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#3182ce" />
      </Head>
      <body className={inter.className}>
        <StoreProvider>
          <App>{children}</App>
        </StoreProvider>
      </body>
    </html>
  );
}
