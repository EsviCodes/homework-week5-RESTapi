const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3000;

// WRITE MIDDLEWARE FUNCTION
// After trying for
let countRequest = 1;

const postRequestMiddleware = count => (req, res, next) => {
  if (count > 5) {
    console.count(); // shows me that if post request is ok, this one doesn't get called
    res.status(429).end();
  } else if (req.body.text && req.body.text !== "") {
    console.count(); // tells me how often this function has been running
    console.log("COUNT IN MW", count); // I can read countRequests here - this one gets updated
    count++;
  }
  next();
};

console.log("COUNT OUTSIDE MQ", countRequest); // this doesn't get updated... :-(

app
  .use(bodyParser.json())
  .use(postRequestMiddleware(countRequest))
  .post("/messages", (req, res) => {
    // Logs the text property of the body to the console
    console.log(`Message sent: ${req.body.text}`);

    // Checks if the text property doens't exists or is an empty string. If so, it sends an error.
    if (!req.body.text || req.body.text === "") {
      res.status(400).end();
    }

    // If the text property exists and its value isn't an empty string, it will respond with the following JSON object:
    res.json({
      message: "Message received loud and clear"
    });
  })
  .listen(port, () => console.log(`Listening on port ${port}!`));
