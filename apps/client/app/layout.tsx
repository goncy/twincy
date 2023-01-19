import {Inter, Press_Start_2P} from "@next/font/google";

import ThemeProvider from "@/theme/provider";

interface Props {
  children: React.ReactNode;
}

// Declare fonts for usage
const inter = Inter({subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-inter"});
const pressStart2P = Press_Start_2P({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-press-start",
});

export default function RootLayout({children}: Props) {
  return (
    <html>
      <head />
      <body className={`${inter.variable} ${pressStart2P.variable}`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
