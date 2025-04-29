import { Modal } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";

import {
  createStudent,
  updateStudent,
  studentSchema,
  TStudent,
  TUpdateStudent,
  updateStudentSchema,
} from "@/utils";

interface StudentModalProps {
  show: boolean;
  onHide: () => void;
  onSuccess: () => void;
  editData?: TUpdateStudent | null;
  mode: "create" | "edit";
}

const StudentModal: React.FC<StudentModalProps> = ({
  show,
  onHide,
  onSuccess,
  editData,
  mode,
}) => {
  const initialValues: TStudent = {
    student_id: editData?.student_id || 0,
    full_name: editData?.full_name || "",
    date_of_birth: editData?.date_of_birth || "",
    email: editData?.email || "",
    marks: editData?.marks || 0,
    exam_date: editData?.exam_date || "",
  };
  const handleSubmit = async (
    values: TStudent,
    { setSubmitting, resetForm }: any
  ) => {
    try {
      console.log(values);
      if (mode === "edit" && editData?.student_id) {
        await updateStudent(editData.student_id, values);
      } else {
        await createStudent(values);
      }
      resetForm();
      onSuccess();
      onHide();
    } catch (error) {
      console.error(
        `Error ${mode === "edit" ? "updating" : "creating"} student:`,
        error
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>
          {mode === "edit" ? "Edit Student" : "Add New Student"}
        </Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={initialValues}
        validationSchema={mode === "edit" ? updateStudentSchema : studentSchema}
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form>
            <Modal.Body>
              <div className="mb-3">
                <label htmlFor="full_name" className="form-label">
                  Full Name
                </label>
                <Field
                  type="text"
                  className={`form-control ${
                    errors.full_name && touched.full_name ? "is-invalid" : ""
                  }`}
                  id="full_name"
                  name="full_name"
                  placeholder="Enter full name"
                />
                <ErrorMessage
                  name="full_name"
                  component="div"
                  className="invalid-feedback"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <Field
                  type="email"
                  className={`form-control ${
                    errors.email && touched.email ? "is-invalid" : ""
                  }`}
                  id="email"
                  name="email"
                  placeholder="Enter email"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="invalid-feedback"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="date_of_birth" className="form-label">
                  Date of Birth
                </label>
                <Field
                  type="date"
                  className={`form-control ${
                    errors.date_of_birth && touched.date_of_birth
                      ? "is-invalid"
                      : ""
                  }`}
                  id="date_of_birth"
                  name="date_of_birth"
                />
                <ErrorMessage
                  name="date_of_birth"
                  component="div"
                  className="invalid-feedback"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="marks" className="form-label">
                  Marks
                </label>
                <Field
                  type="number"
                  className={`form-control ${
                    errors.marks && touched.marks ? "is-invalid" : ""
                  }`}
                  id="marks"
                  name="marks"
                  min="0"
                  max="100"
                />
                <ErrorMessage
                  name="marks"
                  component="div"
                  className="invalid-feedback"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="exam_date" className="form-label">
                  Exam Date
                </label>
                <Field
                  type="date"
                  className={`form-control ${
                    errors.exam_date && touched.exam_date ? "is-invalid" : ""
                  }`}
                  id="exam_date"
                  name="exam_date"
                />
                <ErrorMessage
                  name="exam_date"
                  component="div"
                  className="invalid-feedback"
                />
              </div>
            </Modal.Body>

            <Modal.Footer>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onHide}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
                onClick={() => {
                  console.log(errors);
                }}
              >
                {isSubmitting ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    {mode === "edit" ? "Updating..." : "Saving..."}
                  </>
                ) : mode === "edit" ? (
                  "Update Student"
                ) : (
                  "Save Student"
                )}
              </button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export { StudentModal };
