const express = require("express");
const router = express.Router();
const students = require("../data/students");

// ---------- Helpers ----------
const parseId = (idParam) => {
  const id = Number(idParam);
  return Number.isInteger(id) && id > 0 ? id : null;
};

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Validates body. If partial = false, all fields are required (POST).
const validateStudent = (body, partial = false) => {
  const errors = [];
  const { name, email, age, course } = body;

  if (!partial || name !== undefined) {
    if (typeof name !== "string" || name.trim() === "") errors.push("name is required and must be a non-empty string");
  }
  if (!partial || email !== undefined) {
    if (typeof email !== "string" || !isValidEmail(email)) errors.push("email is required and must be a valid email");
  }
  if (!partial || age !== undefined) {
    if (!Number.isInteger(age) || age <= 0) errors.push("age is required and must be a positive integer");
  }
  if (!partial || course !== undefined) {
    if (typeof course !== "string" || course.trim() === "") errors.push("course is required and must be a non-empty string");
  }

  return errors;
};

// ---------- GET /students ----------
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    count: students.length,
    data: students
  });
});

// ---------- GET /students/:id ----------
router.get("/:id", (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({ success: false, message: "Invalid student id. It must be a positive integer." });
  }

  const student = students.find((s) => s.id === id);
  if (!student) {
    return res.status(404).json({ success: false, message: `Student with id ${id} not found` });
  }

  res.status(200).json({ success: true, data: student });
});

// ---------- POST /students ----------
router.post("/", (req, res) => {
  const body = req.body || {};
  const errors = validateStudent(body);
  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: "Validation failed", errors });
  }

  const emailTaken = students.some((s) => s.email.toLowerCase() === body.email.toLowerCase());
  if (emailTaken) {
    return res.status(400).json({ success: false, message: "Email already exists" });
  }

  const newId = students.length > 0 ? Math.max(...students.map((s) => s.id)) + 1 : 1;
  const newStudent = {
    id: newId,
    name: body.name.trim(),
    email: body.email.trim(),
    age: body.age,
    course: body.course.trim()
  };

  students.push(newStudent);
  res.status(201).json({ success: true, message: "Student created successfully", data: newStudent });
});

// ---------- PUT /students/:id ----------
router.put("/:id", (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({ success: false, message: "Invalid student id. It must be a positive integer." });
  }

  const index = students.findIndex((s) => s.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: `Student with id ${id} not found` });
  }

  const body = req.body || {};
  const allowed = ["name", "email", "age", "course"];
  const hasAnyField = allowed.some((key) => body[key] !== undefined);
  if (!hasAnyField) {
    return res.status(400).json({ success: false, message: "Provide at least one field to update: name, email, age, course" });
  }

  const errors = validateStudent(body, true);
  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: "Validation failed", errors });
  }

  if (body.email !== undefined) {
    const emailTaken = students.some(
      (s) => s.id !== id && s.email.toLowerCase() === body.email.toLowerCase()
    );
    if (emailTaken) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }
  }

  const updated = { ...students[index] };
  if (body.name !== undefined) updated.name = body.name.trim();
  if (body.email !== undefined) updated.email = body.email.trim();
  if (body.age !== undefined) updated.age = body.age;
  if (body.course !== undefined) updated.course = body.course.trim();

  students[index] = updated;
  res.status(200).json({ success: true, message: "Student updated successfully", data: updated });
});

// ---------- DELETE /students/:id ----------
router.delete("/:id", (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({ success: false, message: "Invalid student id. It must be a positive integer." });
  }

  const index = students.findIndex((s) => s.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: `Student with id ${id} not found` });
  }

  const [deleted] = students.splice(index, 1);
  res.status(200).json({ success: true, message: "Student deleted successfully", data: deleted });
});

module.exports = router;