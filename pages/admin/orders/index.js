// pages/admin/orders/index.js
import React, { useState, useEffect } from "react";
import Link from "next/link";
import AdminLayout from "../../../components/admin/AdminLayout";
// import { db } from "../../../utils/firebase";
// import { collection, getDocs, query, orderBy } from "firebase/firestore";

// Example icons
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

// Placeholder order data
const initialOrders = [
  {
    id: "ORD001",
    customerName: "Jhon Doe",
    email: "jhon@example.com",
    date: new Date(2024, 4, 20).toISOString(),
    status: "Processing",
    total: 129.98,
    items: 2,
  },
  {
    id: "ORD002",
    customerName: "Jane Smith",
    email: "jane@example.com",
    date: new Date(2024, 4, 22).toISOString(),
    status: "Shipped",
    total: 59.99,
    items: 1,
  },
  {
    id: "ORD003",
    customerName: "Mike Lee",
    email: "mike@example.com",
    date: new Date(2024, 4, 23).toISOString(),
    status: "Delivered",
    total: 199.5,
    items: 3,
  },
  {
    id: "ORD004",
    customerName: "Sara Kim",
    email: "sara@example.com",
    date: new Date(2024, 4, 25).toISOString(),
    status: "Pending",
    total: 85.0,
    items: 1,
  },
];

const getStatusClass = (status) => {
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

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState(initialOrders); // Replace with actual data fetching
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");

  // useEffect(() => {
  //   const fetchOrders = async () => {
  //     setLoading(true);
  //     try {
  //       const ordersRef = collection(db, "orders");
  //       const q = query(ordersRef, orderBy("createdAt", "desc")); // Assuming you have a createdAt field
  //       const querySnapshot = await getDocs(q);
  //       const ordersData = querySnapshot.docs.map(doc => ({
  //         id: doc.id,
  //         ...doc.data(),
  //         // Ensure date is in a consistent format, e.g., toISOString() if it's a Firebase Timestamp
  //         date: doc.data().createdAt?.toDate().toISOString() || new Date().toISOString(),
  //       }));
  //       setOrders(ordersData);
  //     } catch (error) {
  //       console.error("Error fetching orders: ", error);
  //     }
  //     setLoading(false);
  //   };
  //   fetchOrders();
  // }, []);

  const filteredOrders = orders.filter(
    (order) =>
      filterStatus === "All" ||
      order.status.toLowerCase() === filterStatus.toLowerCase()
  );

  const tableHeaderStyle =
    "px-5 py-3 border-b-2 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-left text-xs font-semibold text-brandTextSecondary dark:text-slate-300 uppercase tracking-wider font-sans";
  const tableCellStyle =
    "px-5 py-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-brandTextPrimary dark:text-slate-200 font-sans";
  const actionButtonStyle =
    "text-brandAccent hover:text-brandAccentHover transition-colors duration-200";

  if (loading)
    return (
      <p className="text-center p-10 text-brandTextSecondary dark:text-slate-400">
        Loading orders...
      </p>
    );

  return (
    <div className="font-sans">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-brandTextPrimary dark:text-brandBackground font-header">
          Customer Orders
        </h1>
        {/* Add filter UI here if needed */}
        <div>
          <label
            htmlFor="statusFilter"
            className="mr-2 text-sm font-medium text-brandTextSecondary dark:text-slate-300"
          >
            Filter by status:
          </label>
          <select
            id="statusFilter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-700 text-brandTextPrimary dark:text-slate-100 focus:ring-brandAccentFocus focus:border-brandAccentFocus text-sm"
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto bg-white dark:bg-slate-800 shadow-md rounded-lg">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className={tableHeaderStyle}>Order ID</th>
              <th className={tableHeaderStyle}>Customer</th>
              <th className={tableHeaderStyle}>Date</th>
              <th className={tableHeaderStyle}>Status</th>
              <th className={tableHeaderStyle}>Items</th>
              <th className={tableHeaderStyle}>Total</th>
              <th className={tableHeaderStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 && !loading ? (
              <tr>
                <td
                  colSpan="7"
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
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-brandAccent hover:underline"
                    >
                      {order.id}
                    </Link>
                  </td>
                  <td className={tableCellStyle}>
                    <p className="font-semibold">{order.customerName}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {order.email}
                    </p>
                  </td>
                  <td className={tableCellStyle}>
                    {new Date(order.date).toLocaleDateString()}
                  </td>
                  <td className={tableCellStyle}>
                    <span
                      className={`px-2 py-1 font-semibold leading-tight rounded-full text-xs ${getStatusClass(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className={tableCellStyle}>{order.items}</td>
                  <td className={tableCellStyle}>৳{order.total.toFixed(2)}</td>
                  <td className={tableCellStyle}>
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className={actionButtonStyle}
                      title="View Order"
                    >
                      <ViewIcon />
                    </Link>
                    {/* Add other actions like "Update Status" if needed */}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Add Pagination component here if you have many orders */}
    </div>
  );
}

AdminOrdersPage.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
