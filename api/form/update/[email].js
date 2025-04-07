const pool = require("../../../config/db");

module.exports = async (req, res) => {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.query; // This works in Vercel when using dynamic routing
  const { updateAddress } = req.body;

  if (!updateAddress) {
    return res.status(400).json({ error: "Field is required" });
  }

  try {
    const result = await pool.query(
      `UPDATE form_data SET address = $1 WHERE email = $2 RETURNING *`,
      [updateAddress, email]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User details not found" });
    }
    res.json({
      message: "Details updated successfully!",
      user: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
