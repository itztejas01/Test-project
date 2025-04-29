const db = require("./db");
const {
  validateStudentInput,
  checkEmailExists,
  createStudentRecord,
  createMarksRecord,
  getStudentsList,
  deleteStudentRecord,
  verifyStudentExists,
  updateStudentRecord,
  updateMarksRecord,
  getStudentWithMarks,
} = require("./dbHelper");
const { successResponse, errorResponse, PAGE_LIMIT } = require("./helpers");

const createStudent = async (req, res) => {
  try {
    const { full_name, date_of_birth, email, marks, exam_date } = req.body;

    // Input validation
    const validationErrors = validateStudentInput(
      full_name,
      date_of_birth,
      email,
      marks,
      exam_date
    );

    if (validationErrors) {
      return errorResponse(res, validationErrors.message, {}, 400);
    }

    // Check email uniqueness using Promise
    const existingStudent = await checkEmailExists(email);
    if (existingStudent) {
      return errorResponse(res, "Email already in use", {}, 400);
    }

    // Create student and marks in a transaction
    await db.run("BEGIN TRANSACTION");

    const studentResult = await createStudentRecord(
      full_name,
      date_of_birth,
      email
    );
    await createMarksRecord(studentResult.lastID, marks, exam_date);

    await db.run("COMMIT");
    return successResponse(res, "Student created successfully", {}, 201);
  } catch (error) {
    await db.run("ROLLBACK");
    return errorResponse(res, error.message, {}, 500);
  }
};

const getStudents = async (req, res) => {
  try {
    const { page = 1, limit = PAGE_LIMIT } = req.query;

    const data = await getStudentsList(page, limit);
    return successResponse(res, "Students fetched successfully", data, 200);
  } catch (error) {
    console.log(error);

    return errorResponse(res, error.message, {}, 500);
  }
};

const deleteStudent = async (req, res) => {
  const { id } = req.params;
  try {
    await deleteStudentRecord(id);
    return successResponse(res, "Student deleted successfully", {}, 200);
  } catch (error) {
    return errorResponse(res, error.message, {}, 500);
  }
};

const updateStudent = async (req, res) => {
  const { id } = req.params;
  const { full_name, date_of_birth, email, marks, exam_date } = req.body;
  try {
    // check if student exists
    const student = await verifyStudentExists(id);
    if (!student) {
      return errorResponse(res, "Student not found", {}, 404);
    }

    const updates = {
      student: {
        fields: [],
        values: [],
      },
      marks: {
        fields: [],
        values: [],
      },
    };

    // Build student updates
    if (full_name) {
      updates.student.fields.push("full_name = ?");
      updates.student.values.push(full_name);
    }
    if (date_of_birth) {
      updates.student.fields.push("date_of_birth = ?");
      updates.student.values.push(new Date(date_of_birth));
    }
    if (email) {
      updates.student.fields.push("email = ?");
      updates.student.values.push(email);
    }

    // Build marks updates
    if (marks !== undefined) {
      if (marks < 0 || marks > 100) {
        return errorResponse(res, "Marks must be between 0 and 100", {}, 400);
      }
      updates.marks.fields.push("marks_obtained = ?");
      updates.marks.values.push(marks);
    }
    if (exam_date) {
      updates.marks.fields.push("exam_date = ?");
      updates.marks.values.push(new Date(exam_date));
    }

    if (
      updates.student.fields.length === 0 &&
      updates.marks.fields.length === 0
    ) {
      return errorResponse(res, "No fields to update", {}, 400);
    }

    await db.run("BEGIN TRANSACTION");
    await updateStudentRecord(
      id,
      updates.student.fields,
      updates.student.values
    );
    await updateMarksRecord(id, updates.marks.fields, updates.marks.values);
    await db.run("COMMIT");

    return successResponse(res, "Student updated successfully", {}, 200);
  } catch (error) {
    await db.run("ROLLBACK");
    return errorResponse(res, error.message, {}, 500);
  }
};

const getStudentById = async (req, res) => {
  const { id } = req.params;

  try {
    const student = await getStudentWithMarks(id);
    if (!student) {
      return errorResponse(res, "Student not found", {}, 404);
    }
    return successResponse(res, "Student fetched successfully", student, 200);
  } catch (error) {
    return errorResponse(res, error.message, {}, 500);
  }
};

module.exports = {
  createStudent,
  deleteStudent,
  getStudents,
  updateStudent,
  getStudentById,
};
