const mongoose = require("mongoose");

const wineReveiw = new mongoose.Schema({
    rName:String,
    mString:String,
})

const wRExported=mongoose.model("wRExported", wineReveiw);

module.exports=wRExported;