const pool = require("../../../config/db");

module.exports = async (req, res) => {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { email } = req.query;
  console.log("Deleted email:", email);
  try {
    const result = await pool.query(
      "DELETE FROM form_data WHERE email = $1 RETURNING *",
      [email]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User details not found" });
    }

    res.json({ message: "User details deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
