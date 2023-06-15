const app = require("./app");
const dotenv = require("dotenv");
dotenv.config();
const ConnectDB = require("./configs/db.connect");

/*App connect to data base */
const port = process.env.PORT || 8090;

process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to uncaught exception`);
    process.exit(1);
});

const server = app.listen(port, async () => {
    await ConnectDB();
    console.log(`Server running on http://localhost:${port}`);
});

process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Unhabled promise rejection`);
    server.close(() => {
        process.exit(1);
    });
});