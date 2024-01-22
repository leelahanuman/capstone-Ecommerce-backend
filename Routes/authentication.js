const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password) {
    res.status(400).json({ message: "You have not entered required fields" });
  }

  const checkUser = await User.find({ email });
  if (checkUser.length!==0) {
    res.status(401).json({ message: "User with email already exists" });
    return;
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const createUser = await User.create({
    email,
    username,
    role,
    password: hashPassword,
  });

  const token = jwt.sign(
    {
      username,
      role:createUser.role,
      email,
    },
    process.env.SECRET_KEY
  );
  res.status(201).json({token})
});
//login 
router.post("/login", async (req, res) => {
  const {email,password} = req.body;
  if (!email || !password) {
    res.status(400).json({ message: "You have not entered required fields" });
  }
  const findUser = await User.findOne({ email});
  if (!findUser) {
    res.status(401).json({ message: "Invalid login credentials" });
    return;
  }
  const compareUserPassword = await bcrypt.compare(password,findUser.password)
  if(compareUserPassword === false){
    res.status(400).json({ message: "Invalid login credentials" });
    return;
  }
  const token = jwt.sign(
    {
  
        email,
        username:findUser.username,
        role:findUser.role
    
    },
    process.env.SECRET_KEY
  );
  res.status(201).json({ token });

});

// getting user 
router.get("/getuser", async (req, res) => {

  const token=req.headers.authtoken;

  const authtoken=jwt.decode(token,process.env.SECRET_KEY);


 res.status(201).json({ authtoken });


  
 })




module.exports = router;
