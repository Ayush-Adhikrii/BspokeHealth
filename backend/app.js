require("dotenv").config();
const express = require("express");
const http = require("http");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const csurf = require("csurf");
const { PrismaClient } = require("@prisma/client");
const setupWebSockets = require("./utils/setupWebSockets");
const rateLimit = require("express-rate-limit");
const fs = require("fs");
const https = require("https");
const path = require("path");

const app = express();
const prisma = new PrismaClient();

const certDir = path.resolve(__dirname, ".cert");
const keyPath = path.join(certDir, "key.pem");
const certPath = path.join(certDir, "cert.pem");

let server;
let useHttps = false;
let httpsOptions = {};
try {
  if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
    httpsOptions = {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
    };
    useHttps = true;
  }
} catch (err) {
  console.warn("Could not load HTTPS certs:", err);
}

if (useHttps) {
  server = https.createServer(httpsOptions, app);
} else {
  server = http.createServer(app);
  console.warn("Running without HTTPS!");
}

const io = setupWebSockets(server);

prisma
  .$connect()
  .then(() => console.log("PostgreSQL connected successfully"))
  .catch((error) => console.error("PostgreSQL connection failed:", error));

// Global Middleware
app.use(helmet());
app.use(cors({
  origin: "https://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(express.static("../frontend/dist"));
app.use(cookieParser());

// CSRF protection - must be after cookieParser but before routes
app.use(csurf({ 
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  }
}));

// CSRF token endpoint for frontend
app.get("/api/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: {
    error: "Too many requests, please try again later."
  }
});
app.use(limiter);

// Routes that don't need CSRF protection
const authRoutes = require("./routes/authRoutes");
const kycRoutes = require("./routes/kycRoutes");
const fileRoutes = require("./routes/fileRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const availabilityRoutes = require("./routes/availabilityRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const statRoutes = require("./routes/statRoutes");
const diseaseRoutes = require("./routes/diseaseRoutes");
const medicineRoutes = require("./routes/medicineRoutes");
const chatRoutes = require("./routes/chatRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const adminRoutes = require("./routes/adminRoutes");

// Apply CSRF protection only to routes that need it
app.use("/api/auth", authRoutes);
app.use("/api/kyc", kycRoutes);
app.use("/api/uploads", fileRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/stats", statRoutes);
app.use("/api/disease", diseaseRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/medicines", medicineRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/admin", adminRoutes);

// CSRF Error Handler
app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    console.log('CSRF token validation failed:', req.url);
    return res.status(403).json({ 
      error: 'CSRF token validation failed',
      message: 'Invalid or missing CSRF token'
    });
  }
  next(err);
});

// Error Handling
const { handleFileUploadErrors } = require("./middleware/errorHandler");
app.use(handleFileUploadErrors);

// Start Server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  if (useHttps) {
    console.log(`Server running on https://localhost:${PORT}`);
  } else {
    console.log(`Server running on http://localhost:${PORT}`);
  }
});
