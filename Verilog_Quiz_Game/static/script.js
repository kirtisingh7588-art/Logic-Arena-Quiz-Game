const questions = [
  {category:"DIGITAL LOGIC",difficulty:"EASY",q:"Which gate gives output 1 only when BOTH inputs are 1?",options:["OR gate","AND gate","NOT gate","XOR gate"],answer:1,explain:"AND gives 1 only for inputs A=1 and B=1."},
  {category:"TRUTH TABLE",difficulty:"EASY",q:"For an AND gate, what is the output when A=1 and B=0?",options:["0","1","Undefined","Depends on clock"],answer:0,explain:"One input is 0, so A AND B = 0."},
  {category:"VERILOG BASICS",difficulty:"EASY",q:"Which Verilog keyword starts a design block?",options:["begin_module","design","module","start"],answer:2,explain:"A Verilog design block starts with the module keyword."},
  {category:"LOGIC GATES",difficulty:"MEDIUM",q:"What does a NOT gate do to a binary input?",options:["Always outputs 1","Flips 0 to 1 and 1 to 0","Adds two inputs","Stores the input"],answer:1,explain:"NOT produces the logical complement of its input."},
  {category:"VERILOG OPERATORS",difficulty:"MEDIUM",q:"In Verilog, which operator represents bitwise AND?",options:["||","~","&","^"],answer:2,explain:"The & operator performs bitwise AND; && is logical AND."},
  {category:"SIMULATION",difficulty:"MEDIUM",q:"Which tool compiles Verilog source code in this project?",options:["GTKWave","Icarus Verilog (iverilog)","Notepad","HTML"],answer:1,explain:"iverilog compiles Verilog source; vvp runs the simulation."},
  {category:"TESTBENCH",difficulty:"MEDIUM",q:"Which system task can print values in a Verilog simulation?",options:["$display","$website","$printpage","$browser"],answer:0,explain:"$display prints formatted text in the simulator output."},
  {category:"LOGIC REASONING",difficulty:"HARD",q:"For a 2-input XOR gate, what is the output when A=1 and B=1?",options:["0","1","Z","X"],answer:0,explain:"XOR is 1 when inputs differ. Equal inputs (1,1) produce 0."}
];
let current=0, score=0, xp=0, streak=0, bestStreak=0, answered=false, timerId=null, timeLeft=20, correctCount=0;
const $=id=>document.getElementById(id);
const quizCard=$("quizCard"), resultCard=$("resultCard");
function showView(view){
  document.querySelectorAll(".view").forEach(v=>v.classList.add("hidden"));
  $(view+"View").classList.remove("hidden");
  document.querySelectorAll(".nav").forEach(n=>n.classList.toggle("active",n.dataset.view===view));
  if(view==="quiz" && current===0 && !answered) renderQuestion();
}
document.querySelectorAll(".nav").forEach(n=>n.addEventListener("click",()=>showView(n.dataset.view)));
function renderQuestion(){
  clearInterval(timerId); answered=false; timeLeft=20;
  quizCard.classList.remove("hidden");resultCard.classList.add("hidden");
  const q=questions[current];
  $("questionCount").textContent=`QUESTION ${String(current+1).padStart(2,"0")} / ${String(questions.length).padStart(2,"0")}`;
  $("roundNo").textContent=String(current+1).padStart(2,"0");
  $("categoryBadge").textContent=q.category;$("difficulty").textContent=q.difficulty;
  $("questionText").textContent=q.q;$("timer").textContent=timeLeft;
  $("feedback").textContent="SELECT AN ANSWER TO CONTINUE";$("feedback").className="";
  $("nextBtn").disabled=true;$("nextBtn").innerHTML=current===questions.length-1?'See results <span>→</span>':'Next challenge <span>→</span>';
  const options=$("options");options.innerHTML="";
  q.options.forEach((text,i)=>{
    const btn=document.createElement("button");btn.className="option";
    btn.innerHTML=`<span class="letter">${String.fromCharCode(65+i)}</span><span></span>`;
    btn.querySelector("span:nth-child(2)").textContent=text;
    btn.addEventListener("click",()=>chooseAnswer(i,btn));options.appendChild(btn);
  });
  updateStats();startTimer();
}
function startTimer(){timerId=setInterval(()=>{timeLeft--; $("timer").textContent=timeLeft;if(timeLeft<=5)$("timer").parentElement.style.color="#ff6b85";if(timeLeft<=0){clearInterval(timerId);if(!answered)chooseAnswer(-1,null,true)}},1000)}
function chooseAnswer(index,button,timedOut=false){
  if(answered)return;answered=true;clearInterval(timerId);
  const q=questions[current], buttons=[...$("options").querySelectorAll(".option")];
  buttons.forEach((b,i)=>{b.disabled=true;if(i===q.answer)b.classList.add("correct")});
  if(index===q.answer){score++;correctCount++;streak++;bestStreak=Math.max(bestStreak,streak);const earned=10+Math.max(0,timeLeft);xp+=earned;$("feedback").textContent=`CORRECT! +${earned} XP — ${q.explain}`;$("feedback").className="good"}
  else{streak=0;if(button)button.classList.add("wrong");$("feedback").textContent=(timedOut?"TIME'S UP. ":"NOT QUITE. ")+q.explain;$("feedback").className="bad"}
  $("nextBtn").disabled=false;updateStats();
}
$("nextBtn").addEventListener("click",()=>{if(!answered)return;if(current<questions.length-1){current++;renderQuestion()}else showResults()});
function updateStats(){
  $("totalXP").textContent=xp;$("headerScore").textContent=xp+" XP";$("accuracy").textContent=(current===0&&!answered?"—":Math.round(correctCount/Math.max(1,answered?current+1:current)*100)+"%");
  $("streak").textContent=streak;$("progressText").textContent=Math.round((current+(answered?1:0))/questions.length*100)+"%";$("levelProgress").style.width=Math.min(100,xp/10)+"%";$("levelText").textContent="LEVEL "+String(Math.floor(xp/100)+1).padStart(2,"0");
}
function showResults(){
  clearInterval(timerId);quizCard.classList.add("hidden");resultCard.classList.remove("hidden");
  const accuracy=Math.round(correctCount/questions.length*100);
  $("resultTitle").textContent=accuracy>=80?"Logic legend!":accuracy>=50?"Nice work, engineer!":"Keep training, learner!";
  $("resultSummary").textContent=`You answered ${correctCount} out of ${questions.length} questions correctly. Keep practicing to sharpen your logic skills.`;
  $("finalScore").textContent=`${correctCount}/${questions.length}`;$("finalXP").textContent=xp;$("finalAccuracy").textContent=accuracy+"%";
  $("progressText").textContent="100%";$("levelProgress").style.width="100%";
}
function restart(){current=0;score=0;xp=0;streak=0;bestStreak=0;correctCount=0;$("timer").parentElement.style.color="";renderQuestion()}
$("restartBtn").addEventListener("click",restart);
$("runBtn").addEventListener("click",async()=>{
  const btn=$("runBtn"),out=$("simOutput"),status=$("runStatus");
  btn.disabled=true;btn.textContent="Running...";status.className="status-idle";status.textContent="COMPILING";out.textContent="Calling Icarus Verilog...";
  try{
    const response=await fetch("/api/simulate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({code:$("codeEditor").value})});
    const data=await response.json();out.textContent=data.output||"No output.";
    status.textContent=data.ok?"SIMULATION OK":"CHECK OUTPUT";status.className=data.ok?"status-ok":"status-error";
  }catch(e){out.textContent="Server se connect nahi ho paya. Check karo ki Python app.py chal raha hai.";status.textContent="SERVER OFFLINE";status.className="status-error"}
  finally{btn.disabled=false;btn.innerHTML="▶ Run simulation"}
});
renderQuestion();
