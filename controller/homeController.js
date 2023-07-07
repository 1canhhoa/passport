
const {MyAuthen} = require("../models/authentication")
const bcrypt = require("bcryptjs")

let getData =async (req,res) =>{
    await MyAuthen.find({})
    .then(data=>{res.json(data),console.log("data",data)})
    .catch(err=>res.json(err))
}

let signup = async(req,res)=>{
    console.log(req.body)
    const {username,password,rppassword}=req.body
    if(password!=rppassword) {
        return res.json({
            check:false,
            message:"mật khẩu chưa khớp"
        })
    }
   let user = await MyAuthen.findOne({username:username})
    if(user) {
        console.log(user)
       res.json({
        check:false,
        message:"username đã tồn tại"
    })
    }else{
        const salt = await bcrypt.genSalt(10) 
        const passwordHash = await bcrypt.hash(password,salt)
        await MyAuthen.create({
            username:username,
            password:passwordHash
        })
            console.log("đã lưu user vào csdl")
            res.json({
                check:true,
                message:"them thanh coong"
            })
    }
}

module.exports={
    getData,signup
}