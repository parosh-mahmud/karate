// pages/admin/registrations/fitness.js
import { useState, useEffect, useMemo } from "react";
import AdminLayout from "../../../components/admin/AdminLayout";
import { db } from "../../../lib/firebase";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  updateDoc,
} from "firebase/firestore";

// --- ICONS ---
const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);
const ExportIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-2"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);
const XIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

// ## NEW ## - Details Modal Component
const DetailsModal = ({ registration, onClose }) => {
  if (!registration) return null;

  const DetailItem = ({ label, value }) => (
    <div className="py-2">
      <p className="text-xs font-semibold text-gray-500 uppercase">{label}</p>
      <p className="text-md text-gray-800 dark:text-gray-200">
        {value || "N/A"}
      </p>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl max-w-2xl w-full">
        <div className="flex justify-between items-center p-4 border-b dark:border-slate-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Registration Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700"
          >
            <XIcon />
          </button>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
          <DetailItem
            label="Reg. Number"
            value={`#${registration.registrationNumber}`}
          />
          <DetailItem label="Name" value={registration.name} />
          <DetailItem label="Department" value={registration.department} />
          <DetailItem label="Phone" value={registration.phone} />
          <DetailItem label="Email" value={registration.email} />
          <DetailItem label="Status" value={registration.status} />
          <div className="lg:col-span-3">
            <DetailItem label="Question" value={registration.question} />
          </div>
          <div className="lg:col-span-3">
            <DetailItem
              label="Additional Comments"
              value={registration.complement}
            />
          </div>
          <hr className="lg:col-span-3 my-2 dark:border-slate-700" />
          <DetailItem
            label="Payment Method"
            value={registration.paymentMethod}
          />
          <DetailItem
            label="Transaction ID"
            value={registration.transactionId}
          />
        </div>
      </div>
    </div>
  );
};

export default function FitnessRegistrationsPage() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [updatingId, setUpdatingId] = useState(null);

  // ## NEW ## - State for the details modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReg, setSelectedReg] = useState(null);

  useEffect(() => {
    const q = query(
      collection(db, "fitness_registrations"),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setRegistrations(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
        setLoading(false);
      },
      (err) => {
        setError("Failed to load registrations.");
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // ## MODIFIED ## - handleUpdateStatus now sends email with registration number
  const handleUpdateStatus = async (registration) => {
    setUpdatingId(registration.id);
    const currentStatus = registration.status || "pending";
    const newStatus = currentStatus === "pending" ? "confirmed" : "pending";
    const regRef = doc(db, "fitness_registrations", registration.id);

    try {
      await updateDoc(regRef, { status: newStatus });
      if (newStatus === "confirmed") {
        if (
          !registration.name ||
          !registration.email ||
          !registration.registrationNumber
        ) {
          alert(
            `Warning: Registration confirmed, but email could not be sent because contact details are incomplete.`
          );
          setUpdatingId(null);
          return;
        }
        await fetch("/api/notify/fitness-confirmation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: registration.name,
            email: registration.email,
            registrationNumber: registration.registrationNumber,
          }),
        });
      }
    } catch (err) {
      alert("Failed to update status.");
    } finally {
      setUpdatingId(null);
    }
  };

  // ## NEW ## - Function to open the details modal
  const handleViewDetails = (registration) => {
    setSelectedReg(registration);
    setIsModalOpen(true);
  };

  const filteredRegistrations = useMemo(() => {
    return registrations
      .filter((reg) =>
        filterStatus === "all"
          ? true
          : (reg.status || "pending") === filterStatus
      )
      .filter((reg) => {
        const search = searchTerm.toLowerCase();
        return (
          reg.name?.toLowerCase().includes(search) ||
          reg.phone?.toLowerCase().includes(search) ||
          reg.email?.toLowerCase().includes(search) ||
          reg.transactionId?.toLowerCase().includes(search) ||
          reg.registrationNumber?.toString().includes(search) // Search by Reg No.
        );
      });
  }, [registrations, searchTerm, filterStatus]);

  const handleExportCSV = () => {
    const headers = [
      "Reg. No",
      "Name",
      "Department",
      "Phone",
      "Email",
      "Question",
      "Complement",
      "Payment Method",
      "TrxID",
      "Status",
      "Date",
    ];
    const rows = filteredRegistrations.map((reg) =>
      [
        `"${reg.registrationNumber || "N/A"}"`,
        `"${reg.name || ""}"`,
        `"${reg.department || ""}"`,
        `"${reg.phone || ""}"`,
        `"${reg.email || ""}"`,
        `"${(reg.question || "").replace(/"/g, '""')}"`,
        `"${(reg.complement || "").replace(/"/g, '""')}"`,
        `"${reg.paymentMethod || ""}"`,
        `"${reg.transactionId || ""}"`,
        `"${reg.status || "pending"}"`,
        `"${reg.createdAt ? reg.createdAt.toDate().toISOString() : ""}"`,
      ].join(",")
    );
    const csvContent =
      "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute(
      "download",
      `fitness_registrations_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-brandTextPrimary dark:text-brandBackground mb-4 font-header">
        Fitness Seminar Registrations
      </h1>
      <p className="text-brandTextSecondary dark:text-slate-400 mb-8">
        Manage all submitted registrations.
      </p>

      <div className="mb-6 p-4 bg-white dark:bg-slate-800 rounded-lg shadow flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-grow w-full md:w-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder="Search by name, email, Reg No..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-brandAccent dark:bg-slate-700"
          />
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-slate-300 dark:border-slate-600 rounded-md focus:ring-brandAccent py-2 dark:bg-slate-700"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
          </select>
          <button
            onClick={handleExportCSV}
            className="flex items-center justify-center px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition"
          >
            <ExportIcon /> Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg overflow-x-auto">
        <div className="mb-4">
          <p className="text-brandTextSecondary font-semibold">
            Showing {filteredRegistrations.length} of {registrations.length}{" "}
            registrations
          </p>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                  Reg. #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                  Participant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
              {filteredRegistrations.map((reg) => (
                <tr key={reg.id}>
                  <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-600 dark:text-slate-300">
                    #{reg.registrationNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-brandTextPrimary dark:text-slate-200">
                      {reg.name}
                    </div>
                    <div className="text-sm text-brandTextSecondary dark:text-slate-400">
                      {reg.department}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-brandTextSecondary dark:text-slate-400">
                      {reg.phone}
                    </div>
                    <div className="text-sm text-brandTextSecondary dark:text-slate-500">
                      {reg.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${(reg.status || "pending") === "confirmed" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"}`}
                    >
                      {reg.status || "pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2 flex">
                    <button
                      onClick={() => handleViewDetails(reg)}
                      className="px-3 py-1 rounded-md text-white font-semibold bg-blue-500 hover:bg-blue-600 transition"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(reg)}
                      disabled={updatingId === reg.id}
                      className={`px-3 py-1 rounded-md text-white font-semibold transition w-32 text-center ${updatingId === reg.id ? "bg-gray-400 cursor-not-allowed" : (reg.status || "pending") === "confirmed" ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-500 hover:bg-green-600"}`}
                    >
                      {updatingId === reg.id
                        ? "Updating..."
                        : (reg.status || "pending") === "confirmed"
                          ? "Set Pending"
                          : "Confirm"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {isModalOpen && (
        <DetailsModal
          registration={selectedReg}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

FitnessRegistrationsPage.getLayout = (page) => (
  <AdminLayout>{page}</AdminLayout>
);
