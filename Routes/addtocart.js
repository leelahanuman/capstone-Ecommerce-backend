const app = require("express");
const router = app.Router();
const Cart = require("../models/cartmodel");
const jwt = require("jsonwebtoken");
const Product = require("../models/productModel");

router.get("/", async (req, res) => {
  const token = req.headers.authtoken;
  const authtoken = jwt.decode(token, process.env.SECRET_KEY);
  const cart = await Cart.find({ username: authtoken.username });

  res.json(cart);
});

router.post("/", async (req, res) => {
  const token = req.headers.authtoken;
  const productId = req.headers.productid;
  //decode
  const authtoken = jwt.decode(token, process.env.SECRET_KEY);
  //checkcart
  const checkcart = await Cart.findOne({
    username: authtoken.username,
    productId,
  });
  if (checkcart) {
    res
      .status(400)
      .json({ message: "Cannot add same item more than once to cart" });
    return;
  }

  const quantity = req.body.quantity;

  const product = await Product.findById(productId)
console.log(product);
  const cart = await Cart.create({
    username: authtoken.username,
    productId,
    title:product.name,
    price:product.price,
    image:product.image,
    quantity
  });

  res.status(200).json(cart);
});

router.put("/", async (req, res) => {
  //get quantity from body
  const { quantity } = req.body;

  if (!quantity) {
    res.status(404).json({ message: "Enter quantity" });
    return;
  }

  //get token and cartId  from headers
  const token = req.headers.authtoken;
  const cartId = req.headers.cartid;

  if (!token) {
    res.status(401).json({ message: "You are not authorized to update cart" });
    return;
  }
  if (!cartId) {
    res.status(401).json({ message: "You are unauthorized" });
    return;
  }
  //token decode
  const authtoken = jwt.decode(token, process.env.SECRET_KEY);

  //get cart details
  const cart = await Cart.findById(cartId);
  if (!cart) {
    res.status(401).json({ message: "You are unauthorized to update cart" });
    return;
  }
  //token username===cartId username
  if (authtoken.username !== cart.username) {
    res.status(401).json({ message: "You are not authorized to update cart" });
    return;
  }

  //update
  const updatedCart = await Cart.findByIdAndUpdate(cartId, { quantity });
  res.status(200).json(updatedCart);
});

router.delete("/", async (req, res) => {
  //get token and cartId  from headers
  const token = req.headers.authtoken;
  const cartId = req.headers.cartid;

  if (!token) {
    res.status(401).json({ message: "You are not authorized to update cart" });
    return;
  }
  if (!cartId) {
    res.status(401).json({ message: "You are unauthorized" });
    return;
  }
  //token decode
  const authtoken = jwt.decode(token, process.env.SECRET_KEY);

  //find cart
  const cart = await Cart.findById(cartId);
  if (!cart) {
    res.status(401).json({ message: "You are unauthorized to update cart" });
    return;
  }
  //token===cartusername

  if (authtoken.username !== cart.username) {
    res.status(401).json({ message: "You are not authorized to update cart" });
    return;
  }
  const deletedCart = await Cart.findByIdAndDelete(cartId);

  res.status(200).json(deletedCart);
});
module.exports = router;
