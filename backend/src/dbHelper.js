const db = require("./db");
const { paginate, PAGE_LIMIT } = require("./helpers");
// Helper functions
const validateStudentInput = (
  full_name,
  date_of_birth,
  email,
  marks,
  exam_date
) => {
  if (!full_name || !date_of_birth || !email || !marks || !exam_date) {
    return { message: "All fields are required" };
  }

  if (marks < 0 || marks > 100) {
    return { message: "Marks must be between 0 and 100" };
  }

  return null;
};

const checkEmailExists = (email) => {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM Students WHERE email = ?", [email], (err, row) => {
      if (err) reject(err);
      resolve(row);
    });
  });
};

const createStudentRecord = (full_name, date_of_birth, email) => {
  return new Promise((resolve, reject) => {
    const dateOfBirth = new Date(date_of_birth);
    db.run(
      "INSERT INTO Students (full_name, date_of_birth, email) VALUES (?, ?, ?)",
      [full_name, dateOfBirth, email],
      function (err) {
        if (err) reject(err);
        resolve({ lastID: this.lastID });
      }
    );
  });
};

const createMarksRecord = (studentId, marks, exam_date) => {
  return new Promise((resolve, reject) => {
    const examDate = new Date(exam_date);
    db.run(
      "INSERT INTO Marks (student_id, marks_obtained, exam_date) VALUES (?, ?, ?)",
      [studentId, parseFloat(marks), examDate],
      (err) => {
        if (err) reject(err);
        resolve();
      }
    );
  });
};

const getStudentsList = (page = 1, limit = PAGE_LIMIT) => {
  return new Promise((resolve, reject) => {
    const { offset, limit: pageLimit } = paginate(page, limit);
    const countSql = "SELECT COUNT(*) AS total FROM Students";
    db.get(countSql, (err, countRow) => {
      if (err) reject(err);

      db.all(
        "SELECT * FROM Students ORDER BY student_id DESC LIMIT ? OFFSET ?",
        [pageLimit, offset],
        (err, rows) => {
          if (err) {
            return reject(err);
          }
          const data = {
            students: rows,
            total: countRow.total,
            pageSize: Math.ceil(countRow.total / pageLimit),
            page: parseInt(page),
            limit: parseInt(limit),
          };
          resolve(data);
        }
      );
    });
  });
};

const deleteStudentRecord = (id) => {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM Marks WHERE student_id = ?", [id], (err) => {
      if (err) reject(err);
      db.run("DELETE FROM Students WHERE student_id = ?", [id], (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  });
};

const getStudentWithMarks = (id) => {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT * FROM Students WHERE student_id = ?",
      [id],
      (err, studentRow) => {
        if (err) reject(err);
        if (!studentRow) resolve(null);

        db.get(
          "SELECT marks_obtained as marks, exam_date FROM Marks WHERE student_id = ?",
          [id],
          (err, marksRow) => {
            if (err) reject(err);
            resolve({ ...studentRow, ...marksRow });
          }
        );
      }
    );
  });
};

const updateStudentRecord = (id, updateFields, updateValues) => {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE Students SET ${updateFields.join(", ")} WHERE student_id = ?`,
      [...updateValues, id],
      (err) => {
        if (err) reject(err);
        resolve();
      }
    );
  });
};

const updateMarksRecord = (id, updateFields, updateValues) => {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE Marks SET ${updateFields.join(", ")} WHERE student_id = ?`,
      [...updateValues, id],
      (err) => {
        if (err) reject(err);
        resolve();
      }
    );
  });
};

const verifyStudentExists = (id) => {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM Students WHERE student_id = ?", [id], (err, row) => {
      if (err) reject(err);
      resolve(row);
    });
  });
};
module.exports = {
  validateStudentInput,
  checkEmailExists,
  createStudentRecord,
  createMarksRecord,
  getStudentsList,
  deleteStudentRecord,
  getStudentWithMarks,
  updateStudentRecord,
  updateMarksRecord,
  verifyStudentExists,
};
