import { db } from "../../utils/db";
import { sendLarkFailed } from "./functions/sendLarkFailed";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const [result] = await db.query("CALL WRFS_Option_ProductCategory");
      res.status(200).json({
        success: true,
        message: "ดึงข้อมูลสำเร็จ",
        result: { items: result[0] },
      });
    } catch (error) {
      await sendLarkFailed(error, "get-product-category");
      res.status(500).json({
        success: false,
        message: "ดึงข้อมูลไม่สำเร็จ (10003)",
        result: "",
      });
    }
  } else {
    res.status(405).json({
      success: false,
      message: "ดึงข้อมูลไม่สำเร็จ (10004)",
      result: "",
    });
  }
}
