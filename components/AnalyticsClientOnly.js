// components/AnalyticsClientOnly.js
import { useEffect } from "react";

const AnalyticsClientOnly = () => {
  useEffect(() => {
    const initAnalytics = async () => {
      if (typeof window !== "undefined") {
        const { getAnalytics, isSupported } = await import(
          "firebase/analytics"
        );
        const { app } = await import("../firebase");

        const supported = await isSupported();
        if (supported) {
          getAnalytics(app);
        } else {
          console.warn(
            "Firebase Analytics is not supported in this environment."
          );
        }
      }
    };

    initAnalytics();
  }, []);

  return null;
};

export default AnalyticsClientOnly;
