const express = require("express");
const router = express.Router();
const fs = require("fs");


function CSVToJSON(){
    const csv = fs.readFileSync("movie_metadata_subset.csv").toString();
    //console.log(csv);
    var rows = csv.split("\r\n");
    var res = [];

    var headers = rows[0].split(",");
    //also add an id to the json object

    for (var i=1;i<rows.length;i++){ //start from 1 as first row are headers
        var jsonObj = {};
        var currRow = rows[i].split(",");
        jsonObj["id"] = i;
        for (var j=0; j<headers.length;j++){
            jsonObj[headers[j]] = currRow[j];
        }

        res.push(jsonObj);
    } 
    //console.log(res);
    fs.writeFileSync("movieSubs.json",JSON.stringify(res));
    return res;
}

//post methods are sent by the client to the server
router.get("/getMovies",(req,res)=>{
    if (fs.existsSync("movieSubs.json")){
        jsonMovies = fs.readFileSync("movieSubs.json");
    } else {
        jsonMovies = CSVToJSON();
    }
    console.log("About to send json...");
    res.send(jsonMovies);
    //res.json(JSON.stringify(jsonMovies));
})

router.get("/:id",async (req,res)=>{
    if (fs.existsSync("movieSubs.json")){
        jsonMovies = fs.readFileSync("movieSubs.json");
    } else {
        jsonMovies = CSVToJSON();
    }

    jsonMovies = JSON.parse(jsonMovies);
    var movieId = req.params.id;
    console.log("Received...");
    console.log(movieId);
    for (let i=0; i<jsonMovies.length;i++){
        console.log("Hey");
        if (jsonMovies[i]["id"] == movieId){
            console.log("Will send...");
            console.log(jsonMovies[i]);
            res.send(jsonMovies[i]);
            break;
        } 
    }
})

router.post("/deleteMovie",(req,res)=>{
    if (fs.existsSync("movieSubs.json")){
        jsonMovies = fs.readFileSync("movieSubs.json");
    } else {
        jsonMovies = CSVToJSON();
    }

    jsonMovies = JSON.parse(jsonMovies);
    for (let i=0;i<jsonMovies.length;i++){
        console.log(jsonMovies[i]);
        if (jsonMovies[i]["id"] == req.body["movieIdDel"]){
            jsonMovies.splice(i,1); //splice used instead of delete, as delete can cause gaps in array
            break;
        }
    }

    /**
     * rewrite json file
     */
     fs.writeFile("movieSubs.json",JSON.stringify(jsonMovies),function(err){
        if (err) throw err;
    });

})

router.post("/editMovie",(req,res)=>{
    /**
     * Find id of the movie in JSON object and replace
     */
    console.log(req.body);

     if (fs.existsSync("movieSubs.json")){
        jsonMovies = fs.readFileSync("movieSubs.json");
    } else {
        jsonMovies = CSVToJSON();
    }

    jsonMovies = JSON.parse(jsonMovies);
    for (let i=0;i<jsonMovies.length;i++){
        if (jsonMovies[i]["id"] == req.body["movieID"]){
            jsonMovies[i]["movie_title"] = req.body["title"];
            jsonMovies[i]["director_name"] = req.body["director"];
            jsonMovies[i]["actor_2_name"] = req.body["actor2"];
            jsonMovies[i]["genres"] = req.body["genres"];
            jsonMovies[i]["actor_1_name"] = req.body["actor1"];
            jsonMovies[i]["actor_3_name"] = req.body["actor3"];
            jsonMovies[i]["plot_keywords"] = req.body["keywords"];
            jsonMovies[i]["movie_imdb_link"] = req.body["movieLink"];
        }
    }

    /**
     * rewrite whole json file
     */

    fs.writeFile("movieSubs.json",JSON.stringify(jsonMovies),function(err){
        if (err) throw err;
    });

    res.redirect("/");
})

module.exports = router;