import { db } from "../../utils/db";
import { sendLarkFailed } from "./functions/sendLarkFailed";

export default async function handler(req, res) {
  if (req.method === "GET" && req.query.customerNo) {
    let { customerNo } = req.query;
    try {
      if (customerNo) customerNo = customerNo.toUpperCase();
      const [result] = await db.query("CALL WRFS_Summary_register(?)", [
        customerNo,
      ]);

      res.status(200).json({
        success: true,
        message: "ดึงข้อมูลสำเร็จ",
        result: result[0][0],
      });
    } catch (error) {
      await sendLarkFailed(error, "get-summary-register");
      res.status(500).json({
        success: false,
        message: "ดึงข้อมูลไม่สำเร็จ (10015)",
        result: "",
      });
    }
  } else {
    await sendLarkFailed(
      { error: "ดึงข้อมูลไม่สำเร็จ (10016)" },
      "get-summary-register"
    );
    res.status(405).json({
      success: false,
      message: "ดึงข้อมูลไม่สำเร็จ (10016)",
      result: "",
    });
  }
}
