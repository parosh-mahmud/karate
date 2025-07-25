// // pages/admin/orders/index.js
// import React, { useState, useEffect } from "react";
// import Link from "next/link";
// import AdminLayout from "../../../components/admin/AdminLayout";
// // import { db } from "../../../utils/firebase";
// // import { collection, getDocs, query, orderBy } from "firebase/firestore";

// // Example icons
// const ViewIcon = () => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     fill="none"
//     viewBox="0 0 24 24"
//     strokeWidth={1.5}
//     stroke="currentColor"
//     className="w-5 h-5"
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
//     />
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
//     />
//   </svg>
// );

// // Placeholder order data
// const initialOrders = [
//   {
//     id: "ORD001",
//     customerName: "Jhon Doe",
//     email: "jhon@example.com",
//     date: new Date(2024, 4, 20).toISOString(),
//     status: "Processing",
//     total: 129.98,
//     items: 2,
//   },
//   {
//     id: "ORD002",
//     customerName: "Jane Smith",
//     email: "jane@example.com",
//     date: new Date(2024, 4, 22).toISOString(),
//     status: "Shipped",
//     total: 59.99,
//     items: 1,
//   },
//   {
//     id: "ORD003",
//     customerName: "Mike Lee",
//     email: "mike@example.com",
//     date: new Date(2024, 4, 23).toISOString(),
//     status: "Delivered",
//     total: 199.5,
//     items: 3,
//   },
//   {
//     id: "ORD004",
//     customerName: "Sara Kim",
//     email: "sara@example.com",
//     date: new Date(2024, 4, 25).toISOString(),
//     status: "Pending",
//     total: 85.0,
//     items: 1,
//   },
// ];

// const getStatusClass = (status) => {
//   switch (status.toLowerCase()) {
//     case "delivered":
//       return "bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100";
//     case "shipped":
//       return "bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-blue-100";
//     case "processing":
//       return "bg-yellow-100 text-yellow-700 dark:bg-yellow-700 dark:text-yellow-100";
//     case "pending":
//       return "bg-orange-100 text-orange-700 dark:bg-orange-700 dark:text-orange-100";
//     case "cancelled":
//       return "bg-red-100 text-red-700 dark:bg-red-700 dark:text-red-100";
//     default:
//       return "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-100";
//   }
// };

// export default function AdminOrdersPage() {
//   const [orders, setOrders] = useState(initialOrders); // Replace with actual data fetching
//   const [loading, setLoading] = useState(false);
//   const [filterStatus, setFilterStatus] = useState("All");

//   // useEffect(() => {
//   //   const fetchOrders = async () => {
//   //     setLoading(true);
//   //     try {
//   //       const ordersRef = collection(db, "orders");
//   //       const q = query(ordersRef, orderBy("createdAt", "desc")); // Assuming you have a createdAt field
//   //       const querySnapshot = await getDocs(q);
//   //       const ordersData = querySnapshot.docs.map(doc => ({
//   //         id: doc.id,
//   //         ...doc.data(),
//   //         // Ensure date is in a consistent format, e.g., toISOString() if it's a Firebase Timestamp
//   //         date: doc.data().createdAt?.toDate().toISOString() || new Date().toISOString(),
//   //       }));
//   //       setOrders(ordersData);
//   //     } catch (error) {
//   //       console.error("Error fetching orders: ", error);
//   //     }
//   //     setLoading(false);
//   //   };
//   //   fetchOrders();
//   // }, []);

//   const filteredOrders = orders.filter(
//     (order) =>
//       filterStatus === "All" ||
//       order.status.toLowerCase() === filterStatus.toLowerCase()
//   );

//   const tableHeaderStyle =
//     "px-5 py-3 border-b-2 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-left text-xs font-semibold text-brandTextSecondary dark:text-slate-300 uppercase tracking-wider font-sans";
//   const tableCellStyle =
//     "px-5 py-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-brandTextPrimary dark:text-slate-200 font-sans";
//   const actionButtonStyle =
//     "text-brandAccent hover:text-brandAccentHover transition-colors duration-200";

//   if (loading)
//     return (
//       <p className="text-center p-10 text-brandTextSecondary dark:text-slate-400">
//         Loading orders...
//       </p>
//     );

