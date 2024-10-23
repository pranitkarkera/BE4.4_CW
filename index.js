require("dotenv").config();
const express = require('express')
const cors = require("cors");
const app = express()

const { initializeDatabase} = require("./db/db.connect")
const Movie = require("./models/movie.models");

app.use(cors())
app.use(express.json())

initializeDatabase();

// const newMovie = {
//     title: "New Movie",
//     releaseYear: 2023,
//     genre: ["Drama"],
//     director: "Aditya Roy Chopra",
//     actors: ["Actor1", "Actor2"],
//     language: "Hindi",
//     country: "India",
//     rating: 6.1,
//     plot: "A young man and woman fall in love on a Australia trip.",
//     awards: "IFA Filmfare Awards",
//     posterUrl: "https://example.com/new-poster1.jpg",
//     trailerUrl: "https://example.com/new-trailer1.mp4"
// }

async function createMovie(newMovie){
  try{
      const movie = new Movie(newMovie)
      const saveMovie = await movie.save()
      return saveMovie
  } catch(error) {
      throw error
  }
}

app.post('/movies', async(req, res)=> {
    try{
        const savedMovie = await createMovie(req.body)
        res.status(201).json({message: "Movie added successfully", movie: savedMovie})
    }catch(error){
        res.status(500).json({error: "Failed to add movie"})
    }
})

// find a movie with aparticular title

async function readMovieByTitle(movieTitle){
    try{
        const movie = await Movie.findOne({title: movieTitle})
        return movie
    } catch(error){
        throw error
    }
}

app.get('/movies/:title', async(req, res)=> {
    try{
        const movie = await readMovieByTitle(req.params.title)
        // console.log(movie)
        if(movie){
            res.json(movie)
        }else{
            res.status(404).json({error: "Movie not found"})
        }
    }catch(error){
        res.status(500).json({error: "Failed to fetch movie."})
    }
})

// to get all the movies in the database

async function readAllMovies(){
    try{
        const allMovie = await Movie.find()
        return allMovie
    } catch(error){
        throw error
    }
}

app.get('/movies', async(req, res) => {
    try{
        const movies = await readAllMovies()
        if(movies.length != 0){
            res.json(movies)
        }else{
            res.status(404).json({error: "No movies found"})
        }
    }catch(error){  
        res.status(500).json({error: "Failed to fetch movies"})
    }
})

//get movie by director name

async function readmovieByDirector(directorName){
    try{
        const movieByDirector = await Movie.find({director: directorName})
        return movieByDirector
    } catch(error){
        throw error
    }
}

app.get("/movies/director/:directorName", async(req, res) => {
    try{
        const movies = await readmovieByDirector(req.params.directorName)
        if(movies.length != 0){
            res.json(movies)
        }else{
            res.status(404).json({error: "movie not found"})
        }
    }catch(error){
        res.status(500).json({error: "Failed to fetch movies"})
    }
})

//get movie by genre name

async function readMovieByGenre(genreName){
    try{
        const movieByGenre = await Movie.find({genre: genreName})
        return movieByGenre
    } catch(error){
        throw error
    }
}

app.get('/movies/genre/:genreName', async(req, res) => {
    try{
        const movies = await readMovieByGenre(req.params.genreName)
        if(movies.length !=0){
            res.json(movies)
        }else{
            res.status(404).json({error: "movie not found"})
        }
    }catch(error){
        res.status(500).json({error: "Failed to fetch movies"})
    }
})

async function deleteMovie(movieId) {
    try{
        const deletedMovie = await Movie.findByIdAndDelete(movieId)
        return deletedMovie
    }catch(error){
        console.log(error)
    }
}

app.delete('/movies/:movieId', async(req, res) => {
    try{
        const movieDeleted = await deleteMovie(req.params.movieId)
        if(movieDeleted){
            res.status(200).json({message: "Movie deleted successfully"})
        }  
    }catch{
        res.status(500).json({error: "Failed to delete Movie"})
    }
})

async function updateMovie(movieId, dataToUpdate){
    try{
        const updatedMovie = await Movie.findByIdAndUpdate(movieId, dataToUpdate, {new: true})
        return updatedMovie
    } catch (error){
        console.log("Error in updating Movie rating", error)
    }
}

app.post('/movies/:movieId', async(req, res)=> {
    try{
        const updatedMovie = await updateMovie(req.params.movieId, req.body)
        if(updatedMovie){
            res.status(200).json({message: "Movie updated successfully", updatedMovie: updatedMovie})
        }else{
            res.status(404).json({error: "Movie not found"})
        }
    }catch(error){
        res.status(500).json({error: "Failed to update movie"})
    }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, ()=> {
    console.log(`Server is running on ${PORT}`)
})

