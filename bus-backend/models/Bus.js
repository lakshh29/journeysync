const mongoose = require("mongoose");

const BusSchema = new mongoose.Schema({
  name: { type: String, required: true },
  route: { type: String, required: true },
  seats: { type: Number, required: true },
});

const Bus = mongoose.model("Bus", BusSchema);
module.exports = Bus;
