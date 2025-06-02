import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { School, CheckCircle, Cancel } from "@mui/icons-material";
import { db, collection, query, where, getDocs } from "../../utils/firebase"; // Import Firebase functions

export default function StudentDashboard() {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading) {
      // Only fetch data if authentication is not loading
      if (user) {
        console.log("User authenticated:", user);
        const fetchData = async () => {
          setLoading(true);
          try {
            const admissionsRef = collection(db, "admissions");
            const q = query(admissionsRef, where("uid", "==", user.uid));
            const querySnapshot = await getDocs(q);

            const userAdmissions = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));

            setAdmissions(userAdmissions);
          } catch (error) {
            console.error("Error loading admissions:", error);
          } finally {
            setLoading(false);
          }
        };

        fetchData();
      } else {
        setLoading(false);
        setAdmissions([]); // Clear admissions if no user
      }
    }
  }, [user, authLoading]);

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-semibold">Loading authentication...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-semibold">Loading admissions...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 mt-6">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-8">
        {user ? (
          <>
            <Header user={user} />
            <AdmissionDetails admissions={admissions} />
          </>
        ) : (
          <div className="text-center">
            <p className="text-lg font-semibold">
              Please log in to view your dashboard.
            </p>
            {/* Add a login button/link here if needed */}
          </div>
        )}
      </div>
    </div>
  );
}

function Header({ user }) {
  return (
    <div className="flex items-center space-x-4">
      <School className="text-indigo-600 text-3xl" />
      <h2 className="text-2xl font-semibold text-gray-800">
        Welcome to Your Dashboard, {user?.displayName || "Student"}
      </h2>
      <p className="text-gray-600 mt-2">
        Here you can view your admission details and track the status of your
        application.
      </p>
    </div>
  );
}

function AdmissionDetails({ admissions }) {
  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-gray-700">Admission Details</h3>
      {admissions.length > 0 ? (
        admissions.map((admission) => (
          <StudentAdmissionCard key={admission.id} admission={admission} />
        ))
      ) : (
        <p className="mt-4 text-gray-600">No admissions found for this user.</p>
      )}
    </div>
  );
}

function StudentAdmissionCard({ admission }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-4 border border-gray-200 relative">
      <img
        src={admission.picture}
        alt="Student Picture"
        className="w-32 h-20 object-cover border border-gray-300 absolute top-4 right-4 rounded-md"
      />
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <h4 className="text-lg font-medium text-gray-800">
            Student ID: {admission.studentId}
          </h4>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              admission.status === "approved"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {admission.status === "approved" ? (
              <>
                <CheckCircle className="mr-1 text-green-500" fontSize="small" />
                Approved
              </>
            ) : (
              <>
                <Cancel className="mr-1 text-red-500" fontSize="small" />
                Pending
              </>
            )}
          </span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoField label="Full Name" value={admission.fullName} />
        <InfoField label="Father's Name" value={admission.fatherName} />
        <InfoField label="Mother's Name" value={admission.motherName} />
        <InfoField label="Date of Birth" value={admission.dateOfBirth} />
        <InfoField label="Mobile" value={admission.mobile} />
        <InfoField label="Email" value={admission.email} />
        <InfoField label="Address" value={admission.presentAddress} />
        <InfoField label="Nationality" value={admission.nationality} />
      </div>

      <div className="mt-6 border-t border-gray-200 pt-4">
        <h5 className="text-lg font-semibold text-gray-700">Payment Details</h5>
        <InfoField label="Payment Method" value={admission.paymentMethod} />
        <InfoField label="Transaction ID" value={admission.transactionId} />
      </div>
    </div>
  );
}

function InfoField({ label, value }) {
  return (
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-md text-gray-800">{value || "N/A"}</p>
    </div>
  );
}
