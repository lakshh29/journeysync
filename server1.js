const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "public")));

mongoose.connect("mongodb://localhost:27017/transitDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const BusSchema = new mongoose.Schema({
    bus_id: String,
    route_number: String,
    start_point: String,
    end_point: String,
    departure_time: String,
    arrival_time: String
});

const Bus = mongoose.model("Bus", BusSchema);

// API to get all buses
app.get("/buses", async (req, res) => {
    const buses = await Bus.find();
    res.json(buses);
});

// Open `busfinal.html`
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "busfinal1.html"));
});

app.listen(3000, () => console.log("Server running on port 3000"));
