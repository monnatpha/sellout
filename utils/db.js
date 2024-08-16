import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: "db-mysql-warranty-focus-do-user-11166996-0.c.db.ondigitalocean.com",
  user: "userfocus",
  password: "gKHovcjKhNLlXu2",
  database: "focus",
  port: 25060,
  connectTimeout: 50000,
});
