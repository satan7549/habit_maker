const BigPromise = require("../middleware/Bigpromise");
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const cookieToken = require("../utils/cookieToken");
const CustomError = require("../utils/CustomError");
const mailHelper = require("../utils/emailHelper");


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

//Logout User
const logout = BigPromise(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
        sameSite: "Lax",
        secure: false,
    });
    res.status(200).json({
        message: "Logout success",
    });
});


const forgotPassword = BigPromise(async (req, res, next) => {
    const { email } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
        return next(new CustomError("Email not found", 400));
    }
    const forgotToken = await user.getForgotPasswordToken();
    ////////////////////////////////////////
    await user.save({ validateBeforeSave: false });
    ////////////////////////////////////////

    const resetUrl = `http://localhost:5173/password/reset/${forgotToken}`;
    const resetButton = `<a href="${resetUrl}" "style="background-color: #007bff; 
    color: #fff; 
    padding: 10px 20px; 
    text-decoration: none; 
    border-radius: 5px;">Reset Password</a>`;

    const message = `
      <p>Click the following button to reset your password:</p>
      ${resetButton}
    `;
    try {
        await mailHelper({
            email,
            subject: "ShopZilla - password reset email",
            message,
        });
        res.status(200).json({
            message: "email send successfully",
        });
    } catch (error) {
        user.forgotPasswardToken = undefined;
        user.forgotPasswardExpiry = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new CustomError(error.message, 500));
    }
});


module.exports = {
    registerUser,
    userLogin,
    logout,
    forgotPassword
};
