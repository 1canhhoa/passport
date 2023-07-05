const passport = require("passport");
const {MyAuthen} = require('../models/authentication');

const bcrypt = require("bcryptjs")
require('dotenv').config();








let LocalStrategy = require("passport-local").Strategy
passport.use(new LocalStrategy({
  usernameField: "username",
  passwordField: "password"
},
  async(username, password, done)=> {
    let user = await MyAuthen.findOne({ username: username }) 
      if (!user) { return done(null,{message:"username ko chinh xac"}); }
      const valid = await bcrypt.compare(password,user.password)
      if (!valid) { return done(null, {message:"mật khẩu ko chính xác"}); }
      return done(null, user);
  }
));






const GoogleStrategy = require('passport-google-oauth20');
passport.use(new GoogleStrategy({
    clientID: "681318167280-mm8sklcrdrqtj8n57dlfp0jsa8qmm9og.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: 'https://93c9-2001-ee0-49da-e830-f443-860-bc5d-b08b.ngrok-free.app/auth/google/callback',
    scope: [ 'profile' ],
    state: true
  },
  function (accessToken, refreshToken, profile, cb) {
    console.log("profile1",profile)
    let setIntoSession = {
      _id:profile.id,
      firstName:profile.name.givenName,
      lastName:profile.name.familyName,
      authType:profile.provider,
      photo:profile.photos[0].value
    }
    console.log("profile",setIntoSession)
    return cb(null,setIntoSession)
  }
));

const FacebookStrategy = require("passport-facebook").Strategy
passport.use(new FacebookStrategy({
    clientID: "984636182672876", // connect đến app trên developer.facebook.com
    clientSecret:"026e5f638bbfad8929f4becad82cc6b6",
    callbackURL: "https://93c9-2001-ee0-49da-e830-f443-860-bc5d-b08b.ngrok-free.app/auth/facebook/callback",
    profileFields:["name","photos","displayName","emails","gender","profileUrl"]
  },
  async(accessToken, refreshToken, profile, cb) => {
    console.log("profile.id",profile)
    let setIntoSession = {
      _id:profile.id,
      firstName:profile.name.givenName,
      lastName:profile.name.familyName,
      authType:profile.provider
    }
    return cb(null,setIntoSession)//profile này sẽ đc thêm vào session ở method serialization
  }
));