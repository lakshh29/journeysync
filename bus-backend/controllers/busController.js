const Bus = require("../models/Bus");

// Get all buses
const getBuses = async (req, res) => {
  try {
    const buses = await Bus.find();
    res.status(200).json(buses);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch buses" });
  }
};

// Get a single bus by ID
const getBusById = async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);
    if (!bus) {
      return res.status(404).json({ error: "Bus not found" });
    }
    res.status(200).json(bus);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch bus" });
  }
};

// Add a new bus
const addBus = async (req, res) => {
  try {
    const { name, route, seats } = req.body;

    if (!name || !route || typeof seats !== "number") {
      return res.status(400).json({ error: "Invalid input data" });
    }

    const newBus = new Bus({ name, route, seats });
    await newBus.save();
    res.status(201).json(newBus);
  } catch (error) {
    res.status(500).json({ error: "Failed to add bus" });
  }
};

// Update a bus
const updateBus = async (req, res) => {
  try {
    const updatedBus = await Bus.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedBus) {
      return res.status(404).json({ error: "Bus not found" });
    }
    res.status(200).json(updatedBus);
  } catch (error) {
    res.status(500).json({ error: "Failed to update bus" });
  }
};

// Delete a bus
const deleteBus = async (req, res) => {
  try {
    const deletedBus = await Bus.findByIdAndDelete(req.params.id);
    if (!deletedBus) {
      return res.status(404).json({ error: "Bus not found" });
    }
    res.status(200).json({ message: "Bus deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete bus" });
  }
};

module.exports = { getBuses, getBusById, addBus, updateBus, deleteBus };
