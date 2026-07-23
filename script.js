function updateClock() {

    const now = new Date();

    document.getElementById("clock").innerHTML =
        now.toLocaleDateString() + " | " + now.toLocaleTimeString();

}

setInterval(updateClock, 1000);

updateClock();


async function getResult() {

    const btn = document.getElementById("btn");

    btn.innerHTML = "⏳ Checking...";

    btn.disabled = true;

    const roll = document.getElementById("roll").value;

    const regNo = document.getElementById("regNo").value;


    try {

        const res = await fetch(
            `/result?roll=${encodeURIComponent(roll)}&regNo=${encodeURIComponent(regNo)}`
        );

        const data = await res.json();


        /* =========================
           ERROR CHECK
        ========================= */

        if (data.error) {

            document.getElementById("result").innerHTML =
                `<p style="color:red;font-weight:bold;">${data.error}</p>`;

            return;

        }


        /* =========================
           PERCENTAGE
        ========================= */

        const percentage = parseFloat(data.percentage);


        /* =========================
           GRADE
        ========================= */

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


        /* =========================
           STATUS & DIVISION
        ========================= */

        let status = "❌ FAIL";

        let division = "FAIL";


        if (percentage >= 33) {

            status = "✅ PASS";


            if (percentage >= 60) {

                division = "FIRST DIVISION";

            }

            else if (percentage >= 45) {

                division = "SECOND DIVISION";

            }

            else {

                division = "THIRD DIVISION";

            }

        }


        /* =========================
           EXAM TITLE
        ========================= */

        let examTitle =
            data.examType === "HSSLC"
                ? "Higher Secondary School Leaving Certificate Examination"
                : "High School Leaving Certificate Examination";


        /* =========================
           SUBJECT ROWS
        ========================= */

        let marksRows = "";


        /* HSSLC - 5 CUSTOM SUBJECTS */

        if (data.examType === "HSSLC") {

            if (data.subjects && data.subjects.length > 0) {

                data.subjects.forEach((subject, index) => {

                    marksRows += `

                        <tr>

                            <td>
                                ${index + 1}
                            </td>

                            <td>
                                ${subject.name}
                            </td>

                            <td>
                                ${subject.marks}
                            </td>

                        </tr>

                    `;

                });

            }

        }


        /* HSLC - 5 FIXED SUBJECTS */

        else {

            marksRows = `

                <tr>

                    <td>1</td>

                    <td>English</td>

                    <td>
                        ${data.marks.english}
                    </td>

                </tr>


                <tr>

                    <td>2</td>

                    <td>Mizo</td>

                    <td>
                        ${data.marks.mizo}
                    </td>

                </tr>


                <tr>

                    <td>3</td>

                    <td>Mathematics</td>

                    <td>
                        ${data.marks.mathematics}
                    </td>

                </tr>


                <tr>

                    <td>4</td>

                    <td>Science</td>

                    <td>
                        ${data.marks.science}
                    </td>

                </tr>


                <tr>

                    <td>5</td>

                    <td>Social Science</td>

                    <td>
                        ${data.marks.socialScience}
                    </td>

                </tr>

            `;

        }


        /* =========================
           RESULT MARKSHEET
        ========================= */

        document.getElementById("result").innerHTML = `


        <div class="result-card">


            <!-- HEADER -->

            <div class="marksheet-header">

    <div class="official-header">

        <img
            src="logo.png"
            alt="MBSE Logo"
            class="mbse-logo"
        >

        <div class="official-title">

            <h2>
                MIZORAM BOARD OF SCHOOL EDUCATION
            </h2>

            <p>
                ${examTitle}
            </p>

            <h3>
                STATEMENT OF MARKS
            </h3>

        </div>

    </div>

</div>


            <hr>


            <!-- STUDENT INFORMATION -->

            <div class="student-info">


                <div class="student-details">


                    <p>

                        <strong>
                            Name:
                        </strong>

                        ${data.name}

                    </p>


                    <p>

                        <strong>
                            Roll Number:
                        </strong>

                        ${data.roll}

                    </p>


                    <p>

                        <strong>
                            Registration Number:
                        </strong>

                        ${data.regNo}

                    </p>


                    <!-- HSSLC STREAM -->

                    ${
                        data.examType === "HSSLC"

                        ? `

                        <p>

                            <strong>
                                Stream:
                            </strong>

                            ${data.stream || ""}

                        </p>

                        `

                        : ""

                    }


                    <p>

                        <strong>
                            Result Declared:
                        </strong>

                        ${data.resultDate}

                    </p>


                    <p>

                        <strong>
                            Certificate No:
                        </strong>

                        ${data.certificateNo}

                    </p>


                </div>


                <!-- STUDENT PHOTO -->

                <div class="student-photo">


                    <img

                        src="${data.photo}"

                        alt="Student Photo"

                    >


                </div>


            </div>


            <!-- SUBJECT MARKS TABLE -->

            <table>


                <thead>


                    <tr>


                        <th>
                            Sl. No.
                        </th>


                        <th>
                            Subject
                        </th>


                        <th>
                            Marks Obtained
                        </th>


                    </tr>


                </thead>


                <tbody>


                    ${marksRows}


                </tbody>


            </table>


            <!-- RESULT SUMMARY -->

            <div class="summary">


                <h3>

                    Total Marks :
                    ${data.total}

                </h3>


                <h3>

                    Percentage :
                    ${data.percentage}%

                </h3>


                <!-- GRADE -->

                <div class="grade-box">

                    🏅 Grade :
                    ${grade}

                </div>


                <h3>

                    Division :
                    ${division}

                </h3>


                <!-- PASS / FAIL -->

                <div

                    class="pass-badge ${
                        status.includes("PASS")
                            ? "pass"
                            : "fail"
                    }"

                >

                    ${status}

                </div>


                <p>

                    <strong>
                        Result Declared:
                    </strong>

                    ${data.resultDate}

                </p>


            </div>


            <!-- QR CODE -->

            <div class="qr-section">


                <img

                    src="${data.qrCode}"

                    alt="QR Code"

                    class="qr-code"

                >


                <p>

                    <b>
                        Scan to verify this result
                    </b>

                </p>


            </div>


            <!-- SIGNATURE -->

            <div class="signature">


                <br>
                <br>


                James Lalrinchhana


                <br>


                <strong>
                    Controller of Examinations
                </strong>


                <br>


                Mizoram Board of School Education


            </div>


        </div>


        `;


    }


    catch (error) {


        console.error(error);


        document.getElementById("result").innerHTML =

            `<p style="color:red;">
                Unable to connect to server.
            </p>`;


    }


    btn.disabled = false;


    btn.innerHTML =
        "🔍 Check Result";


}
