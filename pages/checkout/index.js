// pages/checkout.js
import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCartState, useCartDispatch } from "@/context/CartContext.js"; // Adjust path if needed
import {
  getFirestore,
  doc,
  collection,
  writeBatch,
  getDoc,
  increment,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/utils/firebase";
// import { serverTimestamp, increment } from "firebase/firestore";
import Image from "next/image";
// Example Icons (replace with actual SVGs or an icon library like Heroicons if preferred)
const UserIcon = () => (
  <svg
    className="w-5 h-5 mr-2 inline text-brandTextSecondary dark:text-slate-400"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
  </svg>
);
const PhoneIcon = () => (
  <svg
    className="w-5 h-5 mr-2 inline text-brandTextSecondary dark:text-slate-400"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.308 1.155a11.034 11.034 0 005.656 5.656l1.155-2.308a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
  </svg>
);
const AddressIcon = () => (
  <svg
    className="w-5 h-5 mr-2 inline text-brandTextSecondary dark:text-slate-400"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
    <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
  </svg>
);
const BkashIcon = () => (
  // Simple bKash-like icon
  <svg
    className="w-8 h-8 inline mr-2 text-pink-600"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.47 13.01c-.3.3-.77.3-1.07 0l-3.04-3.04c-.71-.71-1.17-1.28-1.17-2.02 0-.9.72-1.62 1.62-1.62.51 0 .97.23 1.29.6l.65-1.03c-.52-.61-1.27-1-2.1-1-.33 0-.65.05-.96.14C8.7 8.29 7.85 9.29 7.85 10.7c0 1.21.63 2.25 1.58 2.91l3.08 3.08c.3.3.77.3 1.07 0l1.89-1.89-1.01-1.01-1.09 1.1z" />
  </svg>
);

export default function CheckoutPage() {
  const router = useRouter();

  // const { currentUser } = useAuth(); // Optional: For pre-filling form
  const cart = useCartState();
  const cartItems = cart.items || [];
  const cartTotal = cart.total || 0;
  const dispatch = useCartDispatch();

  const [formData, setFormData] = useState({
    name: "", // currentUser?.displayName || "", // Pre-fill if user is logged in
    phone: "", // currentUser?.phoneNumber || "",
    shippingAddress: "",
    transactionId: "",
    deliveryOption: "inside-dhaka", // Default delivery option
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // Delivery charges - you can make this dynamic based on location or API
  const deliveryCharges = {
    "inside-dhaka": 60,
    "outside-dhaka": 120,
  };
  const currentDeliveryCharge = deliveryCharges[formData.deliveryOption];
  const orderTotal = cartTotal + currentDeliveryCharge;

  useEffect(() => {
    // Redirect to products page if cart is empty
    if (cartItems.length === 0 && !isSubmitting) {
      // Check isSubmitting to prevent redirect during submission
      router.replace("/products?message=cart_empty");
    }
  }, [cartItems, router, isSubmitting]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formError) setFormError(""); // Clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setIsSubmitting(true);

    try {
      // Validation checks
      if (
        !formData.name ||
        !formData.phone ||
        !formData.shippingAddress ||
        !formData.transactionId
      ) {
        throw new Error("Please fill in all required fields.");
      }

      if (!/^(?:\+?88)?01[3-9]\d{8}$/.test(formData.phone)) {
        throw new Error("Please enter a valid Bangladeshi phone number.");
      }

      if (formData.transactionId.length < 6) {
        throw new Error("Please enter a valid bKash Transaction ID");
      }

      // Prepare order data
      const orderData = {
        customerInfo: {
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          shippingAddress: formData.shippingAddress.trim(),
        },
        items: cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.mainImage || item.image,
          sku: item.sku,
        })),
        paymentDetails: {
          method: "bKash",
          status: "Delivery Charge Paid",
          bKashNumber: "01766283131",
          transactionId: formData.transactionId.trim(),
          deliveryChargePaid: currentDeliveryCharge,
          remainingAmount: cartTotal,
        },
        orderSummary: {
          subTotal: cartTotal,
          deliveryCharge: currentDeliveryCharge,
          grandTotal: cartTotal + currentDeliveryCharge,
          deliveryOption: formData.deliveryOption,
        },
        status: {
          current: "Pending",
          lastUpdated: new Date().toISOString(),
          statusHistory: [
            {
              status: "Pending",
              timestamp: new Date().toISOString(),
              note: "Order placed",
            },
          ],
        },
        metadata: {
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          platform: "web",
          orderNumber: `JK${Date.now()}`,
        },
      };

      // Create new order reference
      const orderRef = doc(collection(db, "orders"));

      // Add the ID to the order data
      orderData.id = orderRef.id;

      // Start batch write
      const batch = writeBatch(db);

      // Set the order document
      batch.set(orderRef, {
        ...orderData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Update product stock quantities
      for (const item of cartItems) {
        const productRef = doc(db, "products", item.id);
        const productSnap = await getDoc(productRef);

        if (!productSnap.exists()) {
          throw new Error(`Product ${item.name} is no longer available`);
        }

        const currentStock = productSnap.data().stockQuantity;
        if (currentStock < item.quantity) {
          throw new Error(
            `Only ${currentStock} units available for ${item.name}`
          );
        }

        batch.update(productRef, {
          stockQuantity: increment(-item.quantity),
          updatedAt: serverTimestamp(),
        });
      }

      // Commit the batch
      await batch.commit();

      // Clear cart and redirect
      dispatch({ type: "CLEAR_CART" });

      // Show success message and redirect
      router.push(`/order-confirmation?orderId=${orderRef.id}`);
    } catch (error) {
      console.error("Order submission error:", error);
      setFormError(error.message || "Failed to place order. Please try again.");
      setIsSubmitting(false);
    }
  };

  const inputBaseStyle =
    "mt-1 block w-full border-slate-300 dark:border-slate-600 rounded-lg shadow-sm py-2.5 px-4 bg-white dark:bg-slate-700 text-brandTextPrimary dark:text-slate-100 focus:ring-brandAccentFocus focus:border-brandAccentFocus font-sans text-sm";
  const labelStyle =
    "block text-sm font-medium text-brandTextSecondary dark:text-slate-300 mb-1";

  if (cartItems.length === 0 && !isSubmitting) {
    // Show loading or message if cart is empty (useEffect handles redirect)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-brandBackground dark:bg-slate-900 p-8 font-sans">
        <p className="text-xl font-medium text-brandTextSecondary dark:text-slate-400 font-body">
          Your cart is empty. Redirecting...
        </p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Checkout - JK Combat Academy</title>
        <meta
          name="description"
          content="Complete your order at JK Combat Academy."
        />
      </Head>

      {/* This page doesn't use the standard Layout to avoid double Navbar/Footer if Layout includes them */}
      {/* You might want a minimal Navbar here if needed */}

      <div className="min-h-screen bg-brandBackground dark:bg-slate-900 font-sans py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <header className="text-center mb-10">
            <Link href="/" className="inline-block mb-4">
              {/* Optional: Your Logo Here */}
              {/* <Image src="/logo.png" alt="JK Combat Academy" width={150} height={50} /> */}
              <h1 className="text-3xl sm:text-4xl font-bold text-brandTextPrimary dark:text-brandBackground font-header">
                Checkout
              </h1>
            </Link>
          </header>

          <div className="grid lg:grid-cols-12 gap-8 xl:gap-12">
            {/* Order Summary (Right side on large screens) */}
            <aside className="lg:col-span-5 lg:order-last bg-white dark:bg-slate-800 p-6 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-semibold text-brandTextPrimary dark:text-brandBackground font-header mb-6 border-b border-slate-200 dark:border-slate-700 pb-4">
                Your Order
              </h2>
              {cartItems.length > 0 ? (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-start gap-4 border-b border-slate-100 dark:border-slate-700/50 pb-3 last:border-b-0 last:pb-0"
                    >
                      <div className="flex-shrink-0 w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-md overflow-hidden">
                        <Image
                          src={
                            item.mainImage || item.image || "/placeholder.png"
                          }
                          alt={item.name}
                          width={64}
                          height={64}
                          className="object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/placeholder.png";
                          }}
                        />
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-sm font-semibold text-brandTextPrimary dark:text-slate-100">
                          {item.name}
                        </h3>
                        <p className="text-xs text-brandTextSecondary dark:text-slate-400">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-brandTextPrimary dark:text-slate-100 whitespace-nowrap">
                        ৳{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-brandTextSecondary dark:text-slate-300">
                        Subtotal:
                      </span>
                      <span className="font-medium text-brandTextPrimary dark:text-slate-100">
                        ৳{Number(cartTotal).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-brandTextSecondary dark:text-slate-300">
                        Delivery Charge (
                        {formData.deliveryOption.replace("-", " ")}):
                      </span>
                      <span className="font-medium text-brandTextPrimary dark:text-slate-100">
                        ৳{Number(currentDeliveryCharge).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-brandTextPrimary dark:text-brandBackground">
                        Order Total:
                      </span>
                      <span className="text-brandAccent dark:text-brandAccentFocus">
                        ৳{Number(cartTotal + currentDeliveryCharge).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-brandTextSecondary dark:text-slate-400">
                  Your cart is currently empty.
                </p>
              )}
            </aside>

            {/* Checkout Form (Left side on large screens) */}
            <section className="lg:col-span-7">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Delivery Information */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700">
                  <h2 className="text-2xl font-semibold text-brandTextPrimary dark:text-brandBackground font-header mb-6">
                    Delivery Information
                  </h2>
                  <div className="space-y-5">
                    <div>
                      <label htmlFor="name" className={labelStyle}>
                        <UserIcon /> Full Name{" "}
                        <span className="text-brandRed">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={inputBaseStyle}
                        required
                        autoComplete="name"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className={labelStyle}>
                        <PhoneIcon /> Phone Number{" "}
                        <span className="text-brandRed">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        id="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={inputBaseStyle}
                        required
                        autoComplete="tel"
                        placeholder="e.g., 01712345678"
                      />
                    </div>
                    <div>
                      <label htmlFor="shippingAddress" className={labelStyle}>
                        <AddressIcon /> Shipping Address{" "}
                        <span className="text-brandRed">*</span>
                      </label>
                      <textarea
                        name="shippingAddress"
                        id="shippingAddress"
                        value={formData.shippingAddress}
                        onChange={handleChange}
                        rows="4"
                        className={inputBaseStyle}
                        required
                        autoComplete="street-address"
                      ></textarea>
                    </div>
                    <div>
                      <label htmlFor="deliveryOption" className={labelStyle}>
                        Delivery Area <span className="text-brandRed">*</span>
                      </label>
                      <select
                        name="deliveryOption"
                        id="deliveryOption"
                        value={formData.deliveryOption}
                        onChange={handleChange}
                        className={inputBaseStyle}
                        required
                      >
                        <option value="inside-dhaka">
                          Inside Dhaka (৳{deliveryCharges["inside-dhaka"]})
                        </option>
                        <option value="outside-dhaka">
                          Outside Dhaka (৳{deliveryCharges["outside-dhaka"]})
                        </option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700">
                  <h2 className="text-2xl font-semibold text-brandTextPrimary dark:text-brandBackground font-header mb-6">
                    Payment for Delivery
                  </h2>
                  <div className="space-y-4 text-sm text-brandTextSecondary dark:text-slate-300">
                    <p className="flex items-center">
                      <BkashIcon /> Please pay the delivery charge of{" "}
                      <strong className="mx-1 text-brandAccent dark:text-brandAccentFocus">
                        ৳{currentDeliveryCharge.toFixed(2)}
                      </strong>{" "}
                      via bKash.
                    </p>
                    <p>
                      Send money to our bKash Personal Number:{" "}
                      <strong className="text-brandAccent dark:text-brandAccentFocus text-base">
                        01766283131
                      </strong>
                    </p>
                    <p>
                      After payment, please enter the{" "}
                      <strong className="text-brandTextPrimary dark:text-slate-100">
                        bKash Transaction ID (TrxID)
                      </strong>{" "}
                      below.
                    </p>
                    <p className="text-xs text-brandTextMuted dark:text-slate-500">
                      (Note: Product price to be paid upon delivery - Cash on
                      Delivery)
                    </p>
                  </div>
                  <div className="mt-6">
                    <label htmlFor="transactionId" className={labelStyle}>
                      bKash Transaction ID{" "}
                      <span className="text-brandRed">*</span>
                    </label>
                    <input
                      type="text"
                      name="transactionId"
                      id="transactionId"
                      value={formData.transactionId}
                      onChange={handleChange}
                      className={inputBaseStyle}
                      required
                      placeholder="Enter TrxID here"
                    />
                  </div>
                </div>

                {formError && (
                  <p className="text-sm text-brandRed dark:text-red-400 text-center bg-red-100 dark:bg-red-900/30 p-3 rounded-md">
                    {formError}
                  </p>
                )}

                <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                  <button
                    type="submit"
                    disabled={isSubmitting || cartItems.length === 0}
                    className="w-full bg-brandAccent hover:bg-brandAccentHover text-brandTextOnAccent font-semibold py-3.5 px-6 rounded-lg shadow-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-brandAccentFocus focus:ring-opacity-50 disabled:opacity-60 disabled:cursor-not-allowed text-base"
                  >
                    {isSubmitting ? "Placing Order..." : "Place Order"}
                  </button>
                </div>
                <p className="mt-4 text-xs text-center text-brandTextMuted dark:text-slate-500">
                  By placing your order, you agree to our Terms & Conditions and
                  Privacy Policy.
                </p>
              </form>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
