import * as yup from "yup";

export const studentSchema = yup.object().shape({
  student_id: yup.number(),
  full_name: yup.string().required("Name is required"),
  date_of_birth: yup.string().required("Date of birth is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  marks: yup.number().required("Marks is required"),
  exam_date: yup.string().required("Exam date is required"),
});

export type TStudent = yup.InferType<typeof studentSchema>;

export const updateStudentSchema = studentSchema.shape({
  full_name: yup.string(),
  date_of_birth: yup.string(),
  email: yup.string().email("Invalid email"),
  marks: yup.number(),
  exam_date: yup.string(),
});

export type TUpdateStudent = yup.InferType<typeof updateStudentSchema>;
export const paginationStudentSchema = yup.object().shape({
  students: yup
    .array()
    .of(updateStudentSchema.shape({ date_of_birth: yup.number() })),
  total: yup.number().required("Total is required"),
  pageSize: yup.number().required("Page size is required"),
  page: yup.number().required("Page is required"),
  limit: yup.number().required("Limit is required"),
});

export type TPaginationStudent = yup.InferType<typeof paginationStudentSchema>;
