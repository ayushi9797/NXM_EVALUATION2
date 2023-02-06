const jwt = require("jsonwebtoken")
const fs = require ("fs")


const authenticate = (req,res,next)=>{
    const token = req.headers.authorization?.split(" ")[1];
    console.log(token);
    if(!token){
        res.send("NEED TO LOGIN AGAIN SORRY")
    }
    const blacklisted_data = JSON.parse(fs.readFileSync("./blacklist.json","utf-8"))
    console.log(blacklisted_data)
    if(blacklisted_data.includes(token)){
        return res.send("PLEASE LOGIN AGAIN")
    }

    jwt.verify(token,"normal",function (err,decoded){
        if(err){
            res.send({"MESSAGE":"LOGIN FIRST SOMETHING WENT WRONG",err:err.MESSAGE})
            console.log(err)
        }else{
            const userrole = decoded?.role
            req.body.userrole = userrole
            next();
        }
    })
}






module.exports={
    authenticate,

}