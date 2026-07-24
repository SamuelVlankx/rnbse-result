const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const QRCode = require("qrcode");
const app = express();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const upload = multer({ storage: multer.memoryStorage() });

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

  examType: String,

stream: String,

certificateNo: String,

  photo: String,

  roll: String,

  regNo: String,

  name: String,

  resultDate: String,

  marks: {
    english: Number,
    mizo: Number,
    mathematics: Number,
    science: Number,
    socialScience: Number
  },

  subjects: [
    {
      name: String,
      marks: Number
    }
  ]

});

// Get Result
app.get("/result", async (req, res) => {

  const { roll, regNo } = req.query;

  const student = await Student.findOne({ roll, regNo });

  if (!student) {
    return res.json({ error: "Invalid Roll Number or Registration Number" });
  }

  let total = 0;
  let percentage = 0;

  if (student.examType === "HSSLC") {

    const hsslcSubjects = student.subjects.slice(0, 5);

    total = hsslcSubjects.reduce((sum, s) => sum + s.marks, 0);

    percentage = (total / 5).toFixed(2);

  } else {

    total =
      student.marks.english +
      student.marks.mizo +
      student.marks.mathematics +
      student.marks.science +
      student.marks.socialScience;

    percentage = (total / 5).toFixed(2);

  }

  let grade = "C";

  if (percentage >= 80)
    grade = "A";

  else if (percentage >= 60)
    grade = "B";

  const resultUrl =
    `${req.protocol}://${req.get("host")}/?roll=${student.roll}&regNo=${student.regNo}`;

  const qrCode = await QRCode.toDataURL(resultUrl);

  res.json({

    examType: student.examType,

    stream: student.stream,

    roll: student.roll,

    regNo: student.regNo,

    certificateNo: student.certificateNo,

    resultDate: student.resultDate,

    name: student.name,

    photo: student.photo,

    marks: student.marks,

    subjects: student.examType === "HSSLC"
  ? student.subjects.slice(0, 5)
  : student.subjects,
    total,

    percentage,

    grade,

    qrCode

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

app.post("/upload-photo", upload.single("photo"), async (req, res) => {
  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: "students" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(req.file.buffer);
    });

    res.json({
      photo: result.secure_url
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Upload failed"
    });
  }
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
