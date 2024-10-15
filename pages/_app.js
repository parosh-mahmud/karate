import "../styles/globals.css";
import DefaultLayout from "../components/layouts/DefaultLayout";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "../lib/fontawesome";

function MyApp({ Component, pageProps }) {
  return (
    <DefaultLayout>
      {/* Add AnalyticsClientOnly here to initialize Firebase Analytics on the client side */}

      <Component {...pageProps} />
    </DefaultLayout>
  );
}

export default MyApp;
