const mongoose = require("mongoose");


var emailSchema = new mongoose.Schema({
    date:{
        type:Date,
        default:Date.now(),
        trim:true
    },

    name:{
            type:String,
            require:true
    },
    emailFrom:{
        type:String,
        require:true
    },
    emailTo:{
        type:String,
        require:true
    },
    subject:{
        type:String,
        
    },
    content:{
        type:String,
        require:true
    },
    attachment:[{type:String}],
        
   
    status:{
            type:Boolean
        },
    error:{
        type:String
    }
});

module.exports = mongoose.model("Email", emailSchema);