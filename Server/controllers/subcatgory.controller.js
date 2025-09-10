const Subcategory = require('../models/subcategory.model');
// Get all Subcategorys
const getAllSubcategorys = async (req, res) => {
    try {
        const Subcategorys = await Subcategory.find();
        res.status(200).json(Subcategorys);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single Subcategory by ID
const getSubcategoryById = async (req, res) => {
    try {
        const Subcategory = await Subcategory.findById(req.params.id);
        if (!Subcategory) {
            return res.status(404).json({ message: 'Subcategory not found' });
        }
        res.status(200).json(Subcategory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new Subcategory
const createSubcategory = async (req, res) => {
    try {
        const { name, category, youtubeUrl } = req.body; // Destructure youtubeUrl from the body

        // You can add validation here if necessary
        if (!name || !category) {
            return res.status(400).json({ error: 'Name and category are required' });
        }

        // Create a new subcategory object
        const newSubcategory = new Subcategory({
            name,
            category,
            youtubeUrl: youtubeUrl || '',  // Optional youtubeUrl, default to empty string if not provided
        });

        // Save the new subcategory to the database
        await newSubcategory.save();

        // Send the created subcategory in the response
        res.status(201).json(newSubcategory);
    } catch (error) {
        // Handle any errors
        res.status(500).json({ error: error.message });
    }
};

// Update a Subcategory
const updateSubcategory = async (req, res) => {
    try {
        const { name } = req.body;
        const updatedSubcategory = await Subcategory.findByIdAndUpdate(
            req.params.id,
            { name },
            { new: true }
        );
        if (!updatedSubcategory) {
            return res.status(404).json({ message: 'Subcategory not found' });
        }
        const Subcategorys = await Subcategory.find();
        res.status(200).json({ message: 'Subcategory deleted successfully', data: Subcategorys });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a Subcategory
const deleteSubcategory = async (req, res) => {
    try {
        const deletedSubcategory = await Subcategory.findByIdAndDelete(req.params.id);
        if (!deletedSubcategory) {
            return res.status(404).json({ message: 'Subcategory not found' });
        }
        const Subcategorys = await Subcategory.find();
        res.status(200).json({ message: 'Subcategory deleted successfully', data: Subcategorys });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAllSubcategorys, getSubcategoryById, createSubcategory, updateSubcategory, deleteSubcategory };