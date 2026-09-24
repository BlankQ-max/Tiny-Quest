/* =====================================
   KAI MOVEMENT
===================================== */

const kai = document.getElementById("kai");
const world = document.getElementById("world");

let kaiX = 50;
let kaiY = 62;

const speed = 1.5;

const keys = {};

document.addEventListener("keydown", function(event) {

    keys[event.key.toLowerCase()] = true;

    if (event.key.toLowerCase() === "e") {
        interact();
    }

});


document.addEventListener("keyup", function(event) {

    keys[event.key.toLowerCase()] = false;

});


/* =====================================
   UPDATE MOVEMENT
===================================== */

function updateKai() {

    if (keys["w"]) {
        kaiY -= speed;
    }

    if (keys["s"]) {
        kaiY += speed;
    }

    if (keys["a"]) {
        kaiX -= speed;
    }

    if (keys["d"]) {
        kaiX += speed;
    }


    /* Keep Kai inside map */

    if (kaiX < 5) {
        kaiX = 5;
    }

    if (kaiX > 95) {
        kaiX = 95;
    }

    if (kaiY < 5) {
        kaiY = 5;
    }

    if (kaiY > 95) {
        kaiY = 95;
    }


    kai.style.left = kaiX + "%";
    kai.style.top = kaiY + "%";


    requestAnimationFrame(updateKai);
}

updateKai();


/* =====================================
   INTERACTION
===================================== */

function interact() {

    /*
       Top-right area = Forest entrance
    */

    if (
        kaiX > 75 &&
        kaiY < 35
    ) {

        document.getElementById("messageTitle").textContent =
            "Forest Entrance";

        document.getElementById("messageText").textContent =
            "Press E again to enter the Green Forest.";

        setTimeout(() => {

            if (
                kaiX > 75 &&
                kaiY < 35
            ) {
                goForest();
            }

        }, 500);

        return;
    }


    /*
       Shop area
    */

    if (
        kaiX < 35 &&
        kaiY < 40
    ) {

        document.getElementById("messageTitle").textContent =
            "Village Shop";

        document.getElementById("messageText").textContent =
            "The shop is currently closed. Come back later!";

        return;
    }


    /*
       Default interaction
    */

    document.getElementById("messageTitle").textContent =
        "Peaceful Village";

    document.getElementById("messageText").textContent =
        "There is nothing to interact with here.";

}


/* =====================================
   GO TO FOREST
===================================== */

function goForest() {

    document.getElementById("messageTitle").textContent =
        "Entering Green Forest...";

    document.getElementById("messageText").textContent =
        "Prepare yourself for your first adventure!";

    setTimeout(function() {

        window.location.href = "forest.html";

    }, 800);

}


/* =====================================
   MENU
===================================== */

function resumeGame() {

    document.getElementById("messageTitle").textContent =
        "Game Resumed";

    document.getElementById("messageText").textContent =
        "Use W A S D to move Kai.";

}


function showInventory() {

    document.getElementById("messageTitle").textContent =
        "Inventory";

    document.getElementById("messageText").textContent =
        "You currently have 3 Potions and 2 Food.";

}


function showSettings() {

    document.getElementById("messageTitle").textContent =
        "Settings";

    document.getElementById("messageText").textContent =
        "Settings will be added later.";

}


function saveGame() {

    localStorage.setItem(
        "tinyQuestVillage",
        JSON.stringify({
            x: kaiX,
            y: kaiY,
            coins: 125,
            level: 1
        })
    );

    document.getElementById("messageTitle").textContent =
        "Game Saved!";

    document.getElementById("messageText").textContent =
        "Your village progress has been saved.";

}


function logout() {

    window.location.href = "index.html";

}