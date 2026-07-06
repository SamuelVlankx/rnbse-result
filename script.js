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

            <h2>🎓 Final Examination Result</h2>

            <hr>

            <p><b>Name:</b> ${data.name}</p>

            <p><b>Roll Number:</b> ${data.roll}</p>

            <p><b>Registration Number:</b> ${data.regNo}</p>

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

            <br>

            <p><b>Total :</b> ${data.total}</p>

            <p><b>Percentage :</b> ${data.percentage}%</p>

            <p><b>Grade :</b> ${data.grade}</p>

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
