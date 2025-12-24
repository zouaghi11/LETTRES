const messages=["nhebek barcha 🍅🍅","I L🍅VE Y🍅U","I MISS Y🍅U","Y🍅U ARE MY H🍅ME","MY HEART IS Y🍅URS","ALWAYS Y🍅U 🍅🍅"];
const START_KEY="start_date";
const DAY=24*60*60*1000;
let startDate=localStorage.getItem(START_KEY);
if(!startDate){startDate=Date.now(); localStorage.setItem(START_KEY,startDate);}
let unlocked=Math.floor((Date.now()-startDate)/DAY);
let current=Math.min(unlocked,messages.length-1);
const msgEl=document.getElementById("message");
const counterEl=document.getElementById("counter");
const dateEl=document.getElementById("date");
const prevBtn=document.getElementById("prev");
const nextBtn=document.getElementById("next");
const countdownEl=document.getElementById("countdown");
function updateUI(){msgEl.classList.remove("fade"); void msgEl.offsetWidth; msgEl.classList.add("fade"); msgEl.textContent=messages[current]; counterEl.textContent=`${current+1}/${Math.min(unlocked+1,messages.length)}`; prevBtn.disabled=current===0; nextBtn.disabled=current>=unlocked;}
prevBtn.onclick=()=>{if(current>0){current--;updateUI();}};
nextBtn.onclick=()=>{if(current<unlocked){current++;updateUI();}};
dateEl.textContent=new Date().toLocaleDateString(); updateUI();
function updateCountdown(){let now=Date.now(); let nextUnlock=parseInt(startDate)+(unlocked+1)*DAY; let diff=nextUnlock-now; if(diff<=0) diff=0; let h=Math.floor(diff/3600000); let m=Math.floor((diff%3600000)/60000); let s=Math.floor((diff%60000)/1000); countdownEl.textContent=`Next message in ${h}h ${m}m ${s}s`;}
setInterval(updateCountdown,1000); updateCountdown();
