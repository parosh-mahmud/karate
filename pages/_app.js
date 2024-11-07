import { ThemeProvider } from "next-themes";
import "../css/tailwind.css";
import Layout from "../components/layout";
import { AuthProvider } from "../components/context/authContext";

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider attribute="class">
      <Layout>
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </Layout>
    </ThemeProvider>
  );
}

export default MyApp;
