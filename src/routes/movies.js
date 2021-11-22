const fs = require("fs");
const express = require("express");
const router = express.Router();
var path = require("path");

//see server.js, everything is added to /articles
router.get("/new",(req,res) => { 
    res.sendFile(path.join(__dirname,"../public/html/newMovie.html"));
})

router.post("/",(req,res)=>{
    try{
        //need to add to our json file
        JSONMovies = fs.readFileSync("movieSubs.json");
        JSONMoviesObj = JSON.parse(JSONMovies);
        console.log(JSONMoviesObj);

        //check if the regex matches
        /**
            * checking for regex
                 */ 

        // if (!(req.body.movieLink.match('/https?:\/\/(www\.)?imdb.com'))){
        //     //throw an error--back to the new movies page
        //     //alert("Movie link is invalid!");
        //     throw "Movie link is invalid!";
        // }

        JSONMoviesObj.push({
            id:`${JSONMoviesObj[JSONMoviesObj.length-1].id + 1}`,
            director_name: req.body.director,
            actor_2_name: req.body.actor2,
            genres: req.body.genres,
            actor_1_name: req.body.actor1,
            movie_title: req.body.title,
            actor_3_name: req.body.actor3,
            plot_keywords: req.body.plot,
            movie_imdb_link: req.body.movieLink
        })
        fs.writeFileSync("movieSubs.json",JSON.stringify(JSONMoviesObj));
        res.redirect("/"); //redirect to home page; should see new movie
    } catch (e){
        console.error(e);
        res.redirect("movies/new"); //reload the page
    }
})

/**
 * allows router to be used by other parts of our program
 * e.g. see server.js; we can now just use router
 */
module.exports = router; 
