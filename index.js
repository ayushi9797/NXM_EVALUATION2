const mongoose = require("mongoose");
const express = require("express");
const { UserRouter } = require("./router/userrouter");
const { connections } = require("./config/db");


const app = express();
app.use(express.json());





app.use("/",UserRouter)

app.get("/",(req,res)=>{
    res.send("home route index page")
})






app.listen(process.env.port, async () => {
    try {
        await connections;
        console.log(`connected to database successfully ${process.env.port}`);
    } catch (err) {
        console.log(err);
    }
});