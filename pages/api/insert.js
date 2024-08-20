import { db } from "../../utils/db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const {
      fullName,
      phoneNumber,
      purchaseChannel,
      productQR,
      agentStore,
      storeQR,
      productCategory,
      mobileModel,
      acceptPDPA,
      id,
      acc,
    } = req.body;

    try {
      const [result] = await db.query(
        "CALL SLZS_SelloutPrivilegePrivacy_Insert(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          "lineId",
          "liffId",
          fullName,
          phoneNumber,
          purchaseChannel,
          productQR,
          agentStore,
          storeQR,
          productCategory,
          mobileModel,
          acceptPDPA,
        ]
      );
      res.status(201).json({ message: "User inserted successfully", result });
    } catch (error) {
      res.status(500).json({ error: "Failed to insert user" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
