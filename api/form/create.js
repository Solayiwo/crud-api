const pool = require("../../config/db");

async function createformdbTable() {
  try {
    await pool.query(`CREATE TABLE IF NOT EXISTS form_data(
    id SERIAL PRIMARY KEY,
    firstname TEXT NOT NULL,
    lastname TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    gender TEXT NOT NULL,
    age INTEGER NOT NULL,
    address TEXT NOT NULL,
    country TEXT NOT NULL
    )`);
    console.log("Table created sucessfully");
  } catch (error) {
    console.log("Error creating table", error);
  }
}

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

  try {
    await createformdbTable(); // Ensure the table exists

    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { firstname, lastname, email, gender, age, address, country } =
      req.body;

    const emailCheckQuery = "SELECT * FROM form_data WHERE email = $1";
    const emailCheckResult = await pool.query(emailCheckQuery, [email]);

    if (emailCheckResult.rows.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Insert new record if email is unique
    const insertQuery =
      "INSERT INTO form_data (firstname, lastname, email, gender, age, address, country) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING*";
    const values = [firstname, lastname, email, gender, age, address, country];
    const result = await pool.query(insertQuery, values);
    res
      .status(201)
      .json({ message: "Form submitted successfully", form: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
