// server.js
const express = require("express");
const cors = require("cors");
const {
  createStudent,
  deleteStudent,
  getStudents,
  updateStudent,
  getStudentById,
} = require("./src/controller");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", getStudents);
app.post("/create-student", createStudent);
app.delete("/delete-student/:id", deleteStudent);
app.put("/update-student/:id", updateStudent);
app.get("/student/:id", getStudentById);

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
