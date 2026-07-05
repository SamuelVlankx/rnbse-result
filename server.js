const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Test route
app.get("/test", (req, res) => {
  res.json({ status: "working" });
});

// Connect to MongoDB
console.log("MONGO_URL exists:", !!process.env.MONGO_URL);

mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log("✅ Database connected");
  })
  .catch(err => {
    console.error("❌ Database error:");
    console.error(err);
  });

const Student = mongoose.model("Student", {
  roll: String,
  regNo: String,
  name: String,
  marks: {
    english: Number,
    mizo: Number,
    mathematics: Number,
    science: Number,
    socialScience: Number
  }
});

// Get Result
app.get("/result", async (req, res) => {
  const { roll, regNo } = req.query;

  const student = await Student.findOne({ roll, regNo });

  if (!student) {
    return res.json({ error: "Invalid Roll Number or Registration Number" });
  }

  const total =
    student.marks.english +
    student.marks.mizo +
    student.marks.mathematics +
    student.marks.science +
    student.marks.socialScience;

  const percentage = (total / 5).toFixed(2);

  let grade = "C";
  if (percentage >= 80) grade = "A";
  else if (percentage >= 60) grade = "B";

  res.json({
    roll: student.roll,
    regNo: student.regNo,
    name: student.name,
    marks: student.marks,
    total,
    percentage,
    grade
  });
});

// Add Student
app.post("/add-student", async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.json({ message: "Student added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding student" });
  }
});

// List Students
app.get("/students", async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

// Update Student
app.put("/update-student/:roll", async (req, res) => {
  await Student.findOneAndUpdate({ roll: req.params.roll }, req.body);
  res.json({ message: "Student updated" });
});

// Delete Student
app.delete("/delete-student/:roll", async (req, res) => {
  await Student.findOneAndDelete({ roll: req.params.roll });
  res.json({ message: "Student deleted" });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
