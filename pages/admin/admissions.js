// pages/admin/admissions.js
import React, { useState, useEffect, useRef } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { db } from "../../utils/firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { VisibilityOutlined } from "@mui/icons-material";

export default function AdmissionsPage() {
  const [admissions, setAdmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAdmission, setSelectedAdmission] = useState(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    const fetchAdmissions = async () => {
      setError(null);
      setIsLoading(true);
      try {
        const col = collection(db, "admissions");
        const snap = await getDocs(col);
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        if (isMounted.current) setAdmissions(list);
      } catch (e) {
        console.error(e);
        if (isMounted.current) setError("Failed to load admissions.");
      } finally {
        if (isMounted.current) setIsLoading(false);
      }
    };
    fetchAdmissions();
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleUpdateStatus = async (id, status) => {
    setError(null);
    try {
      const refDoc = doc(db, "admissions", id);
      await updateDoc(refDoc, { status });
      if (isMounted.current) {
        setAdmissions((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status } : a))
        );
      }
    } catch (e) {
      console.error(e);
      if (isMounted.current) setError(`Could not update ${id}.`);
    }
  };

  const openDetails = (admission) => setSelectedAdmission(admission);
  const closeDetails = () => setSelectedAdmission(null);

  return (
    <AdminLayout>
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-700 mb-5">
          Admissions Management
        </h1>

        {error && <p className="text-red-600 mb-3 text-sm">{error}</p>}

        {isLoading ? (
          <p className="text-gray-500">Loading admissions...</p>
        ) : admissions.length > 0 ? (
          <>
            {/* Table for md+ */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full bg-white border">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-2 px-4 border text-left text-xs font-medium text-gray-500 uppercase">
                      Student ID
                    </th>
                    <th className="py-2 px-4 border text-left text-xs font-medium text-gray-500 uppercase">
                      Name
                    </th>
                    <th className="py-2 px-4 border text-left text-xs font-medium text-gray-500 uppercase">
                      Email
                    </th>
                    <th className="py-2 px-4 border text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="py-2 px-4 border text-center text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {admissions.map((a) => (
                    <tr key={a.id} className="text-sm text-gray-700">
                      <td className="py-2 px-4 border whitespace-nowrap">
                        {a.studentId || "N/A"}
                      </td>
                      <td className="py-2 px-4 border whitespace-nowrap">
                        {a.fullName}
                      </td>
                      <td className="py-2 px-4 border whitespace-nowrap">
                        {a.email}
                      </td>
                      <td className="py-2 px-4 border whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            a.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : a.status === "declined"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {a.status}
                        </span>
                      </td>
                      <td className="py-2 px-4 border text-center">
                        <div className="flex justify-center gap-2 flex-wrap">
                          <button
                            onClick={() => handleUpdateStatus(a.id, "approved")}
                            disabled={a.status === "approved"}
                            className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 text-xs rounded-md disabled:opacity-50"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(a.id, "declined")}
                            disabled={a.status === "declined"}
                            className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 text-xs rounded-md disabled:opacity-50"
                          >
                            Decline
                          </button>
                          <button
                            onClick={() => openDetails(a)}
                            className="bg-brandAccent hover:bg-brandAccentHover text-brandTextOnAccent px-2 py-1 text-xs rounded-md"
                          >
                            <VisibilityOutlined fontSize="inherit" /> View
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
              {admissions.map((a) => (
                <div
                  key={a.id}
                  className="bg-white shadow-sm rounded-md p-4 border border-gray-200"
                >
                  <p className="text-sm mb-1">
                    <span className="font-semibold">Name:</span> {a.fullName}
                  </p>
                  <p className="text-sm mb-1">
                    <span className="font-semibold">Email:</span> {a.email}
                  </p>
                  <p className="text-sm mb-2">
                    <span className="font-semibold">Status:</span>{" "}
                    <span
                      className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        a.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : a.status === "declined"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {a.status}
                    </span>
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdateStatus(a.id, "approved")}
                      disabled={a.status === "approved"}
                      className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 text-xs rounded-md disabled:opacity-50"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(a.id, "declined")}
                      disabled={a.status === "declined"}
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 text-xs rounded-md disabled:opacity-50"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => openDetails(a)}
                      className="bg-brandAccent hover:bg-brandAccentHover text-brandTextOnAccent px-2 py-1 text-xs rounded-md"
                    >
                      <VisibilityOutlined fontSize="inherit" /> View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-gray-500">No admissions found.</p>
        )}

        {/* Details Modal */}
        {selectedAdmission && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg w-full max-w-lg p-6 relative">
              <button
                onClick={closeDetails}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
              <h2 className="text-xl font-semibold text-brandTextPrimary mb-4">
                Admission Details
              </h2>
              <div className="space-y-2 text-sm text-gray-700 dark:text-slate-200 font-body">
                <p>
                  <span className="font-semibold">Full Name:</span>{" "}
                  {selectedAdmission.fullName}
                </p>
                <p>
                  <span className="font-semibold">Father’s Name:</span>{" "}
                  {selectedAdmission.fatherName}
                </p>
                <p>
                  <span className="font-semibold">Mother’s Name:</span>{" "}
                  {selectedAdmission.motherName}
                </p>
                <p>
                  <span className="font-semibold">Mobile:</span>{" "}
                  {selectedAdmission.mobile}
                </p>
                <p>
                  <span className="font-semibold">Email:</span>{" "}
                  {selectedAdmission.email}
                </p>
                <p>
                  <span className="font-semibold">DOB:</span>{" "}
                  {selectedAdmission.dateOfBirth}
                </p>
                <p>
                  <span className="font-semibold">Gender:</span>{" "}
                  {selectedAdmission.gender}
                </p>
                <p>
                  <span className="font-semibold">Profession:</span>{" "}
                  {selectedAdmission.profession}
                </p>
                <p>
                  <span className="font-semibold">Blood Group:</span>{" "}
                  {selectedAdmission.bloodGroup}
                </p>
                <p>
                  <span className="font-semibold">Nationality:</span>{" "}
                  {selectedAdmission.nationality}
                </p>
                <p>
                  <span className="font-semibold">NID:</span>{" "}
                  {selectedAdmission.nid}
                </p>
                <p>
                  <span className="font-semibold">Religion:</span>{" "}
                  {selectedAdmission.religion}
                </p>
                <p>
                  <span className="font-semibold">Payment Method:</span>{" "}
                  {selectedAdmission.paymentMethod}
                </p>
                <p>
                  <span className="font-semibold">Transaction ID:</span>{" "}
                  {selectedAdmission.transactionId}
                </p>
                {selectedAdmission.picture && (
                  <div className="mt-4">
                    <span className="font-semibold">Picture:</span>
                    <img
                      src={selectedAdmission.picture}
                      alt="Applicant"
                      className="mt-2 w-32 h-32 object-cover rounded-md border border-gray-300 dark:border-slate-700"
                    />
                  </div>
                )}
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeDetails}
                  className="px-4 py-2 bg-brandAccent hover:bg-brandAccentHover text-brandTextOnAccent rounded-md"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
