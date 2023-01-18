import {Inter, Press_Start_2P} from "@next/font/google";

import Providers from "./providers";

interface Props {
  children: React.ReactNode;
}

// Declare fonts for usage
const inter = Inter({subsets: ["latin"], weight: ["400", "500", "700"]});
const pressStart2P = Press_Start_2P({
  subsets: ["latin"],
  weight: "400",
});

export default function RootLayout({children}: Props) {
  return (
    <html>
      <head />
      <body className={`${inter.className} ${pressStart2P.className}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
