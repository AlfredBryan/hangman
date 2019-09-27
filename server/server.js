const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const logger = require("morgan");
const path = require("path");
const mongoose = require("mongoose");
const router = require("./routes/router");

dotenv.config();

const port = process.env.PORT || 4000;

const app = express()

//Connect to DB
mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => console.log("Connected to DB"))
  .catch(error => console.log("Error" + error));

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname + "client/build/index.html"));
  });
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger("dev"));

//Setting cors
app.use(cors());

//setting routes
app.use("/api/v1", router);

//Start server
app.listen(port, () => {
  console.log(`server started at port ${port}`);
});
