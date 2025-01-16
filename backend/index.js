// server.js
const express = require("express");
const cors = require("cors");
const {
  createUser,
  db,
  deleteUser,
  findUser,
  getAllUsers,
  updateUser,
} = require("./src/db");
const app = express();
app.use(cors());
app.use(express.json());

// Create users table if not exists
db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE,
      date_of_birth DATETIME,
      password TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      status INTEGER DEFAULT 1
    )
  `);
// GET all users
app.get("/api/users", (req, res) => {
  getAllUsers((err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (rows.length === 0) {
      res.status(400).json({ error: "No users list found" });
      return;
    }

    res.json(rows);
  });
});

// GET single user
app.get("/api/users/:id", (req, res) => {
  findUser("id", [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json(row);
  });
});

// POST new user
app.post("/api/users", async (req, res) => {
  const { name, email, date_of_birth, password } = req.body;
  if (!name?.trim() || !email?.trim() || !password.trim()) {
    res.status(400).json({ error: "Name and email are required" });
    return;
  }

  // findUser("email", email, (err, row) => {
  //   if (err) {
  //     res.status(500).json({ error: "Somthing went wrong" });
  //     return;
  //   }

  //   if (row?.length) {
  //     res
  //       .status(400)
  //       .json({ error: "Given user already exists in our system" });
  //     return;
  //   }
  // });

  await createUser(name, email, password, date_of_birth, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    res.json({
      id: this?.lastID,
      name,
      email,
      date_of_birth,
    });
  });
});

// PUT update user
app.put("/api/users/:id", async (req, res) => {
  const { name, email, date_of_birth, password } = req.body;
  if (!name.trim() || !email.trim()) {
    res.status(400).json({ error: "Name and email are required" });
    return;
  }

  await updateUser(
    name,
    email,
    password,
    date_of_birth,
    req.params.id,
    function (err, row) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: "User not found" });
        return;
      }
    }
  );
  return res.json({
    id: req.params.id,
    name,
    email,
    date_of_birth,
    password,
  });
});

// DELETE user
app.delete("/api/users/:id", (req, res) => {
  // findUser("id", req.params.id, (err, row) => {
  //   if (err) {
  //     res.status(500).json({ error: err.message });
  //     return;
  //   }
  //   if (!row) {
  //     res.status(404).json({ error: "User not found" });
  //     return;
  //   }
  // });
  deleteUser(req.params.id, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json({ message: "User deleted successfully" });
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
