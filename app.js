require("dotenv").config();
const express = require("express");
const expressLayout = require("express-ejs-layouts");
const connectDB = require("./config/db");
const app = express();

PORT = 4000 || process.env.PORT;
connectDB();

app.use(express.static("./public"));

//Template Engine
app.use(expressLayout);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

app.use("/", require("./routes/main"));

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
