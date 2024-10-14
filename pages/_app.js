import "../styles/globals.css";
import DefaultLayout from "../components/layouts/DefaultLayout";
import AnalyticsClientOnly from "../components/AnalyticsClientOnly"; // Import the client-only analytics component

function MyApp({ Component, pageProps }) {
  return (
    <DefaultLayout>
      {/* Add AnalyticsClientOnly here to initialize Firebase Analytics on the client side */}
      <AnalyticsClientOnly />
      <Component {...pageProps} />
    </DefaultLayout>
  );
}

export default MyApp;
