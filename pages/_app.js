// pages/_app.js
import { ThemeProvider } from "next-themes";
import "../css/tailwind.css";
import dynamic from "next/dynamic";
import Layout from "../components/layout"; // Default layout
import { CartProvider } from "../components/context/CartContext";

// 1. Import fonts from next/font
import { Inter, Poppins, Lato, Montserrat } from "next/font/google";

// 2. Configure fonts with CSS variables
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});
const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-lato",
  display: "swap",
});
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-montserrat",
  display: "swap",
});

// 3. Dynamically import AuthProvider with SSR disabled
const AuthProvider = dynamic(
  () =>
    import("../components/context/AuthContext").then((mod) => mod.AuthProvider),
  { ssr: false }
);

function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => <Layout>{page}</Layout>);
  const fontVariables = `${inter.variable} ${poppins.variable} ${lato.variable} ${montserrat.variable}`;

  return (
    <div className={fontVariables}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <CartProvider>
          {/* AuthProvider now only renders on the client */}
          <AuthProvider>{getLayout(<Component {...pageProps} />)}</AuthProvider>
        </CartProvider>
      </ThemeProvider>
    </div>
  );
}

export default MyApp;
