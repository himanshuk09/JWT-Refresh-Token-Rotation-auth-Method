require("dotenv").config({ quiet: true });
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"));

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/test", require("./routes/test.routes"));
app.listen(process.env.PORT, () =>
    console.log(`Server running on port ${process.env.PORT}`)
);

console.log("JWT_ACCESS_EXPIRES =", process.env.JWT_ACCESS_EXPIRES);
console.log("TYPE =", typeof process.env.JWT_ACCESS_EXPIRES);