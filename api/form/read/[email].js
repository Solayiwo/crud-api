const pool = require("../../../config/db");

module.exports = async (req, res) => {
  // Handle CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Get the email from the dynamic parameter
  const { email } = req.query; // This works in Vercel when using dynamic routing
  console.log("Received email:", email); // Debugging step
  try {
    const result = await pool.query(
      "SELECT * FROM form_data WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User details not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
