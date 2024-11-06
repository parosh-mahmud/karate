import { useEffect, useState } from "react";
import { fetchAdmissionsByUser } from "../../utils/firebase";
import { useAuth } from "../../components/context/authContext";
import { School, CheckCircle, Cancel } from "@mui/icons-material";

export default function StudentDashboard() {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    console.log("Current User:", currentUser); // Log currentUser to ensure it’s available

    if (currentUser) {
      const fetchData = async () => {
        setLoading(true);
        try {
          console.log("Fetching admissions for user:", currentUser.uid);
          const userAdmissions = await fetchAdmissionsByUser(currentUser.uid);
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
      setLoading(false); // If no currentUser, we stop loading to avoid infinite "Loading..."
    }
  }, [currentUser]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center space-x-4">
          <School className="text-indigo-600 text-3xl" />
          <h2 className="text-2xl font-semibold text-gray-800">
            Welcome to Your Dashboard, {currentUser?.displayName || "Student"}
          </h2>
        </div>
        <p className="text-gray-600 mt-2">
          Here you can view your admission details and track the status of your
          application.
        </p>

        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-700">
            Admission Details
          </h3>
          {admissions.length > 0 ? (
            admissions.map((admission) => (
              <div
                key={admission.id}
                className="bg-gray-50 rounded-lg shadow-lg p-6 mt-4 border border-gray-200"
              >
                <div className="flex justify-between items-center">
                  <h4 className="text-lg font-medium text-gray-800">
                    Student ID: {admission.studentId}
                  </h4>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-md text-sm font-medium text-white ${
                      admission.status === "approved"
                        ? "bg-green-500"
                        : "bg-red-500"
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

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="text-md font-medium text-gray-900">
                      {admission.fullName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Father's Name</p>
                    <p className="text-md font-medium text-gray-900">
                      {admission.fatherName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Mother's Name</p>
                    <p className="text-md font-medium text-gray-900">
                      {admission.motherName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date of Birth</p>
                    <p className="text-md font-medium text-gray-900">
                      {admission.dateOfBirth}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Mobile</p>
                    <p className="text-md font-medium text-gray-900">
                      {admission.mobile}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-md font-medium text-gray-900">
                      {admission.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="text-md font-medium text-gray-900">
                      {admission.presentAddress}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Nationality</p>
                    <p className="text-md font-medium text-gray-900">
                      {admission.nationality}
                    </p>
                  </div>
                </div>

                <div className="mt-6 border-t border-gray-200 pt-4">
                  <h5 className="text-lg font-semibold text-gray-700">
                    Payment Details
                  </h5>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <p className="text-md font-medium text-gray-900">
                    {admission.paymentMethod}
                  </p>
                  <p className="text-sm text-gray-500 mt-3">Transaction ID</p>
                  <p className="text-md font-medium text-gray-900">
                    {admission.transactionId}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="mt-4 text-gray-600">
              No admissions found for this user.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
