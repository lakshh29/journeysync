const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const busRoutes = require("./routes/busRoutes");
require("dotenv").config();

// Initialize App
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database Connection
connectDB().then(() => {

    app.use("/api/bus", busRoutes);

    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
}).catch((error) => {
    console.error("❌ Server failed to start:", error);
});



