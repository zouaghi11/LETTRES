const messages = [
"nhebek barcha 🍅🍅",
"I L🍅VE Y🍅U",
"I MISS Y🍅U",
"Y🍅U ARE MY H🍅ME",
"MY HEART IS Y🍅URS",
"ALWAYS Y🍅U 🍅🍅"
];


const START_KEY = "start_date";
const DAY = 24 * 60 * 60 * 1000;


let startDate = localStorage.getItem(START_KEY);


if (!startDate) {
startDate = Date.now();
localStorage.setItem(START_KEY, startDate);
}



const daysPassed = Math.floor((Date.now() - startDate) / DAY);
const index = Math.min(daysPassed, messages.length - 1);


// Message
document.getElementById("message").textContent = messages[index];


// Date
document.getElementById("date").textContent = new Date().toLocaleDateString();


// Counter
document.getElementById("counter").textContent = `${index + 1} / ${messages.length}`;
