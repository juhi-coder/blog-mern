const mongoose = require("mongoose");

 function dbConnection() {
  mongoose
    .connect(
      "mongodb+srv://juhi:juhi@cluster0.kdsz8cd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    )
    .then(() => {
      console.log("database suceesfully created");
    })
    .catch((e) => {
      console.log("Error connecting to mongodb", e);
    });
}

module.exports=dbConnection;
