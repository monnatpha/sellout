import { db } from "../../utils/db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const {
      fullName,
      phoneNumber,
      purchaseChannel,
      productCode,
      agentStore,
      storeCode,
      productCategory,
      mobileModel,
      acceptPDPA,
      id,
      acc,
    } = req.body;

    console.log("Request body:", req.body);

    try {
      console.log("Testing database connection...");
      await db.query("SELECT 1");
      console.log("Database connection successful.");

      console.log("Calling stored procedure with parameters:", [
        "lineId",
        "liffId",
        fullName,
        phoneNumber,
        purchaseChannel,
        productCode,
        agentStore,
        storeCode,
        productCategory,
        mobileModel,
        acceptPDPA,
      ]);

      const [result] = await db.query(
        "CALL sp_insert_sellout_privilege_privacy_register(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          "lineId",
          "liffId",
          fullName,
          phoneNumber,
          purchaseChannel,
          productCode,
          agentStore,
          storeCode,
          productCategory,
          mobileModel,
          acceptPDPA,
        ]
      );

      console.log("Stored procedure result:", result);
      res.status(201).json({ message: "User inserted successfully", result });
    } catch (error) {
      console.error("Error inserting user:", {
        message: error.message,
        stack: error.stack,
        sql: error.sql,
        sqlState: error.sqlState,
        errno: error.errno,
      });
      res.status(500).json({ error: "Failed to insert user" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
