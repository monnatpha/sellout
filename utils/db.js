import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: "db-saleplus-zt-do-user-16212651-0.c.db.ondigitalocean.com",
  user: "saleplusdemo",
  password: "AVNS_Cw3xBIZXgkL_Jjg05mI",
  database: "TestMonnat",
  port: 25060,
  connectTimeout: 50000,
});
