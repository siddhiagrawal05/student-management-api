const express = require("express");
const logger = require("./middleware/logger");
const studentRoutes = require("./routes/studentRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// ---------- Custom middleware (first, so every request is logged) ----------
app.use(logger);

// ---------- Built-in middleware ----------
app.use(express.json());

// ---------- Home route ----------
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Student Management REST API is running",
    endpoints: [
      "GET    /students",
      "GET    /students/:id",
      "POST   /students",
      "PUT    /students/:id",
      "DELETE /students/:id"
    ]
  });
});

// ---------- Modular routes ----------
app.use("/students", studentRoutes);

// ---------- 404 handler (unknown routes) ----------
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.originalUrl} not found` });
});

// ---------- Global error handler ----------
app.use((err, req, res, next) => {
  // Malformed JSON in request body
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ success: false, message: "Invalid JSON in request body" });
  }

  console.error(err.stack);
  res.status(err.status || 500).json({ success: false, message: err.message || "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});