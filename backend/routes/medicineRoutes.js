const express = require("express");
const router = express.Router();
const medicineController = require("../controller/medicineController");
const { authenticateToken, authorizeRoles } = require("../middleware/auth");
const { uploadMedicineImage } = require("../utils/fileUpload");
const rateLimit = require('express-rate-limit');
const postLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 requests per windowMs
  message: {
    error: 'Too many requests. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});


router.get("/", medicineController.getAllMedicines);
router.get("/categories", medicineController.getMedicineCategories);
router.get("/:id", medicineController.getMedicineById);


router.post(
  "/add",
  postLimiter,
  authenticateToken,
  authorizeRoles(["Admin"]),
  uploadMedicineImage.single("image"), 
  medicineController.addMedicine
);

router.get(
  "/admin/all",
  authenticateToken,
  authorizeRoles(["Admin"]),
  medicineController.getAdminMedicines
);

module.exports = router;
