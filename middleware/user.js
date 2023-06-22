import User from "../model/user.js";
import BigPromise from "./Bigpromise.js";
import CustomError from "../util/customError.js";
import jwt from "jsonwebtoken";

const isLoggedIn = BigPromise(async (req, res, next) => {
    console.log("login req headers", req.header("Authorization"));
    const token =
        req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");
    console.log("token", token);
    if (!token) {
        return next(new CustomError("login first", 401));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findOne({ _id: decoded.id });
    next();
});

module.exports = isLoggedIn