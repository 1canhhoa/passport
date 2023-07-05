const mongoose = require("mongoose")

const Schema = mongoose.Schema;
// const ObjectId = Schema.ObjectId;

const authentication = new Schema({

    username:{
      type:String
    },
    password:{
      type:String
    },
    firstName:{
      type:String,
    },
    lastName: {
      type:String,
    },
    idSocial:{
        type:String
    },
    photo:{
      type:String
    },
    authType:{
        type:String,
        default:"local"
    },

},{ collection :"data1" });
const MyAuthen = mongoose.model('authens', authentication);
module.exports ={MyAuthen}
