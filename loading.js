let progress = 0;

const progressBar =
    document.getElementById("loadingProgress");

const percentText =
    document.getElementById("loadingPercent");

const messageText =
    document.getElementById("loadingMessage");

const tipText =
    document.getElementById("loadingTip");


const messages = [

    "Entering the forest...",

    "Preparing Kai's adventure...",

    "Looking for slimes...",

    "Checking your inventory...",

    "Loading your quests...",

    "Preparing the village...",

    "Sharpening Kai's sword...",

    "Almost ready..."

];


const tips = [

    "Tip: Use WASD to move Kai.",

    "Tip: Press E to interact with NPCs.",

    "Tip: Mira gives you quests.",

    "Tip: Bobo sells useful items.",

    "Tip: Collect coins from enemies.",

    "Tip: Watch your HP during battles.",

    "Tip: Defeat the Slime King to win!"

];


let messageIndex = 0;
let tipIndex = 0;


// Change messages
const messageTimer = setInterval(() => {

    messageIndex++;

    if (messageIndex >= messages.length) {
        messageIndex = messages.length - 1;
    }

    messageText.innerText =
        messages[messageIndex];

}, 800);


// Change tips
const tipTimer = setInterval(() => {

    tipIndex++;

    if (tipIndex >= tips.length) {
        tipIndex = 0;
    }

    tipText.innerText =
        tips[tipIndex];

}, 1500);


// Loading progress
const loadingTimer = setInterval(() => {

    progress += Math.floor(
        Math.random() * 8
    ) + 3;


    if (progress >= 100) {

        progress = 100;

        clearInterval(loadingTimer);
        clearInterval(messageTimer);
        clearInterval(tipTimer);

        progressBar.style.width =
            "100%";

        percentText.innerText =
            "100%";

        messageText.innerText =
            "Adventure ready!";

        setTimeout(() => {

            window.location.href =
                "dashboard.html";

        }, 600);

        return;
    }


    progressBar.style.width =
        progress + "%";

    percentText.innerText =
        progress + "%";

}, 180);