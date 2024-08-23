import { db } from "../../utils/db";
import { sendLarkFailed } from "./functions/sendLarkFailed";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { productCode } = req.query;

    try {
      const [result] = await db.query("CALL WRFS_Check_ProductCode(?)", [
        productCode,
      ]);
      res
        .status(200)
        .json({ success: true, message: "ดึงข้อมูลสำเร็จ", result });
    } catch (error) {
      console.log(error, "error");
      await sendLarkFailed(error, "check-product-code");
      res.status(500).json({
        success: false,
        message: "ดึงข้อมูลไม่สำเร็จ (10011)",
        result: "",
      });
    }
  } else {
    res.status(405).json({
      success: false,
      message: "ดึงข้อมูลไม่สำเร็จ (10012)",
      result: "",
    });
  }
}
