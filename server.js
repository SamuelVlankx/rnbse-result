const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("Database connected"))
  .catch(err => console.log("Database error:", err));

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

// 🔍 RESULT (roll + regNo)
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

// ➕ ADD
app.post("/add-student", async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.json({ message: "Student added successfully" });
  } catch {
    res.json({ message: "Error adding student" });
  }
});

// 📋 LIST
app.get("/students", async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

// ✏️ UPDATE
app.put("/update-student/:roll", async (req, res) => {
  await Student.findOneAndUpdate({ roll: req.params.roll }, req.body);
  res.json({ message: "Student updated" });
});

// ❌ DELETE
app.delete("/delete-student/:roll", async (req, res) => {
  await Student.findOneAndDelete({ roll: req.params.roll });
  res.json({ message: "Student deleted" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
