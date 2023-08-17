const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoutes = require("./routes/UserRoutes");
dotenv.config();

const PORT = 8000;

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(
    `mongodb+srv://mhamdoon4:txCGZePV1WtKhKwG@netflix-clone.zdyxqwx.mongodb.net/?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("DB connected");
  });

app.use("/user", userRoutes);

app.listen(PORT, console.log("Server started on port : ", PORT));
