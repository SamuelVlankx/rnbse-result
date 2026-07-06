function updateClock(){

    const now=new Date();

    document.getElementById("clock").innerHTML=
        now.toLocaleDateString()+" | "+now.toLocaleTimeString();

}

setInterval(updateClock,1000);

updateClock();

async function getResult(){

    const btn=document.getElementById("btn");

    btn.innerHTML="⏳ Checking...";

    btn.disabled=true;

    const roll=document.getElementById("roll").value;

    const regNo=document.getElementById("regNo").value;

    try{

        const res=await fetch(`/result?roll=${roll}&regNo=${regNo}`);

        const data=await res.json();
        const percentage = parseFloat(data.percentage);
        let grade = "F";

if (percentage >= 90) grade = "A+";
else if (percentage >= 80) grade = "A";
else if (percentage >= 70) grade = "B+";
else if (percentage >= 60) grade = "B";
else if (percentage >= 50) grade = "C";
else if (percentage >= 33) grade = "D";

let status = "❌ FAIL";
let division = "FAIL";

if (percentage >= 33) {
    status = "✅ PASS";

    if (percentage >= 60) {
        division = "FIRST DIVISION";
    } else if (percentage >= 45) {
        division = "SECOND DIVISION";
    } else {
        division = "THIRD DIVISION";
    }
}

        if(data.error){

            document.getElementById("result").innerHTML=
            `<p style="color:red;font-weight:bold;">${data.error}</p>`;

        }

        else{

            document.getElementById("result").innerHTML=`

      <div class="result-card">

    <div class="marksheet-header">

        <h2>🏛 Mizoram Board of School Education</h2>

        <p>High School Leaving Certificate Examination</p>

        <h3>OFFICIAL MARK SHEET</h3>

    </div>

    <hr>

    <div class="student-info">

        <p><strong>Name:</strong> ${data.name}</p>

        <p><strong>Roll Number:</strong> ${data.roll}</p>

        <p><strong>Registration Number:</strong> ${data.regNo}</p>

    </div>

    <table>

        <tr>

            <th>Subject</th>

            <th>Marks</th>

        </tr>

        <tr><td>English</td><td>${data.marks.english}</td></tr>

        <tr><td>Mizo</td><td>${data.marks.mizo}</td></tr>

        <tr><td>Mathematics</td><td>${data.marks.mathematics}</td></tr>

        <tr><td>Science</td><td>${data.marks.science}</td></tr>

        <tr><td>Social Science</td><td>${data.marks.socialScience}</td></tr>

    </table>

    <div class="summary">

    <h3>Total Marks : ${data.total}</h3>

    <h3>Percentage : ${data.percentage}%</h3>

    <h2>🏅 Grade : ${grade}</h2>

    <h3>Division : ${division}</h3>

    <div class="pass-badge ${status.includes('PASS') ? 'pass' : 'fail'}">

        ${status}

    </div>

</div>
            `;

        }

    }

    catch{

        document.getElementById("result").innerHTML=
        `<p style="color:red;">Unable to connect to server.</p>`;

    }

    btn.disabled=false;

    btn.innerHTML="🔍 Check Result";

}
