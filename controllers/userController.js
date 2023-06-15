const BigPromise = require("../middleware/Bigpromise");
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const cookieToken = require("../utils/cookieToken");


// Register User
const registerUser = BigPromise(async (req, res, next) => {
    const { name, email, password } = req.body;


    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "Please fill the Credentials",
        });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 5);

    // Create a new user
    const user = await userModel.create({
        name,
        email,
        password: hashedPassword,
    });

    // Send token in the response
    cookieToken(res, 201, user);
});

// Login User
const userLogin = BigPromise(async (req, res, next) => {
    const { email, password } = req.body;

    // If Email or Password is not provided
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Please fill in both Email and Password",
        });
    }

    // Find the user by email
    const userExists = await userModel.findOne({ email }).select("password");

    if (!userExists) {
        return res.status(401).json({
            success: false,
            message: "User Not Exists! You have to Sign Up",
        });
    }

    // Compare the provided password with the stored password
    const isPassword = await userExists.comparePassword(password);

    if (!isPassword) {
        return res.status(401).json({
            success: false,
            message: "Invalid Email or Password",
        });
    }

    // Send token in the response
    cookieToken(res, 200, userExists);
});

// // Get All Users
// const getAllUsers = catchAsyncErrors(async (req, res, next) => {
//     try {
//         res.status(200).json({
//             success: true,
//             message: "sucess route complete",
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: "Error retrieving users",
//         });
//     }
// });

module.exports = {
    // getAllUsers,
    registerUser,
    userLogin,
};
