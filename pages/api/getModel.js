import { db } from "../../utils/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const [result] = await db.query("CALL SLZS_Option_Model");
      res.status(200).json({ result });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch option model" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
