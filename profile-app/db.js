const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/JourneySyncDB";

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("✅ MongoDB connected successfully!");
    } catch (err) {
        console.error("❌ MongoDB connection error:", err);
        process.exit(1); // Exit process with failure
    }
};

// Connection event listeners
mongoose.connection.on("disconnected", () => console.log("⚠️ MongoDB disconnected!"));
mongoose.connection.on("reconnected", () => console.log("🔄 MongoDB reconnected!"));

connectDB();

module.exports = mongoose;
