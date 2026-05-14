const express = require("express");
const cors = require("cors");
const axios = require("axios");
const stringSimilarity = require("string-similarity");
require("dotenv").config(); // To store API keys safely in .env

const app = express();
app.use(express.json());
app.use(cors());

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || "YOUR_GOOGLE_MAPS_API_KEY"; 

const responses = [
    { pattern: "hello", reply: "Hello! How can I assist you with public transit information?" },
    { pattern: "bus schedule", reply: "You can check the latest bus schedules at [your website link]." },
    { pattern: "ticket price", reply: "Please provide your starting point and destination." },
    { pattern: "thank you", reply: "You're welcome! Have a great journey! 😊" },
    { pattern: "nearest bus stop", reply: "Please share your current location, and I’ll find the nearest bus stop for you." },
    { pattern: "how are you", reply: "I'm just a bot, but I'm here to help you! 😊" },
    { pattern: "your name", reply: "I'm JourneySync, your public transit assistant! 🚍" },
    { pattern: "weather", reply: "I can't check the weather yet, but you can visit weather.com!" }
];

// Function to find the best matching response
const findBestResponse = (message) => {
    let bestMatch = { reply: "I didn't understand that. Can you rephrase?", similarity: 0 };

    responses.forEach(resObj => {
        const similarity = stringSimilarity.compareTwoStrings(message, resObj.pattern);
        if (similarity > bestMatch.similarity) {
            bestMatch = { reply: resObj.reply, similarity };
        }
    });

    return bestMatch.reply;
};

// Function to get the nearest bus stop using Google Maps API
const getNearestBusStop = async (location) => {
    try {
        const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=bus+stop+in+${location}&key=${GOOGLE_MAPS_API_KEY}`;
        const response = await axios.get(url);
        return response.data.results[0]?.name || "No bus stops found in this area.";
    } catch (error) {
        return "Couldn't fetch bus stops. Please try again.";
    }
};

// Function to calculate ticket price based on distance
const getTicketPrice = async (source, destination) => {
    try {
        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${source}&destinations=${destination}&key=${GOOGLE_MAPS_API_KEY}`;
        const response = await axios.get(url);
        const distance = response.data.rows[0].elements[0].distance.value / 1000; // Convert meters to km
        return `The estimated ticket price for ${distance.toFixed(1)} km is ₹${(distance * 2).toFixed(2)}.`;
    } catch (error) {
        return "Couldn't calculate the price. Please try again.";
    }
};

// Chat endpoint
app.post("/chat", async (req, res) => {
    const userMessage = req.body.message ? req.body.message.toLowerCase() : "";

    if (!userMessage) {
        return res.json({ reply: "Please type something to continue the chat." });
    }

    let botReply = findBestResponse(userMessage);

    if (userMessage.includes("nearest bus stop")) {
        const location = userMessage.split("in ")[1] || "unknown";
        botReply = await getNearestBusStop(location);
    }

    if (userMessage.includes("ticket price")) {
        const parts = userMessage.split("to ");
        const source = parts[0]?.replace("ticket price from ", "").trim();
        const destination = parts[1]?.trim();

        if (source && destination) {
            botReply = await getTicketPrice(source, destination);
        } else {
            botReply = "Please specify both starting point and destination.";
        }
    }

    res.json({ reply: botReply });
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
