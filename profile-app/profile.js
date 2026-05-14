const express = require("express");
const cors = require("cors");
const mongoose = require("./db"); // Import MongoDB connection
const Profile = require("./models/Profile"); // Import Model

const app = express();
app.use(cors());
app.use(express.json()); // Parse JSON Requests

console.log("🔹 Server file executed!");

// ✅ Ensure MongoDB Connection Before Handling Requests
mongoose.connection.once("open", () => {
    console.log("✅ MongoDB Connection Established!");
});

mongoose.connection.on("error", (err) => {
    console.error("❌ MongoDB Connection Error:", err);
});

// ✅ Root Route to Check Server Status
app.get("/", (req, res) => {
    console.log("✅ Server check endpoint hit!");
    res.send("Server is running!");
});

// ✅ GET all profiles
app.get("/api/profile", async (req, res) => {
    try {
        console.log("🔹 GET request received for /api/profile (fetch all)");
        const profiles = await Profile.find();
        
        if (profiles.length === 0) {
            return res.status(404).json({ message: "No profiles found" });
        }

        res.json(profiles);
    } catch (error) {
        console.error("❌ Error fetching profiles:", error);
        res.status(500).json({ error: "Error fetching profiles" });
    }
});


// ✅ GET Profile by Email
app.get("/api/profile/:email", async (req, res) => {
    try {
        const userEmail = req.params.email;
        console.log(`🔹 GET request received for /api/profile/${userEmail}`);

        const profile = await Profile.findOne({ email: userEmail });
        if (!profile) {
            console.log("❌ Profile not found!");
            return res.status(404).json({ error: "Profile not found" });
        }

        console.log("✅ Profile found:", profile);
        res.json(profile);
    } catch (error) {
        console.error("❌ Error fetching profile:", error);
        res.status(500).json({ error: "Error fetching profile" });
    }
});

// ✅ POST Save Profile Data (Checks for Duplicates)
// ✅ POST Save Profile Data (Checks for Duplicates)
app.post("/api/profile", async (req, res) => {
    try {
        console.log("🔹 POST request received. Data:", req.body);

        const { name, email, phone, dob, gender} = req.body;
        if (!name || !email || !phone || !dob || !gender) {
            console.log("❌ Missing required fields!");
            return res.status(400).json({ error: "All fields are required" });
        }else {
            console.log("✅ All required fields have been provided.");}

        // ✅ Check if email already exists
        const existingProfile = await Profile.findOne({ email });
        if (existingProfile) {
            console.log("❌ Profile already exists!");
            return res.status(400).json({ error: "Profile with this email already exists" });
        }

        // ✅ Save new profile
        const newProfile = new Profile({ name, email, phone, dob, gender });
        await newProfile.save();

        console.log("✅ Profile saved successfully:", newProfile);

        // ✅ Fetch and send all profiles after saving
        const allProfiles = await Profile.find();
        res.status(201).json({ 
            message: "Profile saved successfully!", 
            data: newProfile,
            allUsers: allProfiles
        });

    } catch (error) {
        console.error("❌ Error saving profile:", error);
        res.status(500).json({ error: "Failed to save profile" });
    }
});


// ✅ Directly set the port to 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:3000`);
});
