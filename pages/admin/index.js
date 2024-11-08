// pages/admin/index.js
import AdminRoute from "../../components/adminroutes/adminRoutes";
import Link from "next/link";
import { useState, useEffect } from "react";
import { db } from "../../utils/firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { useRouter } from "next/router";

export default function AdminDashboard() {
  const [admissions, setAdmissions] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchAdmissions = async () => {
      try {
        const admissionsCol = collection(db, "admissions");
        const admissionsSnapshot = await getDocs(admissionsCol);
        const admissionsList = admissionsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAdmissions(admissionsList);
      } catch (error) {
        console.error("Error fetching admissions:", error);
      }
    };

    fetchAdmissions();
  }, []);

  const handleUpdateStatus = async (admissionId, newStatus) => {
    try {
      const admissionDocRef = doc(db, "admissions", admissionId);
      await updateDoc(admissionDocRef, { status: newStatus });
      setAdmissions((prevAdmissions) =>
        prevAdmissions.map((admission) =>
          admission.id === admissionId
            ? { ...admission, status: newStatus }
            : admission
        )
      );
    } catch (error) {
      console.error("Error updating admission status:", error);
    }
  };

  return (
    <AdminRoute>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

        {/* Add the Write Blog Button */}
        <div className="mb-6">
          <Link href="/admin/blogs/create">
            <a className="bg-blue-500 text-white px-4 py-2 rounded-md">
              Write Blog
            </a>
          </Link>
        </div>

        {/* Existing Admissions Table */}
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-2 border">Student ID</th>
              <th className="py-2 border">Name</th>
              <th className="py-2 border">Email</th>
              <th className="py-2 border">Status</th>
              <th className="py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {admissions.map((admission) => (
              <tr key={admission.id} className="text-center">
                <td className="py-2 border">{admission.studentId || "N/A"}</td>
                <td className="py-2 border">{admission.fullName}</td>
                <td className="py-2 border">{admission.email}</td>
                <td className="py-2 border">{admission.status}</td>
                <td className="py-2 border">
                  <button
                    className="bg-green-500 text-white px-2 py-1 rounded-md mr-2"
                    onClick={() => handleUpdateStatus(admission.id, "approved")}
                  >
                    Accept
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded-md"
                    onClick={() => handleUpdateStatus(admission.id, "declined")}
                  >
                    Decline
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminRoute>
  );
}
