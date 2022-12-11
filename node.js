// express
// method-override
// ejs
// mongoose

const express=require("express");
const path = require("path");
const mongoose=require("mongoose");
const methodOverride= require("method-override");

const wSExported=require("./models/wineStructure");
const wRExported=require("./models/reviewStructure");

const app =express();

// set the view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs"); 
app.use(express.urlencoded({ extended: true }));
// end view engines set

// pass in the css stylesheet
app.use(express.static(path.join(__dirname,"public")))
// end pass in the css stylesheet

// database connection open and working
mongoose.set("strictQuery",false);
main().catch(err => console.log(err));
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wine')//wanted the actual address localhost didnt work
    .then(()=> {
      console.log("Mongo->Connection from node.js open, wine db should be created")
    })
    .catch(err=> {
      console.log(" Mongo-> the following error occured from the node.js file.")
      console.log(err)
      console.log("Mongo-> check if your running the mongod in the powershell")
    })
    // use `await mongoose.connect('mongodb://user:password@localhost:27017/helloWorld);` if your database has auth enabled
}
// end databases connection open and working

// dummy variables to confirm database operation
// const wineTest1 = new wSExported({
//     name:"Syrah",
//     region:"cheap",
// })
// const reviewTest1 = new wRExported({
//     rName:"Andrea",
//     mString:"Vinegary",
// })

// wineTest1.save();
// reviewTest1.save();
// console.log(wineTest1,reviewTest1);
// end dummy variables  to confirm database operation

// starting app requests
app.get("/", async(req,res)=>{
    const allWine= await wSExported.find({});
    res.render("dbCellar",{allWine});
})

app.get("/inputWine", (req, res)=>{
    res.render("inputWine");
    console.log("you initated a get request @/inputWine by hitting enter")
})
app.post("/inputWine", (req, res)=>{
    console.log("this wine is coming in");
    console.log(req.body)
    const newWine = new wSExported(req.body)
    newWine.save();
    res.redirect("/");
})
// // this gives me each wine
app.get("/:id", async(req, res)=>{
    // res.send("the contents of the database go here")
    const {id}=req.params;
    const wine = await wSExported.findById(id);
    const reviews =await wRExported.find({});
    console.log(wine);
    res.render("winePage", {wine, reviews})
})

app.get("/:id/inputWineReview", async(req, res)=>{
    const {id}=req.params;
    const wine = await wSExported.findById(id);
    res.render("inputWineReview", {wine})
})

app.post("/:id/inputWineReview", (req, res)=>{
    console.log("omg this review is coming in strong");
    console.log(req.body)
    const newReview = new wRExported(req.body)
    newReview.save();
    res.redirect("/")
    // res.send("a Vino 'experts' opinion was just submited");
})


app.get("/:id1/:id2", async(req, res)=>{
    const {id1}=req.params;
    const {id2}=req.params;
    const wine = await wSExported.findById(id1);
    const review = await wRExported.findById(id2);
    res.render("eachReview", {wine,review})
})
app.post("/:id1/:id2", async(req, res)=>{
    const {id2}=req.params;
    const deleteEntry = await wRExported.findByIdAndDelete(id2)
    res.redirect("/")
})

// .........................................................
app.get("/editReview/:id1/:id2", async(req, res)=>{
    // res.send("this is checking from edit get")
    const {id1}=req.params;
    const {id2}=req.params;
    const wine = await wSExported.findById(id1);
    const review = await wRExported.findById(id2);
    console.log(review);
    res.render("editReview", {wine, review})
})

// // // // .........................................................
app.post("/editReview/:id1/:id2",async(req,res)=>{
    console.log(req.body);
    // const {id1}=req.params;
    const {id2}=req.params;
    await wRExported.findByIdAndUpdate(id2, req.body, {runValidators: true})
    res.redirect("/")
})


  

  
app.listen(3000, ()=>{
    console.log("app listening on port 3000")
})