const mongoose = require("mongoose");

const refreshTokenSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    tokenHash: { type: String, required: true },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 } //  TTL INDEX
    },
    sessionExpiresAt: { type: Date, required: true },
    isRevoked: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("RefreshToken", refreshTokenSchema);