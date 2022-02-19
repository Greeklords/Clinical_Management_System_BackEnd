const mongoose=require('mongoose');

const Schema=mongoose.Schema;

const doctorSchema=new Schema({
    doctorname:{
        type:String,
        required: true
    },
   
    specialization:{
        type:String,
        required: true
    },


    date:{
        type:Date,
        required: true
    },

    charges:{
        type:Number,
        required: true
    },

    firstname:{
        type:String,
        required: true
    },

    lastname:{
        type:String,
        required: true
    },

    age:{
        type:Number,
        required: true
    },

    mobileno:{
        type:Number,
        required: true
    },

    address:{
        type:String,
        required: true
    }
})

const Doctor=mongoose.model("Doctor",doctorSchema);

module.exports=Doctor;