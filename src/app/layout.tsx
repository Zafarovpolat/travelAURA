import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Travelio - Travel Agency Framer Template",
  description:
    "Путешествие без границ бюджета — личные наработки, база знаний и топ направлений для самостоятельных путешествий.",
};

// Runs before first paint: marks that JS is active so scroll-reveal content
// starts hidden (and then animates in). Without JS the content is visible by
// default — it can never get stuck invisible.
const JS_READY = "document.documentElement.classList.add('js')";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>
        <script dangerouslySetInnerHTML={{ __html: JS_READY }} />
        {children}
      </body>
    </html>
  );
}
