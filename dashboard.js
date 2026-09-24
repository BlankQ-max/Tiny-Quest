import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

import {
    doc,
    getDoc,
    setDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";


// =====================================
// GAME VARIABLES
// =====================================

let playerData = null;
let currentUser = null;

let playerX = 50;
let playerY = 55;


// =====================================
// CHECK LOGIN
// =====================================

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "index.html";

        return;
    }

    currentUser = user;

    console.log("Logged in user:", user.uid);

    await loadPlayerData(user.uid);

});


// =====================================
// LOAD PLAYER DATA FROM FIRESTORE
// =====================================

async function loadPlayerData(uid) {

    try {

        const playerRef = doc(db, "players", uid);

        const playerSnapshot = await getDoc(playerRef);


        // If player data doesn't exist yet
        if (!playerSnapshot.exists()) {

            console.log("Creating new player...");

            const newPlayer = {

                username: currentUser.email
                    ? currentUser.email.split("@")[0]
                    : "Kai",

                level: 1,

                hp: 100,
                maxHp: 100,

                mp: 50,
                maxMp: 50,

                coins: 125,

                exp: 0,
                maxExp: 100,

                attack: 10,
                defense: 5,

                currentArea: "Village",

                playerX: 50,
                playerY: 55,

                questProgress: 25,

                inventory: {

                    potion: 3,
                    manaPotion: 5,
                    herbs: 8,
                    mushrooms: 6,
                    scroll: 1

                }

            };


            await setDoc(playerRef, newPlayer);

            playerData = newPlayer;

        } else {

            playerData = playerSnapshot.data();

        }


        playerX = playerData.playerX || 50;
        playerY = playerData.playerY || 55;


        updateDashboard();

    } catch (error) {

        console.error("Error loading player:", error);

        alert(
            "Could not load your game data.\n\n" +
            error.message
        );

    }

}


// =====================================
// UPDATE DASHBOARD
// =====================================

function updateDashboard() {

    if (!playerData) return;


    // PLAYER NAME

    const playerName =
        document.querySelector(".player-name");

    playerName.innerHTML = `
        ${playerData.username}
        <span>Lv. ${playerData.level}</span>
    `;


    // HP

    document.getElementById("hpText").innerText =
        `${playerData.hp} / ${playerData.maxHp}`;

    document.getElementById("hpFill").style.width =
        `${(playerData.hp / playerData.maxHp) * 100}%`;


    // MP

    document.getElementById("mpText").innerText =
        `${playerData.mp} / ${playerData.maxMp}`;

    document.getElementById("mpFill").style.width =
        `${(playerData.mp / playerData.maxMp) * 100}%`;


    // COINS

    document.getElementById("coins").innerText =
        playerData.coins;

    document.getElementById("inventoryCoins").innerText =
        playerData.coins;


    // PLAYER POSITION

    document.getElementById("player").style.left =
        playerX + "%";

    document.getElementById("player").style.top =
        playerY + "%";


    // AREA

    changeArea(playerData.currentArea);


    // INVENTORY

    updateInventory();


    // STATS

    updateStats();

}


// =====================================
// UPDATE INVENTORY
// =====================================

function updateInventory() {

    const items =
        document.querySelectorAll(".item");

    if (!items.length) return;


    // Potion

    if (items[1]) {
        items[1].querySelector("small").innerText =
            playerData.inventory.potion || 0;
    }


    // Mana Potion

    if (items[2]) {
        items[2].querySelector("small").innerText =
            playerData.inventory.manaPotion || 0;
    }


    // Coins

    if (items[3]) {
        items[3].querySelector("small").innerText =
            playerData.coins;
    }


    // Herbs

    if (items[4]) {
        items[4].querySelector("small").innerText =
            playerData.inventory.herbs || 0;
    }


    // Mushrooms

    if (items[5]) {
        items[5].querySelector("small").innerText =
            playerData.inventory.mushrooms || 0;
    }


    // Scroll

    if (items[6]) {
        items[6].querySelector("small").innerText =
            playerData.inventory.scroll || 0;
    }

}


// =====================================
// UPDATE STATS
// =====================================

function updateStats() {

    const stats =
        document.querySelectorAll(".quick-stats p");


    if (stats[0]) {
        stats[0].querySelector("strong").innerText =
            playerData.level;
    }


    if (stats[1]) {
        stats[1].querySelector("strong").innerText =
            `${playerData.exp} / ${playerData.maxExp}`;
    }


    if (stats[2]) {
        stats[2].querySelector("strong").innerText =
            playerData.attack;
    }


    if (stats[3]) {
        stats[3].querySelector("strong").innerText =
            playerData.defense;
    }

}


// =====================================
// PLAYER MOVEMENT
// =====================================

