import { useState } from "react";
import { StudentModal, StudentTable } from "./components";
import {
  deleteStudent,
  formatDate,
  getStudentById,
  successResponse,
  TUpdateStudent,
} from "./utils";

function App() {
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<TUpdateStudent | null>(null);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setMode("create");
    setEditData(null);
  };

  const handleDelete = async (id: number) => {
    try {
      if (id === 0) {
        swal("Please select a student to delete");
        return;
      }
      await deleteStudent(id);
      handleSuccess();
    } catch (error) {
      console.error(error);
    }
  };
  const handleSuccess = () => {
    // Instead of reloading the page, we can just refresh the table
    window.location.reload();
  };
  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between">
        <h1 className="mb-4">Student Management</h1>
        <div>
          <button className="btn btn-primary" onClick={handleShowModal}>
            Add Student
          </button>
        </div>
      </div>
      <StudentModal
        show={showModal}
        onHide={handleCloseModal}
        onSuccess={handleSuccess}
        mode={mode}
        editData={editData}
      />
      <StudentTable
        onEdit={async (data) => {
          try {
            const response = (await getStudentById(
              data.student_id || 0
            )) as successResponse;
            setEditData({
              ...response.data,
              date_of_birth: formatDate(response.data.date_of_birth),
              exam_date: formatDate(response.data.exam_date),
            });
            setMode("edit");
            handleShowModal();
          } catch (error) {
            console.error(error);
          }
        }}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default App;
