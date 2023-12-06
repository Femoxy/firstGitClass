// import mongoose
const mongoose = require("mongoose");
require('dotenv').config();

// create our connection string
const DB = process.env.database
// create a connection with mongoose
mongoose
  .connect(DB)
  .then(() => {
    console.log("connection established successfully");
  })
  .catch((error) => {
    console.log(error.message);
  }); 