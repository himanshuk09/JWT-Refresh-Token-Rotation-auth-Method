const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const RefreshToken = require("../models/RefreshToken");
const crypto = require("crypto");
const parseTimeToMs = require("../utils/time.util");

//m|h|d
const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: process.env.JWT_ACCESS_EXPIRES }
    );
};

const generateRefreshToken = () => {
    return crypto.randomBytes(64).toString("hex");
};

exports.login = async (req, res) => {
    const { phone } = req.body;

    let user = await User.findOne({ phone });

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not registered"
        });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken();
    const tokenHash = await bcrypt.hash(refreshToken, 10);


    const refreshExpiry = new Date(
        Date.now() + parseTimeToMs(process.env.JWT_REFRESH_EXPIRES)
    );

    const sessionExpiry = new Date(
        Date.now() + parseTimeToMs(process.env.JWT_SESSION_MAX_AGE)
    );


    await RefreshToken.create({
        userId: user._id,
        tokenHash,
        expiresAt: refreshExpiry,
        sessionExpiresAt: sessionExpiry
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,// for local set false
        sameSite: "strict"
    });

    res.json({ accessToken });
};

exports.refresh = async (req, res) => {
    const { refreshToken } = req.cookies;

    if (!refreshToken) return res.status(401).json({ message: "No token" });

    const tokens = await RefreshToken.find({ isRevoked: false });

    let matchedToken = null;

    for (let token of tokens) {
        const isMatch = await bcrypt.compare(refreshToken, token.tokenHash);
        if (isMatch) {
            matchedToken = token;
            break;
        }
    }

    if (!matchedToken)
        return res.status(403).json({ message: "Invalid token" });

    //  REUSE DETECTION
    if (matchedToken.isRevoked) {

        console.log(" Refresh token reuse detected");

        // Revoke ALL tokens for that user
        await RefreshToken.updateMany(
            { userId: matchedToken.userId },
            { isRevoked: true }
        );

        return res.status(403).json({
            message: "Refresh token reuse detected. All sessions revoked."
        });
    }

    if (matchedToken.expiresAt < new Date())
        return res.status(403).json({ message: "Refresh expired" });

    if (matchedToken.sessionExpiresAt < new Date())
        return res.status(403).json({ message: "Session expired" });

    // ROTATION
    matchedToken.isRevoked = true;
    await matchedToken.save();

    const user = await User.findById(matchedToken.userId);

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken();
    const newHash = await bcrypt.hash(newRefreshToken, 10);


    const refreshExpiry = new Date(
        Date.now() + parseTimeToMs(process.env.JWT_REFRESH_EXPIRES)
    );

    await RefreshToken.create({
        userId: user._id,
        tokenHash: newHash,
        expiresAt: refreshExpiry,
        sessionExpiresAt: matchedToken.sessionExpiresAt
    });

    res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict"
    });

    res.json({ accessToken: newAccessToken });
};

exports.logout = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;

        if (!refreshToken) {
            return res.status(200).json({
                success: true,
                message: "Logout successful"
            });
        }

        const tokens = await RefreshToken.find({ isRevoked: false });

        for (let token of tokens) {
            const isMatch = await bcrypt.compare(refreshToken, token.tokenHash);
            if (isMatch) {
                token.isRevoked = true;
                await token.save();
                break;
            }
        }

        res.clearCookie("refreshToken");

        return res.status(200).json({
            success: true,
            message: "Logout successful"
        });

    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

exports.register = async (req, res) => {
    try {
        const { phone, role } = req.body;

        if (!phone) {
            return res.status(400).json({
                success: false,
                message: "Phone is required"
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ phone });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        const user = await User.create({
            phone,
            role: role || "user"
        });

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: user
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

