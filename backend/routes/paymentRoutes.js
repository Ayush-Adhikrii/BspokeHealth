const express = require("express");
const router = express.Router();
const paymentController = require("../controller/paymentController");
const { authenticateToken } = require("../middleware/auth");
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


router.post(
  "/:paymentId/process",
  postLimiter,
  authenticateToken,
  paymentController.processPayment
);


router.post(
  "/:paymentId/khalti/initiate",
  postLimiter,
  authenticateToken,
  paymentController.initiateKhaltiPayment
);


router.post(
  "/khalti/verify",
  postLimiter,
  paymentController.verifyKhaltiPayment
);

router.get(
  "/:paymentId",
  authenticateToken,
  paymentController.getPaymentDetails
);

module.exports = router;
