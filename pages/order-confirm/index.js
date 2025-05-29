// pages/order-confirmation.js
import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
// Optional: If you want to fetch and display order details here
// import { db } from '../utils/firebase';
// import { doc, getDoc } from 'firebase/firestore';

const CheckCircleIcon = () => (
  <svg
    className="w-16 h-16 text-green-500 mx-auto mb-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    ></path>
  </svg>
);

export default function OrderConfirmationPage() {
  const router = useRouter();
  const { orderId } = router.query; // Get orderId from URL query parameter
  const [loading, setLoading] = useState(false); // If you decide to fetch order details
  const [orderDetails, setOrderDetails] = useState(null);
  const [error, setError] = useState(null);

  // Optional: Fetch order details to display a summary
  useEffect(() => {
    if (orderId) {
      // setLoading(true);
      // setError(null);
      // fetch(`/api/orders/${orderId}`) // You'd need to create this API endpoint
      //   .then(res => {
      //     if (!res.ok) throw new Error('Failed to fetch order details');
      //     return res.json();
      //   })
      //   .then(data => {
      //     setOrderDetails(data.order || data); // Adjust based on API response structure
      //   })
      //   .catch(err => {
      //     console.error("Error fetching order details:", err);
      //     setError(err.message);
      //   })
      //   .finally(() => setLoading(false));
    }
  }, [orderId]);

  return (
    <>
      <Head>
        <title>Order Confirmed - JK Combat Academy</title>
        <meta
          name="description"
          content="Your order has been successfully placed."
        />
      </Head>

      <div className="min-h-screen bg-brandBackground dark:bg-slate-900 flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
        <div className="bg-white dark:bg-slate-800 p-8 sm:p-10 md:p-12 rounded-xl shadow-2xl text-center max-w-lg w-full border border-slate-200 dark:border-slate-700">
          <CheckCircleIcon />
          <h1 className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400 font-header mb-3">
            Thank You for Your Order!
          </h1>
          <p className="text-brandTextSecondary dark:text-slate-300 mb-2">
            Your order has been placed successfully.
          </p>
          {orderId && (
            <p className="text-brandTextSecondary dark:text-slate-300 mb-6">
              Your Order ID is:{" "}
              <strong className="text-brandAccent dark:text-brandAccentFocus">
                {orderId}
              </strong>
            </p>
          )}
          <p className="text-sm text-brandTextMuted dark:text-slate-400 mb-6">
            We will contact you shortly to confirm the details and delivery. You
            can also track your order status in your account (if applicable).
          </p>

          {/* Optional: Display simple order summary if fetched */}
          {loading && (
            <p className="text-brandTextSecondary dark:text-slate-400 my-4">
              Loading order summary...
            </p>
          )}
          {error && (
            <p className="text-brandRed dark:text-red-400 my-4">
              Could not load order summary: {error}
            </p>
          )}
          {orderDetails && (
            <div className="my-6 p-4 border border-slate-200 dark:border-slate-700 rounded-md text-left text-sm">
              <h3 className="font-semibold text-brandTextPrimary dark:text-slate-100 mb-2">
                Order Summary:
              </h3>
              <p>
                <span className="font-medium">Customer:</span>{" "}
                {orderDetails.customerInfo?.name}
              </p>
              <p>
                <span className="font-medium">Total:</span> ৳
                {orderDetails.grandTotal?.toFixed(2)}
              </p>
              <p className="mt-2 text-xs">
                A confirmation email has been sent to you (if email was
                provided).
              </p>
            </div>
          )}

          <div className="mt-8 space-y-3 sm:space-y-0 sm:flex sm:flex-wrap sm:justify-center sm:gap-4">
            <Link
              href="/products"
              className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-brandTextOnAccent bg-brandAccent hover:bg-brandAccentHover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brandAccentFocus dark:focus:ring-offset-slate-900 transition-colors"
            >
              Continue Shopping
            </Link>
            <Link
              href="/my-orders" // Replace with your actual "My Orders" page if it exists
              className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-slate-300 dark:border-slate-600 text-base font-medium rounded-lg shadow-sm text-brandTextPrimary dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brandAccentFocus dark:focus:ring-offset-slate-900 transition-colors"
            >
              View My Orders
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
