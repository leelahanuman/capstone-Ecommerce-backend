const mongoose = require("mongoose");

const cartModel = mongoose.Schema({
  username: { type: String, required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, required: true },
  quantity: { type: Number, default: 1 },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
});
module.exports = mongoose.model("cart", cartModel);