//   return (
//     <div className="font-sans">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold text-brandTextPrimary dark:text-brandBackground font-header">
//           Customer Orders
//         </h1>
//         {/* Add filter UI here if needed */}
//         <div>
//           <label
//             htmlFor="statusFilter"
//             className="mr-2 text-sm font-medium text-brandTextSecondary dark:text-slate-300"
//           >
//             Filter by status:
//           </label>
//           <select
//             id="statusFilter"
//             value={filterStatus}
//             onChange={(e) => setFilterStatus(e.target.value)}
//             className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-700 text-brandTextPrimary dark:text-slate-100 focus:ring-brandAccentFocus focus:border-brandAccentFocus text-sm"
//           >
//             <option value="All">All</option>
//             <option value="Pending">Pending</option>
//             <option value="Processing">Processing</option>
//             <option value="Shipped">Shipped</option>
//             <option value="Delivered">Delivered</option>
//             <option value="Cancelled">Cancelled</option>
//           </select>
//         </div>
//       </div>

//       <div className="overflow-x-auto bg-white dark:bg-slate-800 shadow-md rounded-lg">
//         <table className="min-w-full leading-normal">
//           <thead>
//             <tr>
//               <th className={tableHeaderStyle}>Order ID</th>
//               <th className={tableHeaderStyle}>Customer</th>
//               <th className={tableHeaderStyle}>Date</th>
//               <th className={tableHeaderStyle}>Status</th>
//               <th className={tableHeaderStyle}>Items</th>
//               <th className={tableHeaderStyle}>Total</th>
//               <th className={tableHeaderStyle}>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredOrders.length === 0 && !loading ? (
//               <tr>
//                 <td
//                   colSpan="7"
//                   className="text-center py-10 text-brandTextSecondary dark:text-slate-400"
//                 >
//                   No orders found{" "}
//                   {filterStatus !== "All"
//                     ? `with status "${filterStatus}"`
//                     : ""}
//                   .
//                 </td>
//               </tr>
//             ) : (
//               filteredOrders.map((order) => (
//                 <tr
//                   key={order.id}
//                   className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-150"
//                 >
//                   <td className={tableCellStyle}>
//                     <Link
//                       href={`/admin/orders/${order.id}`}
//                       className="text-brandAccent hover:underline"
//                     >
//                       {order.id}
//                     </Link>
//                   </td>
//                   <td className={tableCellStyle}>
//                     <p className="font-semibold">{order.customerName}</p>
//                     <p className="text-xs text-slate-500 dark:text-slate-400">
//                       {order.email}
//                     </p>
//                   </td>
//                   <td className={tableCellStyle}>
//                     {new Date(order.date).toLocaleDateString()}
//                   </td>
//                   <td className={tableCellStyle}>
//                     <span
//                       className={`px-2 py-1 font-semibold leading-tight rounded-full text-xs ${getStatusClass(
//                         order.status
//                       )}`}
//                     >
//                       {order.status}
//                     </span>
//                   </td>
//                   <td className={tableCellStyle}>{order.items}</td>
//                   <td className={tableCellStyle}>৳{order.total.toFixed(2)}</td>
//                   <td className={tableCellStyle}>
//                     <Link
//                       href={`/admin/orders/${order.id}`}
//                       className={actionButtonStyle}
//                       title="View Order"
//                     >
//                       <ViewIcon />
//                     </Link>
//                     {/* Add other actions like "Update Status" if needed */}
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//       {/* Add Pagination component here if you have many orders */}
//     </div>
//   );
// }

// AdminOrdersPage.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;

// pages/admin/orders/index.js
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import AdminLayout from "../../../components/admin/AdminLayout";
// Icons (keep as they are)
const ViewIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);
const RefreshIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5 mr-2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
    />
  </svg>
);

const getStatusClass = (status = "") => {
  // Added default for status
  switch (status.toLowerCase()) {
    case "delivered":
      return "bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100";
    case "shipped":
      return "bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-blue-100";
    case "processing":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-700 dark:text-yellow-100";
    case "pending":
      return "bg-orange-100 text-orange-700 dark:bg-orange-700 dark:text-orange-100";
    case "cancelled":
      return "bg-red-100 text-red-700 dark:bg-red-700 dark:text-red-100";
    default:
      return "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-100";
  }
};
const EditIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
    />
  </svg>
);