document.addEventListener("keydown", async (event) => {

    if (!playerData) return;


    const key = event.key.toLowerCase();

    const speed = 2;


    if (key === "w") {
        playerY -= speed;
    }

    if (key === "s") {
        playerY += speed;
    }

    if (key === "a") {
        playerX -= speed;
    }

    if (key === "d") {
        playerX += speed;
    }


    // Keep inside map

    playerX =
        Math.max(5, Math.min(90, playerX));

    playerY =
        Math.max(5, Math.min(85, playerY));


    document.getElementById("player").style.left =
        playerX + "%";

    document.getElementById("player").style.top =
        playerY + "%";


    // Save position after movement

    if (
        key === "w" ||
        key === "a" ||
        key === "s" ||
        key === "d"
    ) {

        await savePlayerData();

    }


    // Interaction

    if (key === "e") {

        interact();

    }


    // Map shortcuts

    if (key === "1") {
        changeArea("Village");
    }

    if (key === "2") {
        changeArea("Forest");
    }

    if (key === "3") {
        changeArea("Slime Cave");
    }

});


// =====================================
// INTERACT
// =====================================

function interact() {

    const message =
        document.getElementById("message");


    if (playerData.currentArea === "Village") {

        message.innerText =
            "Mira: Welcome, " +
            playerData.username +
            "! The forest is waiting for you.";

    }


    else if (playerData.currentArea === "Forest") {

        message.innerText =
            "A wild Green Slime appeared!";

        document.getElementById("slime")
            .style.display = "block";

    }


    else if (playerData.currentArea === "Slime Cave") {

        message.innerText =
            "The cave is dark... Something powerful is nearby.";

    }

}


// =====================================
// CHANGE AREA
// =====================================

async function changeArea(area) {

    if (!playerData) return;


    playerData.currentArea = area;


    document.getElementById("locationName")
        .innerText = area;


    document.getElementById("currentArea")
        .innerText = area;


    const buttons =
        document.querySelectorAll(".map-button");


    buttons.forEach(button => {
        button.classList.remove("active");
    });


    const message =
        document.getElementById("message");


    if (area === "Village") {

        buttons[0].classList.add("active");

        message.innerText =
            "Welcome to Peaceful Village.";

        document.getElementById("slime")
            .style.display = "none";

    }


    if (area === "Forest") {

        buttons[1].classList.add("active");

        message.innerText =
            "You entered the Green Forest. Watch out for slimes!";

        document.getElementById("slime")
            .style.display = "block";

    }


    if (area === "Slime Cave") {

        buttons[2].classList.add("active");

        message.innerText =
            "You entered the Slime Cave. The enemies are stronger!";

        document.getElementById("slime")
            .style.display = "block";

    }


    // Save area to Firebase

    await savePlayerData();

}


// =====================================
// SAVE PLAYER DATA
// =====================================

async function savePlayerData() {

    if (!currentUser || !playerData) return;


    try {

        const playerRef =
            doc(db, "players", currentUser.uid);


        await updateDoc(playerRef, {

            hp: playerData.hp,

            mp: playerData.mp,

            coins: playerData.coins,

            currentArea: playerData.currentArea,

            playerX: playerX,

            playerY: playerY,

            questProgress:
                playerData.questProgress

        });


        console.log("Game data saved.");

    } catch (error) {

        console.error(
            "Could not save game:",
            error
        );

    }

}


// =====================================
// NEXT MESSAGE
// =====================================

const messages = [

    "Use W A S D to move Kai.",

    "Press E to interact with NPCs.",

    "Visit Mira to receive quests.",

    "Visit Bobo to buy potions.",

    "Explore the forest and find the Slime Cave.",

    "Defeat the Slime King to complete your adventure!"

];

let messageIndex = 0;


window.nextMessage = function () {

    messageIndex++;

    if (messageIndex >= messages.length) {
        messageIndex = 0;
    }


    document.getElementById("message")
        .innerText = messages[messageIndex];

};


// =====================================
// MENU BUTTONS
// =====================================

window.resumeGame = function () {

    document.getElementById("message")
        .innerText =
        "Game resumed. Continue your adventure!";

};


window.openInventory = function () {

    document.getElementById("message")
        .innerText =
        "Your inventory is displayed on the left.";

};


window.showSettings = function () {

    document.getElementById("message")
        .innerText =
        "Settings will be added later.";

};


// =====================================
// SAVE BUTTON
// =====================================

window.saveGame = async function () {

    await savePlayerData();

    document.getElementById("message")
        .innerText =
        "Game saved to Firebase!";

};


// =====================================
// LOGOUT
// =====================================

window.logout = async function () {

    try {

        await signOut(auth);

        window.location.href =
            "index.html";

    } catch (error) {

        console.error(
            "Logout error:",
            error
        );

    }

};