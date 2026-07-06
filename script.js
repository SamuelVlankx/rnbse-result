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

        <h2>🏅 Grade : ${data.grade}</h2>

        <div class="pass-badge">

            ✅ PASS

        </div>

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

.result-card{
    margin-top:25px;
    border-radius:18px;
    background:white;
    padding:30px;
    box-shadow:0 10px 30px rgba(0,0,0,.18);
}

.marksheet-header{
    text-align:center;
    color:#003366;
}

.student-info{
    margin:20px 0;
    line-height:1.8;
}

.summary{
    text-align:center;
    margin-top:25px;
}

.pass-badge{
    display:inline-block;
    margin-top:15px;
    background:#28a745;
    color:white;
    padding:10px 25px;
    border-radius:25px;
    font-weight:bold;
    font-size:18px;
}
