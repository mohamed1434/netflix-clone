const User = require("../models/UserModel");

module.exports.addToLikedMovies = async (req, res) => {
  try {
    const { email, data } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      const { likedMovies } = user;
      const movieAlreadyLiked = likedMovies.find(({ id }) => id === data.id);
      if (!movieAlreadyLiked) {
        await User.findByIdAndUpdate(
          user._id,
          {
            likedMovies: [...user.likedMovies, data],
          },
          { new: true }
        );
      } else return res.json({ message: "Movie already added to my list" });
    } else await User.create({ email, likedMovies: [data] });
    return res.json({ message: "Movie added to my list" });
  } catch (error) {
    return res.json({ message: "Error adding movie" });
  }
};

module.exports.getLikedMovies = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });
    if (user) {
      res.json({ message: "Success", movies: user.likedMovies });
    } else {
      return res.json({ message: "User with given email not found" });
    }
  } catch (error) {
    return res.json({ message: "Error getting liked movies" });
  }
};

module.exports.deleteLikedMovie = async (req, res) => {
  try {
    const { email, movieId } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      const movies = user.likedMovies;
      const movieIndex = movies.findIndex(({ id }) => id === movieId);
      if (movieIndex === -1) {
        res.status(400).send({ msg: "Movie not found." });
      }
      const updatedMovies = movies.filter(({ id }) => id !== movieId);
      await User.findByIdAndUpdate(
        user._id,
        {
          likedMovies: updatedMovies,
        },
        { new: true }
      );
      return res.json({ msg: "Movie successfully removed.", movies: updatedMovies });
    } else {
      return res.json({ msg: "User with given email not found." });
    }
  } catch (error) {
    return res.json({ msg: "Error removing movie from the liked list" });
  }
};

