import { useEffect, useState } from "react";
import { fetchAdmissionsByUser } from "../../utils/firebase";
import { useAuth } from "../../context/authContext";
import { School, CheckCircle, Cancel } from "@mui/icons-material";

export default function StudentDashboard() {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    console.log("Current User:", user); // Log user to ensure it’s available

    if (user) {
      const fetchData = async () => {
        setLoading(true);
        try {
          console.log("Fetching admissions for user:", user.uid);
          const userAdmissions = await fetchAdmissionsByUser(user.uid);
          console.log("Fetched admissions:", userAdmissions); // Log the fetched admissions
          setAdmissions(userAdmissions);
        } catch (error) {
          console.error("Error loading admissions:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    } else {
      setLoading(false); // If no user, we stop loading to avoid infinite "Loading..."
    }
  }, [user]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 mt-6">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-8">
        <Header user={user} />
        <AdmissionDetails admissions={admissions} />
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
    <div className="bg-gray-50 rounded-lg shadow-lg p-6 mt-4 border border-gray-200 relative">
      <img
        src={admission.picture}
        alt="Student Picture"
        className="w-32 h-20 object-cover border border-gray-300 absolute top-4 right-4"
      />
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <h4 className="text-lg font-medium text-gray-800">
            Student ID: {admission.studentId}
          </h4>
          <span
            className={`inline-flex items-center px-2 py-1 rounded-md text-sm font-medium text-white ${
              admission.status === "approved" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {admission.status === "approved" ? (
              <CheckCircle className="mr-1" />
            ) : (
              <Cancel className="mr-1" />
            )}
            {admission.status === "approved" ? "Approved" : "Pending"}
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
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-md font-medium text-gray-900">{value}</p>
    </div>
  );
}
