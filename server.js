const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const QRCode = require("qrcode");

const app = express();


// ===============================
// CLOUDINARY
// ===============================

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


// ===============================
// UPLOAD
// ===============================

const upload = multer({
  storage: multer.memoryStorage()
});


// ===============================
// MIDDLEWARE
// ===============================

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));


// ===============================
// TEST ROUTE
// ===============================

app.get("/test", (req, res) => {

  res.json({
    status: "working"
  });

});


// ===============================
// MONGODB
// ===============================

console.log(
  "MONGO_URL exists:",
  !!process.env.MONGO_URL
);

mongoose.connect(process.env.MONGO_URL)

  .then(() => {

    console.log("✅ Database connected");

  })

  .catch(err => {

    console.error("❌ Database error:");
    console.error(err);

  });


// ===============================
// STUDENT MODEL
// ===============================

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


// ===============================
// GET RESULT
// ===============================

app.get("/result", async (req, res) => {

  try {

    const { roll, regNo } = req.query;


    // ===============================
    // CHECK INPUT
    // ===============================

    if (!roll || !regNo) {

      return res.json({

        error:
          "Roll Number and Registration Number are required"

      });

    }


    // ===============================
    // FIND STUDENT
    // ===============================

    const student = await Student.findOne({

      roll: roll,

      regNo: regNo

    });


    if (!student) {

      return res.json({

        error:
          "Invalid Roll Number or Registration Number"

      });

    }


    // ===============================
    // TOTAL & PERCENTAGE
    // ===============================

    let total = 0;

    let percentage = 0;


    // ===============================
    // HSSLC
    // ===============================

    if (student.examType === "HSSLC") {

      const hsslcSubjects =
        (student.subjects || []).slice(0, 5);


      total =
        hsslcSubjects.reduce(

          (sum, subject) =>
            sum + Number(subject.marks || 0),

          0

        );


      percentage =
        (total / 5).toFixed(2);

    }


    // ===============================
    // HSLC
    // ===============================

    else {

      total =

        Number(student.marks?.english || 0) +

        Number(student.marks?.mizo || 0) +

        Number(student.marks?.mathematics || 0) +

        Number(student.marks?.science || 0) +

        Number(student.marks?.socialScience || 0);


      percentage =
        (total / 5).toFixed(2);

    }


    // ===============================
    // SERVER GRADE
    // ===============================

    let grade = "F";


    if (percentage >= 90)

      grade = "A+";

    else if (percentage >= 80)

      grade = "A";

    else if (percentage >= 70)

      grade = "B+";

    else if (percentage >= 60)

      grade = "B";

    else if (percentage >= 50)

      grade = "C";

    else if (percentage >= 33)

      grade = "D";


    // ===============================
    // NEW MBSE VERIFICATION URL
    // ===============================

    const resultUrl =

      `https://mbse-result.onrender.com/verify.html` +

      `?roll=${encodeURIComponent(student.roll)}` +

      `&regNo=${encodeURIComponent(student.regNo)}`;


    // ===============================
    // GENERATE QR CODE
    // ===============================

    const qrCode =
      await QRCode.toDataURL(resultUrl);


    // ===============================
    // SEND RESULT
    // ===============================

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

      subjects:

        student.examType === "HSSLC"

          ? (student.subjects || []).slice(0, 5)

          : (student.subjects || []),

      total,

      percentage,

      grade,

      qrCode

    });

  }


  catch (error) {

    console.error(
      "❌ Result error:",
      error
    );


    res.status(500).json({

      error:
        "Unable to retrieve result"

    });

  }

});


// ===============================
// ADD STUDENT
// ===============================

app.post("/add-student", async (req, res) => {

  try {

    const student =
      new Student(req.body);


    await student.save();


    res.json({

      message:
        "Student added successfully"

    });

  }

  catch (err) {

    console.error(err);


    res.status(500).json({

      message:
        "Error adding student"

    });

  }

});


// ===============================
// LIST STUDENTS
// ===============================

app.get("/students", async (req, res) => {

  try {

    const students =
      await Student.find();


    res.json(students);

  }

  catch (err) {

    console.error(err);


    res.status(500).json({

      error:
        "Unable to retrieve students"

    });

  }

});


// ===============================
// UPDATE STUDENT
// ===============================

app.put("/update-student/:roll", async (req, res) => {

  try {

    await Student.findOneAndUpdate(

      {
        roll: req.params.roll
      },

      req.body

    );


    res.json({

      message:
        "Student updated"

    });

  }

  catch (err) {

    console.error(err);


    res.status(500).json({

      message:
        "Error updating student"

    });

  }

});


// ===============================
// DELETE STUDENT
// ===============================

app.delete("/delete-student/:roll", async (req, res) => {

  try {

    await Student.findOneAndDelete({

      roll: req.params.roll

    });


    res.json({

      message:
        "Student deleted"

    });

  }

  catch (err) {

    console.error(err);


    res.status(500).json({

      message:
        "Error deleting student"

    });

  }

});


// ===============================
// UPLOAD PHOTO
// ===============================

app.post(
  "/upload-photo",
  upload.single("photo"),
  async (req, res) => {

    try {

      if (!req.file) {

        return res.status(400).json({

          error:
            "No photo uploaded"

        });

      }


      const result =
        await new Promise(

          (resolve, reject) => {

            cloudinary.uploader.upload_stream(

              {
                folder:
                  "students"
              },

              (error, result) => {

                if (error)

                  reject(error);

                else

                  resolve(result);

              }

            ).end(req.file.buffer);

          }

        );


      res.json({

        photo:
          result.secure_url

      });

    }

    catch (err) {

      console.error(err);


      res.status(500).json({

        error:
          "Upload failed"

      });

    }

  }
);


// ===============================
// SERVER
// ===============================

const PORT =
  process.env.PORT || 8080;


app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );

});
