import { db } from "../../utils/db";
import { sendLarkFailed } from "./functions/sendLarkFailed";
import { sendLarkSuccess } from "./functions/sendLarkSuccess";

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
      branch,
    } = req.body;

    try {
      const [result] = await db.query(
        "CALL WRFS_SelloutPrivilegePrivacy_Insert(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
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
          branch,
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
        branch,
      });

      res.status(201).json({
        success: true,
        message: "ลงทะเบียนสำเร็จ",
        result: "",
      });
    } catch (error) {
      await sendLarkFailed(error, "insert");
      res.status(500).json({ error: "Failed to insert user" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
