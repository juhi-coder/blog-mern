const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dbConnection = require("./config/db");
const userRoutes = require("./routes/userRoute");
const postRoutes = require("./routes/postRoute"); // Make sure to import the post routes
require("dotenv").config();

const port = process.env.PORT || 3000;
const app = express();

app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));

dbConnection();

app.use("/auth", userRoutes);
app.use("/blog", postRoutes); // Use the post routes

app.get("/", (req, res) => {
  res.send("hi , i am live...");
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
