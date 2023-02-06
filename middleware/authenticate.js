const authorise = (array_role)=>{
    console.log(array_role)
    return (req,res,next)=>{
        const userrole = req.body.userrole
        if(array_role.includes(userrole)){
            next()
        }else{
            res.send("NOT AUTHORISED")
        }
    }
}

module.exports={
    authorise,
}