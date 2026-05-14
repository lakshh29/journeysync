const express = require("express");
const mongoose = require("mongoose");
const Bus = require("../models/Bus");  // ✅ Bus model import yahan likho
const { getBuses, getBusById, addBus, updateBus, deleteBus } = require("../controllers/busController");

const router = express.Router();

router.get("/", getBuses);         // Get all buses
router.get("/:id", getBusById);     // Get single bus by ID
router.post("/", addBus);           // Add a new bus
router.put("/:id", updateBus);       // Update bus
router.delete("/:id", deleteBus);    // Delete bus

module.exports = router;
