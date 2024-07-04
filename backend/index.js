// Importing the route handlers

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectToMongo = require("./db").db;
const app = express();
app.use(cors());
// Connect to MongoDB
connectToMongo();

// Middleware to parse URL-encoded bodies
app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ limit: "5mb", extended: true }));

//User Routes
const userProfileRoutes = require("./routes/UserProfileData/UserData");
const authRoute = require("./routes/Authentication/Auth");
const userRoute = require("./routes/getUser");
const validateRoute = require("./routes/Authentication/verify");
const passwordResetRoute = require("./routes/password/resetPassword");
const startRoute = require("./routes/wakingServer");
const tr101 = require("./routes/UserProfileData/Training1");
const tr102 = require("./routes/UserProfileData/Training2");
const tr103 = require("./routes/UserProfileData/Training3");
const tr104 = require("./routes/UserProfileData/Training4");
const placementData = require("./routes/UserProfileData/PlacementData");
const adminControl = require("./routes/adminControlRoutes/adminControl");
const test = require("./routes/test.js");
const certificate=require('./routes/getCertificate.js')

app.use("/api/userprofiles", userProfileRoutes);
app.use("/api/tr101", tr101);
app.use("/api/tr102", tr102);
app.use("/api/tr103", tr103);
app.use("/api/tr104", tr104);
app.use("/api/placement", placementData);
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/validate", validateRoute);
app.use("/api/password", passwordResetRoute);
app.use("/api/admin", adminControl);
app.use("/api/test", test);
app.use("/api/certificate", certificate);
// Start the server
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});
// module.exports = app
