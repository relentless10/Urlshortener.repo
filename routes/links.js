const express = require("express");
const router = express.Router();
const pool = require("../db.js");

router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM links ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  const { url } = req.body;
  const code = Math.random().toString(36).substring(2, 8);
  try {
    const result = await pool.query("INSERT INTO links (code, url) VALUES ($1, $2) RETURNING *", [code, url]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:code", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM links WHERE code = $1", [req.params.code]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Link not found" });
    await pool.query("UPDATE links SET clicks = clicks + 1 WHERE code = $1", [req.params.code]);
    res.redirect(result.rows[0].url);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM links WHERE id = $1 RETURNING *", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Link not found" });
    res.json({ message: "Deleted", link: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
