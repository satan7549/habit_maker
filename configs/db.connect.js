const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const ConnectDB = () => {
    mongoose
        .connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then((data) => {
            console.log(`MongoDB connected with server ${data.connection.host}`);
        });
};

module.exports = ConnectDB;
