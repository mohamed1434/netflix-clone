import {
    configureStore,
    createAsyncThunk,
    createSlice,
  } from "@reduxjs/toolkit";
  import axios from "axios";
  import { API_KEY, TMDB_BASE_URL } from "../utils/constants";
  
  const initialState = {
    movies: [],
    genresLoaded: false,
    genres: [],
    movieTrailers: {}, //stroing movie trailers
  };
  
  export const getGenres = createAsyncThunk("netflix/genres", async () => {
    const {
      data: { genres },
    } = await axios.get(
      "https://api.themoviedb.org/3/genre/movie/list?api_key=3d39d6bfe362592e6aa293f01fbcf9b9"
    );
    return genres;
  });
  
  const createArrayFromRawData = (array, moviesArray, genres) => {
    console.log(array);
    array.forEach((movie) => {
      const movieGenres = [];
      movie.genre_ids.forEach((genre) => {
        const name = genres.find(({ id }) => id === genre);
        if (name) movieGenres.push(name.name);
      });
      if (movie.backdrop_path)
        moviesArray.push({
          id: movie.id,
          name: movie?.original_name ? movie.original_name : movie.original_title,
          image: movie.backdrop_path,
          genres: movieGenres.slice(0, 3),
        });
    });
  };
  
  const getRawData = async (api, genres, paging = false) => {
    const moviesArray = [];
    for (let i = 1; moviesArray.length < 60 && i < 10; i++) {
      const {
        data: { results },
      } = await axios.get(`${api}${paging ? `&page=${i}` : ""}`);
      createArrayFromRawData(results, moviesArray, genres);
    }
    return moviesArray;
  };
  
  export const fetchDataByGenre = createAsyncThunk(
    "netflix/genre",
    async ({ genre, type }, thunkAPI) => {
      const {
        netflix: { genres },
      } = thunkAPI.getState();
      return getRawData(
        `https://api.themoviedb.org/3/discover/${type}?api_key=${API_KEY}&with_genres=${genre}`,
        genres
      );
    }
  );
  
  export const fetchMovies = createAsyncThunk(
    "netflix/trending",
    async ({ type }, thunkAPI) => {
      const {
        netflix: { genres },
      } = thunkAPI.getState();
      return getRawData(
        `${TMDB_BASE_URL}/trending/${type}/week?api_key=${API_KEY}`,
        genres,
        true
      );
    }
  );

  export const fetchMovieTrailers = createAsyncThunk(
    "netflix/movieTrailers",
    async (movieId, thunkAPI) => {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}`
      );
      return response.data.results;
    }
  );
  
  
  export const getUsersLikedMovies = createAsyncThunk(
    "netflix/getLiked",
    async (email) => {
      const {
        data: { movies },
      } = await axios.get(`http://localhost:8000/user/liked/${email}`);
      return movies;
    }
  );
  
  export const removeMovieFromLiked = createAsyncThunk(
    "netflix/deleteLiked",
    async ({ movieId, email }) => {
      const {
        data: { movies },
      } = await axios.put("http://localhost:8000/user/delete", {
        email,
        movieId,
      });
      return movies;
    }
  );
  
  const NetflixSlice = createSlice({
    name: "Netflix",
    initialState,
    extraReducers: (builder) => {
      builder.addCase(getGenres.fulfilled, (state, action) => {
        state.genres = action.payload;
        state.genresLoaded = true;
      });
      builder.addCase(fetchMovies.fulfilled, (state, action) => {
        state.movies = action.payload;
      });
      builder.addCase(fetchDataByGenre.fulfilled, (state, action) => {
        state.movies = action.payload;
      });
      builder.addCase(getUsersLikedMovies.fulfilled, (state, action) => {
        state.movies = action.payload;
      });
      builder.addCase(removeMovieFromLiked.fulfilled, (state, action) => {
        state.movies = action.payload;
      });
      
      //Movie trailers
      builder.addCase(fetchMovieTrailers.fulfilled, (state, action) => {
        state.movieTrailers[action.meta.arg] = action.payload;
      });
      
    },
  });
  
  export const store = configureStore({
    reducer: {
      netflix: NetflixSlice.reducer,
    },
  });
  
  export const { setGenres, setMovies } = NetflixSlice.actions;