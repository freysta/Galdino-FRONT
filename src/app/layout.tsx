import type { Metadata } from "next";
import {
  ColorSchemeScript,
  mantineHtmlProps,
  MantineProvider,
} from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { QueryProvider } from "@/providers/QueryProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import theme from "./theme";
import "./globals.css";
import "@mantine/notifications/styles.css";

export const metadata: Metadata = {
  title: "Galdino - Sistema de Transporte",
  description: "Sistema de Transporte Universitário Galdino",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body className="antialiased">
        <MantineProvider theme={theme}>
          <AuthProvider>
            <QueryProvider>
              <Notifications />
              {children}
            </QueryProvider>
          </AuthProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
