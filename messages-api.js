const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3000;

app
  .use(bodyParser.json())
  .post("/messages", (req, res) => {
    console.log(`REQ BODY IS ${req.body}`); // Req Body is [object Object]
    if (!req.body.text || req.body.text === "") {
      res.status(400).end();
    }
    res.json({
      message: "Message received loud and clear"
    });
  })
  .listen(port, () => console.log(`Listening on port ${port}!`));
