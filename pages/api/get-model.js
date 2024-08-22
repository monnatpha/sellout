import { db } from "../../utils/db";
import { sendLarkFailed } from "./functions/sendLarkFailed";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const [result] = await db.query("CALL WRFS_Option_Model");
      res.status(200).json({
        success: true,
        message: "ดึงข้อมูลสำเร็จ",
        result,
      });
    } catch (error) {
      await sendLarkFailed(error, "get-model");
      res.status(500).json({
        success: false,
        message: "ดึงข้อมูลไม่สำเร็จ",
        result: error,
      });
    }
  } else {
    res.status(405).json({
      success: false,
      message: "ดึงข้อมูลไม่สำเร็จ",
      result: [],
    });
  }
}
