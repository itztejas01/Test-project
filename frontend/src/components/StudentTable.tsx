import { useEffect, useState } from "react";
import {
  PAGE_LIMIT,
  getStudents,
  paginationStudentSchema,
  successResponse,
  TPaginationStudent,
  calculateAge,
  TUpdateStudent,
  formatDate,
} from "@/utils";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Pagination } from "./Pagination";
import swal from "sweetalert";

interface StudentTableProps {
  onEdit: (data: TUpdateStudent) => void;
  onDelete: (id: number) => Promise<void>;
}

const StudentTable = ({ onEdit, onDelete }: StudentTableProps) => {
  const [students, setStudents] = useState<TPaginationStudent["students"]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [pageSize, setPageSize] = useState(0);
  const [page, setPage] = useState(0);

  useEffect(() => {
    (async () => {
      await fetchStudent();
    })();
  }, []);

  const fetchStudent = async (page: number = 1, limit: number = PAGE_LIMIT) => {
    try {
      setLoading(true);
      const response = (await getStudents(page, limit)) as successResponse;
      try {
        const validatedData = await paginationStudentSchema.validate(
          response.data
        );
        setStudents(validatedData.students);
        setPageSize(validatedData.pageSize);
        setPage(validatedData.page);
        setLoading(false);
      } catch (validationError) {
        console.log(validationError);

        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      const err = error as Record<string, string>;
      setError(err?.message || "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Age</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center p-4">
                  <div className="d-flex align-items-center justify-content-center">
                    <div
                      className="spinner-border text-primary me-2"
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <span>Loading students...</span>
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={4} className="text-center text-danger p-3">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                </td>
              </tr>
            ) : students && students?.length > 0 ? (
              students.map((student) => (
                <tr key={student.student_id}>
                  <td>{student.full_name}</td>
                  <td>{student.email}</td>
                  <td>{calculateAge(student.date_of_birth)}</td>
                  <td>
                    <button
                      className="btn btn-outline-primary mx-2"
                      onClick={() =>
                        onEdit({
                          ...student,
                          date_of_birth: formatDate(student.date_of_birth),
                          exam_date: formatDate(student.exam_date),
                        })
                      }
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn btn-outline-danger"
                      onClick={() => {
                        swal({
                          title: "Are you sure?",
                          text: "Are you sure you want to delete this student?",
                          icon: "warning",
                          buttons: ["Cancel", "Delete"],
                        }).then((willDelete) => {
                          if (willDelete) {
                            onDelete(student.student_id || 0);
                          }
                        });
                      }}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center">
                  No student added yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {students && students.length > 0 && (
          <Pagination
            currentPage={page}
            totalPages={pageSize}
            onPageChange={fetchStudent}
          />
        )}
      </div>
    </div>
  );
};

export { StudentTable };
