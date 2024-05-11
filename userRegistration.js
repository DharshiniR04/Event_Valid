const mongoose=require('mongoose');

const userRegistrationSchema = new mongoose.Schema({
     email:{
        type:String,
        required:true
     },
     participantid:{
        type:String,
        required:true
     },
     eventid:{
        type:String,
        required:true
     },
     name:{
        type:String,
        required:true
     },
     time:{
        type:String,
        required:true
     },
     img:{
       type:String,
       required:true
     },
     person:{
      type:Number,
      required:true
     },
     date:{
      type:String,
      required:true
     },
     bool:{
      type:String,
      required:true
     }
});


const userRegistration=mongoose.model("userRegister",userRegistrationSchema);
module.exports=userRegistration;