const express = require("express");
const bcrypt = require("bcrypt");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../model/schema");
const { authenticate } = require("../middleware/authentication");
const { authorise } = require("../middleware/authenticate");

const app = express();
app.use(express.json());

const UserRouter = express.Router();

// REGISTER ( -----------------------------------> 

UserRouter.post("/signup", (req, res) => {
    const { name, email, password, role } = req.body;
    bcrypt.hash(password, 10, async function (err, hash) {
        const user = new UserModel({
            name,
            email: email,
            password: hash,
            role
        })
        console.log(user)
        await user.save()
        res.send({ "MESSAGE": "SUCCESSFULLY REGISTER USER THANKS FOR SIGNING" })
    })
})

// LOGIN  ( --------------------------------------->

UserRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email })
    console.log(user)
    const hashed_password = user?.password
    if (!user) {
        res.send(" USER NEED TO LOGIN FIRST")
    }
    bcrypt.compare(password, hashed_password, async function (err, result) {
        if (result) {
            const token = jwt.sign({ userID: user._id, role: user.role }, "normal", { expiresIn: "60s" })
            const refresh_token = jwt.sign({ userID: user._id }, "refresh", { expiresIn: "300s" })
            console.log(token)
            console.log(refresh_token)
            res.send({ message: "LOGIN SUCCESSFULL", token, refresh_token })
        } else {
            res.send("LOGIN FAILED")
        }
    })
})

//LOGOUT ( --------------------------------------->


UserRouter.get("/logout",authenticate, (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    console.log(token)
    const blacklisted_data = JSON.parse(fs.readFileSync("./blacklist.json", "utf-8"))
    blacklisted_data.push(token)
    console.log(blacklisted_data)
    fs.writeFileSync("./blacklist.json", JSON.stringify(blacklisted_data))
    res.send("SUCCESSFULLY LOG OUT USER :-)   PLEASE VISIT AGAIN ")
})


// GOLDRATE ( --------------------------------------->


UserRouter.get("/goldrate", authenticate, (req, res) => {
    try {
        res.send("HERE YOU CAN GET YOUR ALL THE GOLD RATES :-)   THANKS FOR VISITING ")
        console.log("goldrates")

    } catch (error) {
        console.log(error)

    }


})


// USERSTATS  ( --------------------------------------->

UserRouter.get("/userstats",authenticate,authorise(["manager"]),(req,res)=>{
    res.send("HERE YOU CAN GET YOUR USERSTATES")
})



// GETNEWTOKEN  ( --------------------------------------->

UserRouter.get("/getnewtoken",(req,res)=>{
    const refresh_token = req.headers.authorization?.split(" ")[1]
    console.log(refresh_token)
    if(!refresh_token){
        res.send("USER NEED TO LOGIN AGAIN")
    }else{
        jwt.verify(refresh_token,"refresh",function (err,decoded){
            if(err){
                res.send({"message":"LOGIN FIRST","err":err.message})
                console.log(err)
            }else{
                console.log(decoded)
                const token = jwt.sign({userID:decoded.userID},"normal",{expiresIn:"60s"})
                console.log(token)
                res.send({message:"LOGIN DONE",token})
            }
        })
    }
})




// ( ----------------------------------------------------------------------------------------------------->








module.exports = {
    UserRouter,
};
