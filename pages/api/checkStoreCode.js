import { db } from "../../utils/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { storeCode } = req.query;

    try {
      const [result] = await db.query("CALL SLZS_Check_StoreCode(?)", [
        storeCode,
      ]);
      res.status(200).json({ result });
    } catch (error) {
      res.status(500).json({ error: "Failed to Check store code" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
