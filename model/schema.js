const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    name:String,
    email:String,
    password:String,
    role:{type:String,enum:["user","manager"],default:"user"}
    
});

const UserModel = mongoose.model("user", userSchema);

module.exports = {
    UserModel,
};



// {"name":"ayu","email":"ayu12@gmail.com","password":"1234","role":"manager"}