// pages/admin/admissions.js
import React, { useState, useEffect, useRef } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { db } from "../../utils/firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

export default function AdmissionsPage() {
  const [admissions, setAdmissions] = useState([]);
  const [isLoadingAdmissions, setIsLoadingAdmissions] = useState(true);
  const [errorAdmissions, setErrorAdmissions] = useState(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    setErrorAdmissions(null);

    const fetchAdmissions = async () => {
      if (isMounted.current) setIsLoadingAdmissions(true);
      try {
        const admissionsCol = collection(db, "admissions");
        const admissionsSnapshot = await getDocs(admissionsCol);
        const admissionsList = admissionsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        if (isMounted.current) setAdmissions(admissionsList);
      } catch (error) {
        console.error("Error fetching admissions:", error);
        if (isMounted.current)
          setErrorAdmissions("Failed to load admissions data.");
      } finally {
        if (isMounted.current) setIsLoadingAdmissions(false);
      }
    };
    fetchAdmissions();

    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleUpdateStatus = async (admissionId, newStatus) => {
    setErrorAdmissions(null);
    try {
      const admissionDocRef = doc(db, "admissions", admissionId);
      await updateDoc(admissionDocRef, { status: newStatus });
      if (isMounted.current) {
        setAdmissions((prev) =>
          prev.map((ad) =>
            ad.id === admissionId ? { ...ad, status: newStatus } : ad
          )
        );
      }
    } catch (error) {
      console.error("Error updating admission status:", error);
      if (isMounted.current)
        setErrorAdmissions(`Failed to update status for ${admissionId}.`);
    }
  };

  return (
    <AdminLayout>
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-700 mb-5">
          Admissions Management
        </h1>

        {errorAdmissions && (
          <p className="text-red-600 mb-3 text-sm">{errorAdmissions}</p>
        )}

        {isLoadingAdmissions ? (
          <p className="text-gray-500">Loading admissions...</p>
        ) : admissions.length > 0 ? (
          <>
            {/* Reuse the Table and Cards JSX from your previous index.js here */}
            {/* Table for larger screens */}
            <div className="hidden md:block overflow-x-auto">
              {/* ... (Paste your Admissions Table JSX here) ... */}
              <table className="min-w-full bg-white border">
                {/* Table Head */}
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-2 px-4 border text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student ID
                    </th>
                    {/* ... other headers ... */}
                    <th className="py-2 px-4 border text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="py-2 px-4 border text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                {/* Table Body */}
                <tbody className="divide-y divide-gray-200">
                  {admissions.map((admission) => (
                    <tr key={admission.id} className="text-sm text-gray-700">
                      <td className="py-2 px-4 border whitespace-nowrap">
                        {admission.studentId || "N/A"}
                      </td>
                      {/* ... other cells ... */}
                      <td className="py-2 px-4 border whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            admission.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : admission.status === "declined"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {admission.status}
                        </span>
                      </td>
                      <td className="py-2 px-4 border text-center">
                        <div className="flex justify-center flex-wrap gap-2">
                          <button
                            onClick={() =>
                              handleUpdateStatus(admission.id, "approved")
                            }
                            disabled={admission.status === "approved"}
                            className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 text-xs rounded-md transition duration-150 ease-in-out disabled:opacity-50"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() =>
                              handleUpdateStatus(admission.id, "declined")
                            }
                            disabled={admission.status === "declined"}
                            className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 text-xs rounded-md transition duration-150 ease-in-out disabled:opacity-50"
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
            <div className="md:hidden space-y-4">
              {/* ... (Paste your Admissions Cards JSX here) ... */}
              {admissions.map((admission) => (
                <div
                  key={admission.id}
                  className="bg-white shadow-sm rounded-md p-4 border border-gray-200"
                >
                  {/* Card Content */}
                  <p className="text-sm mb-1">
                    <span className="font-semibold">Name:</span>{" "}
                    {admission.fullName}
                  </p>
                  {/* ... other details ... */}
                  <p className="text-sm mb-2">
                    <span className="font-semibold">Status:</span>
                    <span
                      className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        admission.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : admission.status === "declined"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {admission.status}
                    </span>
                  </p>
                  {/* Action Buttons */}
                  <div className="flex mt-2 gap-2">
                    <button
                      onClick={() =>
                        handleUpdateStatus(admission.id, "approved")
                      }
                      disabled={admission.status === "approved"}
                      className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 text-xs rounded-md transition duration-150 ease-in-out disabled:opacity-50"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() =>
                        handleUpdateStatus(admission.id, "declined")
                      }
                      disabled={admission.status === "declined"}
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 text-xs rounded-md transition duration-150 ease-in-out disabled:opacity-50"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          !isLoadingAdmissions && (
            <p className="text-gray-500">No admissions found.</p>
          )
        )}
      </div>
    </AdminLayout>
  );
}
