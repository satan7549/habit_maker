const express = require("express");
const userRoutes = require("./routes/user.route");
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
app.use("/user", userRoutes);


// Middleware for Errors
// app.use(ErrorHandlerMiddleware);

module.exports = app;