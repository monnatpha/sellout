import { db } from "../../utils/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const [result] = await db.query("CALL SLZS_Option_ProductCategory");
      res.status(200).json({ result });
    } catch (error) {
      console.log(error, "error");
      res
        .status(500)
        .json({ error: "Failed to fetch option product category" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
