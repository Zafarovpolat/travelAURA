import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Travelio - Travel Agency Framer Template",
  description:
    "Путешествие без границ бюджета — личные наработки, база знаний и топ направлений для самостоятельных путешествий.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
