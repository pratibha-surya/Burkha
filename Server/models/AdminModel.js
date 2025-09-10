const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    userid: {
        type: String,
        required: true,
        unique: true, // Prevent duplicate userid
       
        trim: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true // Optional: adds createdAt and updatedAt
});

module.exports = mongoose.model("Admin", adminSchema);
