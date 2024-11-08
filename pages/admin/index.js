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
      <div className="p-4 sm:p-6">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

        {/* Write Blog Button */}
        <div className="mb-6">
          <Link href="/admin/blogs/create">
            <a className="inline-block bg-blue-500 text-white px-4 py-2 rounded-md">
              Write Blog
            </a>
          </Link>
        </div>

        {/* Admissions List */}
        {admissions.length > 0 ? (
          <>
            {/* Table for larger screens */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full bg-white border">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border">Student ID</th>
                    <th className="py-2 px-4 border">Name</th>
                    <th className="py-2 px-4 border">Email</th>
                    <th className="py-2 px-4 border">Payment Method</th>
                    <th className="py-2 px-4 border">Transaction ID</th>
                    <th className="py-2 px-4 border">Status</th>
                    <th className="py-2 px-4 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {admissions.map((admission) => (
                    <tr key={admission.id} className="text-center">
                      <td className="py-2 px-4 border">
                        {admission.studentId || "N/A"}
                      </td>
                      <td className="py-2 px-4 border">{admission.fullName}</td>
                      <td className="py-2 px-4 border">{admission.email}</td>
                      <td className="py-2 px-4 border">
                        {admission.paymentMethod}
                      </td>
                      <td className="py-2 px-4 border">
                        {admission.transactionId}
                      </td>
                      <td className="py-2 px-4 border">{admission.status}</td>
                      <td className="py-2 px-4 border">
                        <div className="flex justify-center flex-wrap gap-2">
                          <button
                            className="bg-green-500 text-white px-2 py-1 rounded-md"
                            onClick={() =>
                              handleUpdateStatus(admission.id, "approved")
                            }
                          >
                            Accept
                          </button>
                          <button
                            className="bg-red-500 text-white px-2 py-1 rounded-md"
                            onClick={() =>
                              handleUpdateStatus(admission.id, "declined")
                            }
                          >
                            Decline
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Cards for small screens */}
            <div className="md:hidden">
              {admissions.map((admission) => (
                <div
                  key={admission.id}
                  className="bg-white shadow-md rounded-md p-4 mb-4"
                >
                  <p>
                    <span className="font-semibold">Name:</span>{" "}
                    {admission.fullName}
                  </p>
                  <p>
                    <span className="font-semibold">Email:</span>{" "}
                    {admission.email}
                  </p>
                  <p>
                    <span className="font-semibold">Payment Method:</span>{" "}
                    {admission.paymentMethod}
                  </p>
                  <p>
                    <span className="font-semibold">Transaction ID:</span>{" "}
                    {admission.transactionId}
                  </p>
                  <p>
                    <span className="font-semibold">Status:</span>{" "}
                    {admission.status}
                  </p>
                  {/* Action Buttons */}
                  <div className="flex mt-2 gap-2">
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded-md"
                      onClick={() =>
                        handleUpdateStatus(admission.id, "approved")
                      }
                    >
                      Accept
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded-md"
                      onClick={() =>
                        handleUpdateStatus(admission.id, "declined")
                      }
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p>No admissions found.</p>
        )}
      </div>
    </AdminRoute>
  );
}
