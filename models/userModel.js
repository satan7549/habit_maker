const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Define the user schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "please enter your name"],
    },
    email: {
        type: String,
        required: [true, "please enter email"],
        unique: true,
        validate: [validator.isEmail, "please enter a valid email"],
    },
    password: {
        type: String,
        required: [true, "please enter a password"],
        select: false,
        minLength: [6, "password should be greater than 6 characters"],
    },
    photo: {
        // id: {
        //     type: String,
        //     required: true,
        // },
        secure_url: {
            type: String,
            default:
                "https://eliaslealblog.files.wordpress.com/2014/03/user-200.png?w=700",
            required: true,
        },
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

// Method to generate a JWT token for the user
userSchema.methods.getjwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_SECRET_KEY_EXPIRE,
    });
};

// Method to compare the user's password with a provided password
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Create the User model
const UserModel = mongoose.model("user", userSchema);

//export the user Model
module.exports = UserModel;
