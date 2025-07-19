// // pages/seminars/[id].js
// import { useRouter } from "next/router";
// import RunningSeminarForm from "@/components/seminars/RunningSeminarForm";
// import FitnessSeminarForm from "@/components/seminars/FitnessSeminarForm";

// export default function SeminarRegistration() {
//   const router = useRouter();
//   const { id } = router.query;

//   if (!id) return null;

//   // Render seminar form based on static id
//   if (id === "run") return <RunningSeminarForm />;
//   if (id === "fitness") return <FitnessSeminarForm />;

//   return (
//     <div className="p-8 text-center">
//       <h2 className="text-2xl font-bold text-red-600">Seminar not found</h2>
//       <p className="mt-4 text-gray-500">Please select a valid seminar.</p>
//     </div>
//   );
// }
