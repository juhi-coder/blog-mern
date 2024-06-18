const mongoose = require("mongoose");

async function dbConnection() {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Database successfully connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

module.exports = dbConnection;
