const mongoose = require("mongoose");

const connect = async () => {
  try {
    // console.log(process.env.CONNECTION_STRING);
    await mongoose.connect(process.env.CONNECTION_STRING);
    console.log("DB CONNECTED SUCCESFULLY");
  } catch (error) {
    console.log("Connection error",error);
  }
};


module.exports = connect;
