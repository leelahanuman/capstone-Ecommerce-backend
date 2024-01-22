const app = require("express");
const router = app.Router();
const Product = require("../models/productModel");
const jwt = require("jsonwebtoken");

router.get("/", async (req, res) => {
  const products = await Product.find({});
  res.status(200).json(products);
});

router.post("/", async (req, res) => {
  // getting details from user/admin
  const { name, description,category, price, image } = req.body;
  // check
  if (!name || !description ||!category || !price || !image) {
    res.status(404).json({ message: "please enter requied fields" });
  }
  // token present or not in header
  const token = req.headers.authtoken;
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  // decoding token and checking is it admin or not
  const authToken = jwt.decode(token, process.env.SECRET_KEY);
  if (authToken.role !== "admin") {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  const findProduct = await Product.findOne({ name });
  if (findProduct) {
    res.status(401).json({ message: "Product already added with this name" });
    return;
  }
  // creating product in db
  const createProduct = await Product.create({
    name,
    description,
    category,
    price,
    image,
  });

  // sending response with created product
  res.status(201).json(createProduct);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  // console.log(id);
  const product = await Product.findById(id);
  if (!product) {
    res.status(404).json({ message: "There is no such product" });
    return;
  }
  // console.log(product);
  res.status(200).json(product);
});

router.put("/:id", async (req, res) => {
  // getting details from user/admin
  const { productName, description, category,price, image } = req.body;
  // token present or not in header
  const token = req.headers.authtoken;
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  // decoding token and checking is it admin or not
  const authToken = jwt.decode(token, process.env.SECRET_KEY);
  if (authToken.role !== "admin") {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  // id
  const id = req.params.id;
  const product = await Product.findById(id);
  if (!product) {
    res.status(404).json({ message: "There is no such product" });
    return;
  }
  const updateProduct = await Product.findByIdAndUpdate(
    id,
    {
      name: productNmae,
      description,
      category,
      price,
      image,
    },
    { new: true }
  );
  res.status(200).json(updateProduct);
});

router.delete("/:id", async (req, res) => {
    const id = req.params.id;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      res.status(404).json({ message: "There is no such product" });
      return;
    }
    res.status(200).json(product);
});

module.exports = router;