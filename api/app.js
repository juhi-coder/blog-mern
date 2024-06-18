const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dbConnection = require("./config/db");
const userRoutes = require("./routes/user");
const app = express();

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));

dbConnection();

app.use("/api", userRoutes);

app.listen(4000, () => {
  console.log("Server is running on http://localhost:4000");
});
