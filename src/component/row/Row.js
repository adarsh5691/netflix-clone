import React, { useState, useEffect } from "react";
import YouTube from "react-youtube";
import axios from "../../axios";
import "./Row.css";
import movieTrailer from "movie-trailer";

const base_url = "https://image.tmdb.org/t/p/original/";
const opts = {
    height: "390",
    width: "100%",
    playerVars: {
        autoPlay: 1,
    },
};

function Row({ title, fetchUrl, isLargeRow }) {
    const [movies, setMovies] = useState([]);
    const [trailerUrl, setTrailerUrl] = useState("");
    // runs only once
    useEffect(() => {
        async function fetchData() {
            const request = await axios.get(fetchUrl);
            setMovies(request.data.results);
            return request;
        }
        fetchData();
    }, [fetchUrl]);


    const handleClick = (movie) => {
        
        movieTrailer(movie?.name ? movie?.name : movie?.title || "")
            .then((url) => {
                const urlParams = new URLSearchParams(new URL(url).search);
                if (trailerUrl === urlParams.get("v")) {
                    setTrailerUrl("");
                } else {
                    setTrailerUrl(urlParams.get("v"));
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <div className="row">
            <h2>{title}</h2>

            <div className="row__posters">
                {movies.map((movie) => {
                    return (
                        <img
                            key={movie.id}
                            onClick={() => handleClick(movie)}
                            className={`row__poster ${isLargeRow && "row__posterLarge"}`}
                            src={`${base_url}${isLargeRow ? movie.poster_path : movie.backdrop_path
                                }`}
                            alt={movie.name}
                        />
                    );
                })}
            </div>

            {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
        </div>
    );
}

export default Row;