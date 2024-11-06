import { ThemeProvider } from "next-themes";
import "../css/tailwind.css";
import Layout from "../components/layout";
import { AuthProvider } from "../components/context/authContext";

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider attribute="class">
      <AuthProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default MyApp;
