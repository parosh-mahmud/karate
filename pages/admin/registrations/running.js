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

// --- ICONS for UI (re-used from the other page) ---
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

export default function RunningRegistrationsPage() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for controls
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // 'all', 'pending', 'confirmed'
  const [updatingId, setUpdatingId] = useState(null); // To show spinner on the specific button being updated

  // Use onSnapshot for real-time updates
  useEffect(() => {
    const q = query(
      collection(db, "running_registrations"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const regs = [];
        querySnapshot.forEach((doc) => {
          regs.push({ id: doc.id, ...doc.data() });
        });
        setRegistrations(regs);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching registrations:", err);
        setError(
          "Failed to load registrations. Please try refreshing the page."
        );
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Handle status update
  const handleUpdateStatus = async (id, currentStatus) => {
    setUpdatingId(id);
    const newStatus = currentStatus === "pending" ? "confirmed" : "pending";
    const regRef = doc(db, "running_registrations", id);
    try {
      await updateDoc(regRef, {
        status: newStatus,
      });
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  // Memoized filtering logic
  const filteredRegistrations = useMemo(() => {
    return registrations
      .filter((reg) => {
        if (filterStatus === "all") return true;
        // Handle cases where status might be undefined
        return (reg.status || "pending") === filterStatus;
      })
      .filter((reg) => {
        const search = searchTerm.toLowerCase();
        return (
          reg.name?.toLowerCase().includes(search) ||
          reg.phone?.toLowerCase().includes(search) ||
          reg.email?.toLowerCase().includes(search) ||
          reg.institution?.toLowerCase().includes(search) ||
          reg.transactionNumber?.toLowerCase().includes(search)
        );
      });
  }, [registrations, searchTerm, filterStatus]);

  // Handle CSV Export
  const handleExportCSV = () => {
    const headers = [
      "Name",
      "Age",
      "Occupation",
      "Institution",
      "T-Shirt Size",
      "Address",
      "Phone",
      "Email",
      "Payment Method",
      "Transaction Number",
      "Status",
      "Registration Date",
    ];
    const rows = filteredRegistrations.map((reg) =>
      [
        `"${reg.name || ""}"`,
        `"${reg.age || ""}"`,
        `"${reg.occupation || ""}"`,
        `"${reg.institution || ""}"`,
        `"${reg.tshirtSize || ""}"`,
        `"${(reg.address || "").replace(/"/g, '""')}"`,
        `"${reg.phone || ""}"`,
        `"${reg.email || ""}"`,
        `"${reg.paymentMethod || ""}"`,
        `"${reg.transactionNumber || ""}"`,
        `"${reg.status || "pending"}"`,
        `"${reg.createdAt ? reg.createdAt.toDate().toISOString() : ""}"`,
      ].join(",")
    );

    const csvContent =
      "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `running_seminar_registrations_${
        new Date().toISOString().split("T")[0]
      }.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-brandTextPrimary dark:text-brandBackground mb-4 font-header">
        Running Seminar Registrations
      </h1>
      <p className="text-brandTextSecondary dark:text-slate-400 mb-8">
        Manage all submitted registrations for the Running Seminar.
      </p>

      {/* Controls: Search and Filter */}
      <div className="mb-6 p-4 bg-white dark:bg-slate-800 rounded-lg shadow flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-grow w-full md:w-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder="Search by name, phone, email, TxID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-brandAccent focus:border-brandAccent dark:bg-slate-700"
          />
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex-shrink-0">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-slate-300 dark:border-slate-600 rounded-md focus:ring-brandAccent focus:border-brandAccent dark:bg-slate-700 py-2"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
            </select>
          </div>
          <button
            onClick={handleExportCSV}
            className="flex items-center justify-center px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition duration-300"
          >
            <ExportIcon />
            Export CSV
          </button>
        </div>
      </div>

      {/* Registration Table */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg overflow-x-auto">
        <div className="mb-4">
          <p className="text-brandTextSecondary font-semibold">
            Showing {filteredRegistrations.length} of {registrations.length}{" "}
            registrations
          </p>
        </div>
        {loading ? (
          <p>Loading registrations...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Participant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  T-Shirt
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Payment Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
              {filteredRegistrations.map((reg) => (
                <tr key={reg.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-brandTextPrimary dark:text-slate-200">
                      {reg.name} ({reg.age})
                    </div>
                    <div className="text-sm text-brandTextSecondary dark:text-slate-400">
                      {reg.institution}
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-brandTextPrimary dark:text-slate-300">
                    {reg.tshirtSize}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div>{reg.paymentMethod}</div>
                    <div className="text-brandTextSecondary dark:text-slate-400">
                      {reg.transactionNumber}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        (reg.status || "pending") === "confirmed"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                      }`}
                    >
                      {reg.status || "pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() =>
                        handleUpdateStatus(reg.id, reg.status || "pending")
                      }
                      disabled={updatingId === reg.id}
                      className={`px-3 py-1 rounded-md text-white font-semibold transition duration-300 w-36 text-center ${
                        updatingId === reg.id
                          ? "bg-gray-400 cursor-not-allowed"
                          : (reg.status || "pending") === "confirmed"
                          ? "bg-yellow-500 hover:bg-yellow-600"
                          : "bg-green-500 hover:bg-green-600"
                      }`}
                    >
                      {updatingId === reg.id
                        ? "Updating..."
                        : (reg.status || "pending") === "confirmed"
                        ? "Mark as Pending"
                        : "Mark as Confirmed"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {filteredRegistrations.length === 0 && !loading && (
          <div className="text-center py-8">
            <p className="text-brandTextSecondary">
              No registrations found that match your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Wrap this page in AdminLayout
RunningRegistrationsPage.getLayout = (page) => (
  <AdminLayout>{page}</AdminLayout>
);
