require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("MongoDB Connected"))
.catch(err => console.error("DB Connection Error:", err));

// Schema & Model
const passengerSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    age: Number,
    travelDate: String,
    paymentStatus: { type: String, default: "Pending" },
});

const Passenger = mongoose.model("Passenger", passengerSchema);

// API to Save Passenger Details
app.post("/passenger", async (req, res) => {
    try {
        const passenger = new Passenger(req.body);
        await passenger.save();
        res.status(201).json({ message: "Passenger details saved!" });
    } catch (error) {
        res.status(500).json({ message: "Error saving passenger details", error });
    }
});

// API to Get All Passenger Details
app.get("/passengers", async (req, res) => {
    try {
        const passengers = await Passenger.find();
        res.status(200).json(passengers);
    } catch (error) {
        res.status(500).json({ message: "Error fetching passenger details", error });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
