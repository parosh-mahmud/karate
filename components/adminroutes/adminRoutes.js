// components/AdminRoute.js
import { useAuth } from "..//../components/context/authContext";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function AdminRoute({ children }) {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user || role !== "admin") {
        router.push("/"); // Redirect to home or login page
      }
    }
  }, [user, role, loading]);

  if (loading || !user || role !== "admin") {
    return <p>Loading...</p>;
  }

  return children;
}
