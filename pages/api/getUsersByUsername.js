// pages/api/getUsersByUsername.js
import { db } from "../../utils/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { username } = req.query;

    try {
      // Call the stored procedure
      const [rows] = await db.query("CALL GetUsersByUsername(?)", [username]);
      // Send the result back to the client
      res.status(200).json({ users: rows });
    } catch (error) {
      console.error("Error fetching users by username:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
