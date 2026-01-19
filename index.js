const express=require('express')
const dotenv = require('dotenv').config();
const cors=require('cors')
const app=express();

const connection=require("./dbConnection");
connection();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"]
}));

app.use(express.json());
//app.use(cors());

app.use("/auth",require("./Routes/authentication"))
app.use("/products",require("./Routes/products"))
app.use("/cart",require("./Routes/addtocart"))
app.use('*',(req,res)=>res.status(404).json({message:'No such end points exists'}))

app.listen(process.env.PORT,()=>{
    console.log("Listening on port",process.env.PORT);
})

