setInterval(()=>clock.textContent=new Date().toLocaleString(),1000);
async function getResult(){
btn.disabled=true;btn.textContent='Checking...';
try{
const r=await fetch(`/result?roll=${roll.value}&regNo=${regNo.value}`);
const d=await r.json();
if(d.error){result.innerHTML=`<p style='color:red'>${d.error}</p>`;}
else{
result.innerHTML=`<h3>${d.name}</h3><p><b>Roll:</b> ${d.roll}<br><b>Reg:</b> ${d.regNo}</p>
<table><tr><th>Subject</th><th>Marks</th></tr>
<tr><td>English</td><td>${d.marks.english}</td></tr>
<tr><td>Mizo</td><td>${d.marks.mizo}</td></tr>
<tr><td>Mathematics</td><td>${d.marks.mathematics}</td></tr>
<tr><td>Science</td><td>${d.marks.science}</td></tr>
<tr><td>Social Science</td><td>${d.marks.socialScience}</td></tr></table>
<p><b>Total:</b> ${d.total}</p><p><b>Percentage:</b> ${d.percentage}%</p><p><b>Grade:</b> ${d.grade}</p>`;}
}catch(e){result.innerHTML='<p style="color:red">Server error.</p>';}
btn.disabled=false;btn.textContent='Check Result';
}