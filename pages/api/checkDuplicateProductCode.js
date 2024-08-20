import { db } from "../../utils/db";
import { sendLarkFailed } from "./functions/sendLarkFailed";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { productCode } = req.query;

    try {
      const [result] = await db.query(
        "CALL WRFS_Check_DuplicateProductCode(?)",
        [productCode]
      );
      res.status(200).json({ result });
    } catch (error) {
      await sendLarkFailed(error, "checkDuplicateProductCode");
      res.status(500).json({ error: "Failed to Check duplicate product code" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
