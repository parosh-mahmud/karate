// pages/admin/trainers/create.js
import AdminLayout from "../../../components/admin/AdminLayout";
import AddTrainerForm from "../../../components/admin/AddTrainerForm";

export default function CreateTrainerPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-brandTextPrimary dark:text-brandBackground font-header">
          Add New Trainer
        </h1>
      </div>
      <AddTrainerForm />
    </div>
  );
}

CreateTrainerPage.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
