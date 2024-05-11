const mongoose=require("mongoose");


const EventSchema=new mongoose.Schema({
    name: {
        type: String,
        required: true,
      },
      category: {
        type: String,
        required: true,
      },
      time: {
        type: String,
        required: true,
      },
      location: {
        type: String,
        required: true,
      },
      district: {
        type: String,
        required: true,
      },
      venue: {
        type: String,
        required: true,
      },
      desc: {
        type: String,
        required: true,
      },
      organizer: {
        type: String,
        required: true,
      },
      contact: {
        type: String,
        required: true,
      },
      person: {
        type: String,
        required: true,
      },
      mode: {
        type: String,
        required: true,
      },
      college: {
        type: String,
        required: true,
      },
      eventid: {
        type: String,
        required: true
      },
      ticketprice: {
        type: Number,
        required: true
      },
      date:{
        type:String,
        required: true
      }
});

const Event=mongoose.model("eventDetail",EventSchema);
module.exports=Event;