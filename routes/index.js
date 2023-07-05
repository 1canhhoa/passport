var express = require('express');
var passport = require("passport")
require ('../middleware1/passport')
const jwt = require("jsonwebtoken")
const homeController = require("../controller/homeController");
const {MyAuthen} = require('../models/authentication');
var router = express.Router();


/* GET home page. */
// thứ tự chạy 14255
router.get("/auth/facebook",passport.authenticate("facebook"))
router.get('/auth/facebook/callback',
  passport.authenticate('facebook'),
  async(req, res,next) => {
    console.log("req.user",req.user)
    console.log("2")

   await MyAuthen.findOne({ idSocial: req.user._id })
    .then(data =>{
        if(data){
          console.log(data,"taikhoan đã có trong csdl")
          return res.redirect("/home")
        }
        else{
          MyAuthen.create({
            idSocial:req.user._id,
            firstName:req.user.firstName,
            lastName:req.user.lastName,
            authType:req.user.authType
          })
          console.log( data,"đã lưu tài khoản vào csdl")
          return res.json('đã lưu tài khoản vào csdl');
        }
    })
    .catch(err=>next(err))
  });
  // ----------------------------------------------------------------------------------------
  router.get('/', function(req, res, next) {
    // req.session.destroy();
    res.render('logup.ejs');
  });
  router.get('/home', function(req, res, next) {
    if(!req.user) {return res.redirect("/login")}
    console.log("req.session",req.session)
    res.render("home.ejs",{data:req.session})
  });
  router.get('/logup', function(req, res, next) {
    res.render('logup.ejs');
  });
  router.get("/login",(req,res)=>res.render("login.ejs"))
  router.get("/logout",(req,res)=>{
    req.session.destroy(),
    res.json("da logout thanh cong")})


  router.get("/pagination",(req,res)=>{
    if(!req.user){res.json("ko the truy cap trang nay")}
    else{
      res.json("đây là trang pagination")
    }
  })
  // ----------------------------------------------------------------------------------------
  router.get('/auth/google', passport.authenticate('google'));
  router.get('/auth/google/callback',
  passport.authenticate('google'),
  function(req, res,next) {
    MyAuthen.findOne({idSocial:req.user._id})
    .then(data=>{
      if(data){
        console.log("người dùng đã tồn tại trong csdl mời đăng nhập")
        res.redirect("/home")
      }else{
        MyAuthen.create({
          idSocial: req.user._id,
          firstName:req.user.firstName,
          lastName:req.user.lastName,
          photo:    req.user.photo,
          authType: req.user.authType
        })
        res.json("đã thêm người dùng này vào trong ccsdl")
      }
    }).catch(err=>next(err))
  });


router.post("/signup",homeController.signup)
router.post("/userpass", passport.authenticate("local"),(req,res)=>{
  if(req.user.username) res.json({
    message:"dang nhap thanh cong",
    check:true
  })
  else res.json({
    message:req.user,
    check:false
  })
})


module.exports = router;
