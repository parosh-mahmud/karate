import "../styles/globals.css";
import DefaultLayout from "../components/layouts/DefaultLayout";

function MyApp({ Component, pageProps }) {
  return (
    <DefaultLayout>
      {/* Add AnalyticsClientOnly here to initialize Firebase Analytics on the client side */}

      <Component {...pageProps} />
    </DefaultLayout>
  );
}

export default MyApp;
