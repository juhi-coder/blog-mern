const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dbConnection = require("./config/db");
const userRoutes = require("./routes/user");
require("dotenv").config();

const port = process.env.PORT || 3000;
const app = express();

app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));

dbConnection();

app.use("/api", userRoutes);

app.get("/", (req, res) => {
  res.send("hi , i am live...");
});

app.listen(4000, () => {
  console.log(`Server is running on ${port}`);
});
