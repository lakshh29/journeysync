const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, minlength: 2 },
    email: { type: String, required: true, unique: true, trim: true },
    phone: { type: String, required: true, trim: true, minlength: 10, maxlength: 15 },
    dob: { type: Date, required: true }, // Date of Birth field
    gender: { type: String, required: true, enum: ["male", "female", "other"] }, // Gender with predefined options
}, { timestamps: true });

const Profile = mongoose.model("Profile", ProfileSchema);
module.exports = Profile;
