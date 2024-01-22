const mongoose = require("mongoose");

const connect = async () => {
  try {
    // console.log(process.env.CONNECTION_STRING);
    await mongoose.connect("mongodb+srv://madasuleelahanuman:FvWFTGyEu4nt8pCj@cluster0.aroi7ko.mongodb.net/fomo-db");
    console.log("DB CONNECTED SUCCESFULLY");
  } catch (error) {
    console.log("Connection error");
  }
};


module.exports = connect;
