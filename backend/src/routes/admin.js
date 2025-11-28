// backend/src/routes/admin.js
const express = require("express");
const {
  createRoom,
  deleteRoom,
  getDashboardStats,
  getAllBookings,
  getAllRooms,
  getAllUsers,
  updateRoom,
  updateBookingStatus,
} = require("../controllers/admin");

const { 
  getAmenities,
  createAmenity,
  updateAmenity,
  deleteAmenity 
} = require('../controllers/amenities');

const upload = require("../middleware/upload");

const { protect, authorize } = require("../middleware/auth");

const galleryRouter = require('./gallery');

const router = express.Router();

// All routes are protected and require admin role
router.use(protect);
router.use(authorize("admin"));

router.get("/dashboard", getDashboardStats);
router.get("/bookings", getAllBookings);
router.get("/rooms", getAllRooms);
router.get("/users", getAllUsers);
router.put("/rooms/:id", updateRoom);
router.put("/bookings/:id", updateBookingStatus);

router.post("/rooms", createRoom);
router.delete("/rooms/:id", deleteRoom);

router.post("/upload-image", upload.array("images", 10), (req, res) => {
  try {
    console.log("Upload request received, files:", req.files);

    // Check if files exist
    if (!req.files || req.files.length === 0) {
      console.log("No files uploaded");
      return res.status(400).json({
        success: false,
        message: "No files uploaded",
      });
    }

    // Cloudinary already uploaded files, get URLs directly
    const urls = req.files.map(file => file.path);

    console.log("Cloudinary URLs:", urls);

    res.status(200).json({
      success: true,
      urls,
      message: `Successfully uploaded ${req.files.length} image(s) to Cloudinary`,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during upload",
      error: error.message,
    });
  }
});


// Amenities Management
router.get('/amenities', getAmenities);
router.post('/amenities', upload.single('image'), createAmenity);
router.put('/amenities/:id', upload.single('image'), updateAmenity);
router.delete('/amenities/:id', deleteAmenity);

//gallery routes
router.use('/gallery', galleryRouter);




module.exports = router;
