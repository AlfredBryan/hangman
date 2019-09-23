const app = require("express")();
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const router = require("./routes/router");

dotenv.config();

const port = process.env.PORT || 4000;

//Connect to DB
mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => console.log("Connected to DB"))
  .catch(error => console.log("Error" + error));

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
