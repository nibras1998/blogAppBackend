const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const JWT_SECRET = "ijsdh3434t34g^$%()dfgDg(DFHDfisfd"
const {verify} = require("jsonwebtoken")
const app = express()
app.use(express.json())
app.use(cors())

app.listen(process.env.PORT || 5000,()=>{
    console.log("Server started on port 5000")
})

mongoose.connect("mongodb+srv://user:pass.ommx479.mongodb.net/?retryWrites=true&w=majority", ()=>{
    console.log("Connected to DB")
})

const Auth=(req)=>{
    const token = req.headers["authorization"];
    if(!token){
        return "redirect to login page"
    }
    const userId = verify(token,JWT_SECRET);
    console.log(userId)
    return userId;
}

require("./models/userDetails")
require("./models/blog")
const Blog = mongoose.model("blogInfo")
const User = mongoose.model("blogUsers")

app.post("/signup",async(req,res)=>{
    const email = req.body.email
    const password= req.body.password
    const encryptedPass = await bcrypt.hash(password, 10);
    try{
        const existing = await User.findOne({email})
        if(existing){
            return res.send({status:"User already exists"})
        }
        await User.create({
            email:email,
            password:encryptedPass
        })
        return res.send({status:"User created"})
    }catch(e){
        console.log(e)
        res.send({status:"Something went wrong"})
    }
})

app.post("/login",async(req,res)=>{
    const email = req.body.email
    const password = req.body.password
    const user = await User.findOne({email})
    if(!user){
        return res.send({status:"User does not exist"})
    }
    if(await bcrypt.compare(password,user.password)){
        const token = jwt.sign({data:user._id,exp:Math.floor(Date.now()/1000)+60*60}, JWT_SECRET);
        if(res.status(201)){
            return res.json({status:"ok",token,user})
        }else{
            res.json({error:"Something went wrong"})
        }
    }else{
        res.json({status:"Invalid password"})
    }
})

app.post("/blog",async(req,res)=>{
    const imageurl = req.body.imageurl
    const title = req.body.title
    const description = req.body.description
    try{
        let blognew = await Blog.create({
            imageurl:imageurl,
            title:title,
            description:description
        })
        res.send({status:"Blog created"})
    }catch(e){
        console.log(e)
        res.send({status:"error"})
    }
})

app.get("/blogs",async(req,res)=>{
    try{
        const blogs = await Blog.find({})
        res.json({blogs:blogs})
    }catch(e){
        console.log(e)
        res.send({status:"error"})
    }
   
})

app.get("/homepage",(req,res)=>{
    let authorized = Auth(req);
    if(authorized=="redirect to login page"){
        res.json({status:"Unauthorized"}).status(401)
    }else{
        res.send("ok")
    }
})