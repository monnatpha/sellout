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

      res.status(201).json({
        success: true,
        message: "ลงทะเบียนสำเร็จ",
        result: "",
      });
    } catch (error) {
      console.log(error);
      await sendLarkFailed(error, "insert");
      res.status(500).json({ error: "บันทึกข้อมูลไม่สำเร็จ (10017)" });
    }
  } else {
    await sendLarkFailed({ error: "บันทึกข้อมูลไม่สำเร็จ (10018)" }, "insert");
    res.status(405).json({ message: "บันทึกข้อมูลไม่สำเร็จ (10018)" });
  }
}
