const mongoose = require("mongoose");

const wineStructure = new mongoose.Schema({
    name:String,
    region:String,
})

const wSExported=mongoose.model("wSExported", wineStructure);

module.exports=wSExported;


