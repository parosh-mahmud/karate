// pages/admin/trainers/create.js
import AdminLayout from "../../../components/admin/AdminLayout";
import AddTrainerForm from "../../../components/admin/AddTrainerForm";

export default function CreateTrainerPage() {
  return <AddTrainerForm />;
}

CreateTrainerPage.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
