const sqlite3 = require("sqlite3").verbose();
const { hashPassword } = require("./helpers");
const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "student_marks.db");
const schemaPath = path.join(__dirname, "schema.sql");

// Create SQLite database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error connecting to database:", err.message);
    return;
  }
  enableForeignKeys();
  initializeSchema();
});

function enableForeignKeys() {
  db.run("PRAGMA foreign_keys = ON");
}

function initializeSchema() {
  const schema = fs.readFileSync(schemaPath, "utf-8");
  db.exec(schema, (err) => {
    if (err) {
      console.error("Error executing schema", err);
    } else {
      console.log("Database schema initialized");
    }
  });
}

module.exports = db;
