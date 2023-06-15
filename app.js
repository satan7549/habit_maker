const express = require("express");
// const cors = require("cors");
const app = express();
// const ErrorHandlerMiddleware = require("./middleware/error");

// app.use(
//   cors({
//     origin: "*",
//   })
// );

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello");
});

/* import all routes */
// const movie = require("./routes/movie.route");

// app.use("/movie", movie);

// Middleware for Errors
// app.use(ErrorHandlerMiddleware);

module.exports = app;