// Add this status update modal component
const StatusUpdateModal = ({
  isOpen,
  onClose,
  onUpdate,
  orderId,
  currentStatus,
}) => {
  const [newStatus, setNewStatus] = useState(currentStatus);
  const [note, setNote] = useState("");
  const [updating, setUpdating] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg max-w-md w-full p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-brandTextPrimary dark:text-brandBackground mb-4">
          Update Order Status
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-brandTextSecondary dark:text-slate-300 mb-1">
              New Status
            </label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm p-2 bg-white dark:bg-slate-700 text-brandTextPrimary dark:text-slate-100"
            >
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-brandTextSecondary dark:text-slate-300 mb-1">
              Status Note
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note about this status update..."
              className="w-full border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm p-2 bg-white dark:bg-slate-700 text-brandTextPrimary dark:text-slate-100"
              rows="3"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-brandTextSecondary dark:text-slate-300 hover:text-brandTextPrimary dark:hover:text-slate-100"
            disabled={updating}
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              setUpdating(true);
              await onUpdate(orderId, newStatus, note);
              setUpdating(false);
              onClose();
            }}
            disabled={updating}
            className="px-4 py-2 bg-brandAccent hover:bg-brandAccentHover text-white rounded-lg text-sm font-medium transition-colors duration-200"
          >
            {updating ? "Updating..." : "Update Status"}
          </button>
        </div>
      </div>
    </div>
  );
};
export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  // Add these new state variables
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  // Add this new function to handle status updates
  const handleStatusUpdate = async (orderId, newStatus, note) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
          note: note,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      // Refresh orders after update
      await fetchOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
      setError(error.message);
    }
  };
  // Add this helper function at the top of your file
  const formatDate = (date) => {
    if (!date) return "N/A";
    try {
      if (typeof date === "object" && date._seconds) {
        // Handle Firestore Timestamp
        return new Date(date._seconds * 1000).toLocaleString();
      }
      return new Date(date).toLocaleString();
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Invalid Date";
    }
  };

  const actionsColumn = (order) => (
    <td className={`${tableCellStyle} whitespace-nowrap`}>
      <div className="flex items-center space-x-2">
        <Link
          href={`/admin/orders/${order.id}`}
          className={`${actionButtonStyle} p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg`}
          title="View Order Details"
        >
          <ViewIcon />
        </Link>
        <button
          onClick={() => {
            setSelectedOrder(order);
            setIsStatusModalOpen(true);
          }}
          className={`${actionButtonStyle} p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg`}
          title="Update Status"
        >
          <EditIcon />
        </button>
      </div>
    </td>
  );

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/orders"); // GET request by default
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(
          errData.error || errData.message || `API Error: ${response.status}`
        );
      }
      const data = await response.json();
      console.log("Fetched orders:", data);
      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err.message || "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filteredOrders = orders.filter(
    (order) =>
      filterStatus === "All" ||
      (order.orderStatus &&
        order.orderStatus.toLowerCase() === filterStatus.toLowerCase())
  );

  const tableHeaderStyle =
    "px-5 py-3 border-b-2 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-left text-xs font-semibold text-brandTextSecondary dark:text-slate-300 uppercase tracking-wider font-sans";
  const tableCellStyle =
    "px-5 py-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-brandTextPrimary dark:text-slate-200 font-sans align-middle";
  const actionButtonStyle =
    "text-brandAccent hover:text-brandAccentHover transition-colors duration-200";

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)] font-sans">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brandAccent"></div>
        <p className="ml-4 text-brandTextSecondary dark:text-slate-400">
          Loading orders...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-10 font-sans">
        <p className="text-red-500 dark:text-red-400 text-lg">{error}</p>
        <button
          onClick={fetchOrders}
          className="mt-4 flex items-center mx-auto bg-brandAccent hover:bg-brandAccentHover text-brandTextOnAccent font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-300"
        >
          <RefreshIcon /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="font-sans">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-brandTextPrimary dark:text-brandBackground font-header">
          Customer Orders
        </h1>
        <div className="flex items-center gap-4">
          <button
            onClick={fetchOrders}
            title="Refresh Order List"
            className="flex items-center bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-brandTextPrimary dark:text-slate-100 font-semibold py-2 px-3 rounded-lg shadow-sm transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-brandAccentFocus focus:ring-opacity-50 text-sm"
          >
            <RefreshIcon /> Refresh
          </button>
          <div>
            <label
              htmlFor="statusFilter"
              className="mr-2 text-sm font-medium text-brandTextSecondary dark:text-slate-300"
            >
              Filter:
            </label>
            <select
              id="statusFilter"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-700 text-brandTextPrimary dark:text-slate-100 focus:ring-brandAccentFocus focus:border-brandAccentFocus text-sm"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto bg-white dark:bg-slate-800 shadow-xl rounded-lg border border-slate-200 dark:border-slate-700">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className={tableHeaderStyle}>Order Info</th>
              <th className={tableHeaderStyle}>Customer</th>
              <th className={tableHeaderStyle}>Order Details</th>
              <th className={tableHeaderStyle}>Payment</th>
              <th className={tableHeaderStyle}>Status</th>
              <th className={tableHeaderStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-10 text-brandTextSecondary dark:text-slate-400"
                >
                  No orders found{" "}
                  {filterStatus !== "All"
                    ? `with status "${filterStatus}"`
                    : ""}
                  .
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-150"
                >
                  <td className={tableCellStyle}>
                    <div className="space-y-1">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-brandAccent hover:underline font-medium"
                      >
                        #{order.metadata?.orderNumber || "N/A"}
                      </Link>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </td>
                  //comments
                  <td className={tableCellStyle}>
                    <div className="space-y-1">
                      <p className="font-semibold">
                        {order.customerInfo?.name || "N/A"}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {order.customerInfo?.phone || "N/A"}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                        {order.customerInfo?.shippingAddress || "N/A"}
                      </p>
                    </div>
                  </td>
                  <td className={tableCellStyle}>
                    <div className="space-y-1">
                      <p className="font-medium">
                        {order.items?.length || 0} item(s)
                      </p>
                      <p className="text-sm">
                        Total: ৳
                        {order.orderSummary?.grandTotal?.toLocaleString() ||
                          "0"}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {order.orderSummary?.deliveryOption?.replace(
                          "-",
                          " "
                        ) || "N/A"}
                      </p>
                    </div>
                  </td>
                  <td className={tableCellStyle}>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        {order.paymentDetails?.method || "N/A"}
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-400">
                        Paid: ৳{order.paymentDetails?.deliveryChargePaid || "0"}
                      </p>
                      <p className="text-xs text-brandTextSecondary dark:text-slate-400">
                        Due: ৳{order.paymentDetails?.remainingAmount || "0"}
                      </p>
                    </div>
                  </td>
                  <td className={tableCellStyle}>
                    <div className="space-y-2">
                      <span
                        className={`px-2 py-1 font-semibold leading-tight rounded-full text-xs ${getStatusClass(
                          order.status?.current
                        )}`}
                      >
                        {order.status?.current || "N/A"}
                      </span>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Updated:{" "}
                        {new Date(order.status?.lastUpdated).toLocaleString()}
                      </p>
                    </div>
                  </td>
                  <td className={`${tableCellStyle} whitespace-nowrap`}>
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className={`${actionButtonStyle} p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg`}
                        title="View Order Details"
                      >
                        <ViewIcon />
                      </Link>
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsStatusModalOpen(true);
                        }}
                        className={`${actionButtonStyle} p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg`}
                        title="Update Status"
                      >
                        <EditIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <StatusUpdateModal
        isOpen={isStatusModalOpen}
        onClose={() => {
          setIsStatusModalOpen(false);
          setSelectedOrder(null);
        }}
        onUpdate={handleStatusUpdate}
        orderId={selectedOrder?.id}
        currentStatus={selectedOrder?.status?.current}
      />
      {/* TODO: Add Pagination component here if you have many orders */}
    </div>
  );
}

AdminOrdersPage.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
