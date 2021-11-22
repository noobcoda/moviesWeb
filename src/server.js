const express = require("express");
const app = express();
const port = 23000;
var path = require("path");
const movieRouter = require("./routes/movies.js");
const apiRouter = require("./routes/api.js");
app.use(express.urlencoded({ extended: false })); //allows us to use all different parameters inside our form using req.body
app.use(express.json());

app.use("/movies", movieRouter); //every single route we create in this movie router comes after /movies in url

app.use("/api",apiRouter);

app.get("/",(req,res)=>{
    //const movies = CSVToJSON();
    //res.sendFile(path.join(__dirname,"public/index.html"));
    res.sendFile(path.join(__dirname,"public/index.html"));
})

app.listen(port,()=>{
    console.log("App listening at http://localhost:${port}")
})
