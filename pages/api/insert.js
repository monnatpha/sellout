import { db } from "../../utils/db";
import { sendLarkSuccess } from "../functions/sendLarkSuccess";

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
      userLineId,
    } = req.body;

    try {
      const [result] = await db.query(
        "CALL WRFS_SelloutPrivilegePrivacy_Insert(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          userLineId,
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
      await sendLarkSuccess({
        fullName,
        phoneNumber,
        purchaseChannel,
        productQR,
        agentStore,
        storeQR,
        productCategory,
        mobileModel,
        acceptPDPA,
        userLineId,
      });
      res.status(201).json({ message: "User inserted successfully", result });
    } catch (error) {
      await sendLarkFailed(error, "insert");
      res.status(500).json({ error: "Failed to insert user" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
