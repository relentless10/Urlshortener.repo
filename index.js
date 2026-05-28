require("dotenv").config();
const express = require("express")

const app = express()
const pool = require('./db');

// Add JSON middleware

app.use(express.json());

//to add cors middlleware
app.use(require("cors")());


const linksrouter = require('./routes/links.js');

app.use("/links",linksrouter)


app.get('/:code', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM links WHERE code = $1',
      [req.params.code]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Link not found' });
    }
    await pool.query(
      'UPDATE links SET clicks = clicks + 1 WHERE code = $1',
      [req.params.code]
    );
    res.redirect(result.rows[0].url);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.listen(3000, () => {
  
 console.log("listening on port 3000")
} );


