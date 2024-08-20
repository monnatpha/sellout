import { db } from "../../utils/db";
import { sendLarkFailed } from "../functions/sendLarkFailed";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const [result] = await db.query("CALL WRFS_Option_ProductCategory");
      res.status(200).json({ result });
    } catch (error) {
      await sendLarkFailed(error, "getProductCategory");
      res
        .status(500)
        .json({ error: "Failed to fetch option product category" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
