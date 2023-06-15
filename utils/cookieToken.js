const cookieToken = async (res, stausCode, user) => {
    const token = await user.getjwtToken();

    const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        sameSite: "Lax",
        secure: false,
    };
    user.password = undefined;
    res.setHeader("Authorization", `Bearer ${token}`);
    res.status(stausCode).cookie("token", token, options).json({
        message: "success",
        success: true,
        user,
        token,
      });
};

module.exports = cookieToken;