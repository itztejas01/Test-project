const sqlite3 = require("sqlite3").verbose();
const { hashPassword } = require("./helpers");

// Create SQLite database connection
const db = new sqlite3.Database("../users.db", (err) => {
  if (err) {
    console.error("Error connecting to database:", err);
  } else {
    console.log("Connected to SQLite database");
  }
});

const getAllUsers = (callBack) => {
  const query =
    "select * from users where status = 1 order by id desc limit 50";

  db.all(query, [], callBack);
};

const createUser = async (userName, email, password, dateOfBirth, callBack) => {
  const hashedPassword = await hashPassword(password);
  const dob = dateOfBirth
    ? new Date(dateOfBirth).toISOString().split("T")[0]
    : null;
  const query = `
    INSERT INTO users (name, email, password, date_of_birth,status)
    VALUES (?, ?, ?, ?,1);
    `;
  db.run(query, [userName, email, hashedPassword, dob], callBack);
};

const findUser = (userFindTypeKey, userFindTypeValue, callBack) => {
  const query = `select * from users where ? = ? `;

  db.run(query, [userFindTypeKey, userFindTypeValue], callBack);
};

const updateUser = async (
  userName,
  email,
  password,
  dateOfBirth,
  id,
  callBack
) => {
  const hashedPassword = password ? await hashPassword(password) : null;
  const dob = dateOfBirth
    ? new Date(dateOfBirth).toISOString().split("T")[0]
    : null;

  const query = `
    UPDATE users
    SET 
        name = COALESCE(?, name),
        email = COALESCE(?, email),
        password = COALESCE(?, password),
        date_of_birth = COALESCE(?, date_of_birth)          
    WHERE id = ?;
    `;

  db.run(query, [userName, email, hashedPassword, dob, id], callBack);
};

const deleteUser = (userId, callBack) => {
  const query = "UPDATE users set status='0' where id = ?";

  db.run(query, [userId], callBack);
};

module.exports = {
  db,
  createUser,
  findUser,
  updateUser,
  deleteUser,
  getAllUsers,
};
