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
    } = req.body;

    try {
      console.log(req.body, "Received body");

      // Test database connection
      await db.query("SELECT 1");

      // Call the stored procedure
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

      // Send a success response
      res.status(201).json({ message: "User inserted successfully", result });
    } catch (error) {
      console.error("Error inserting user:", error);
      res.status(500).json({ error: "Failed to insert user" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
