const mongoose = require('mongoose')

const experienceSchema = new mongoose.Schema({

title : {
    type : String,
    required: true,
    trim: true
},
location : {
    type:String,
    required: true
}, 
description:{
    type:String,
    required: true
},
photos : {
    type : String // This is going to be the URL of the images 
},
date:{
    type : Date,
    required: true
},
createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'User', // referencia al usuario que creo la experiencia 
    required :true
}


}, {timestamps : true});

module.exports = mongoose.model('Experience', experienceSchema)