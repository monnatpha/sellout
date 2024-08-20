import { db } from "../../utils/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      console.log("Testing database connection...");
      await db.query("SELECT 1");
      console.log("Database connection successful.");
      const [result] = await db.query("CALL SLZS_Option_AgentStore");
      res.status(200).json({ result });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch option agent store" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
