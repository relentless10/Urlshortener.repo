const express = require("express")

const app = express()


// Add JSON middleware

app.use(express.json());

//to add cors middlleware
app.use(cors())


const linksrouter = require('./routes/links.js');

app.use("/links",linksrouter)

app.listen(3000, () => {
  
 console.log("listening on port 3000")
} );

