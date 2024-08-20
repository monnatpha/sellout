import { db } from "../../utils/db";
import { sendLarkFailed } from "../functions/sendLarkFailed";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { storeCode } = req.query;

    try {
      const [result] = await db.query("CALL WRFS_Check_StoreCode(?)", [
        storeCode,
      ]);
      res.status(200).json({ result });
    } catch (error) {
      await sendLarkFailed(error, "checkStoreCode");
      res.status(500).json({ error: "Failed to Check store code" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
