const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3000;

app
  .use(bodyParser.json())
  .post("/messages", (req, res) => {
    console.log(req.body);
    res.json({
      message: "Message received loud and clear"
    });
  })
  .listen(port, () => console.log(`Listening on port ${port}!`));
