/* =========================================
   LEVEL 1 - VILLAGE
   CAMERA FOLLOW SYSTEM
========================================= */

const kai = document.getElementById("kai");
const world = document.getElementById("world");
const map = document.querySelector(".village-map");

const interaction =
    document.getElementById("interaction");

const interactionText =
    document.getElementById("interactionText");

const dialogueText =
    document.getElementById("dialogueText");


/* =========================================
   MAP SIZE
========================================= */

const MAP_WIDTH = 1600;
const MAP_HEIGHT = 1067;


/* =========================================
   PLAYER
========================================= */

const player = {

    /*
       Kai's position inside the map
    */

    x: 650,
    y: 560,

    width: 75,
    height: 100,

    speed: 4,

    hp: 100,
    maxHp: 100,

    mana: 50,
    maxMana: 50,

    gold: 125,

    level: 1
};


/* =========================================
   CAMERA
========================================= */

const camera = {

    x: 0,
    y: 0,

    /*
       Camera smoothness
    */

    smoothness: 0.12

};


/* =========================================
   KEYBOARD
========================================= */

const keys = {};


/* =========================================
   KEY DOWN
========================================= */

document.addEventListener(
    "keydown",
    function(event) {

        const key =
            event.key.toLowerCase();

        keys[key] = true;


        if (
            key === "w" ||
            key === "a" ||
            key === "s" ||
            key === "d" ||
            key === "e"
        ) {

            event.preventDefault();

        }


        /*
           Interact
        */

        if (key === "e") {

            interact();

        }

    }
);


/* =========================================
   KEY UP
========================================= */

document.addEventListener(
    "keyup",
    function(event) {

        const key =
            event.key.toLowerCase();

        keys[key] = false;

    }
);


/* =========================================
   MOVE PLAYER
========================================= */

function movePlayer() {

    let moving = false;


    /*
       UP
    */

    if (keys["w"]) {

        player.y -= player.speed;

        moving = true;

    }


    /*
       DOWN
    */

    if (keys["s"]) {

        player.y += player.speed;

        moving = true;

    }


    /*
       LEFT
    */

    if (keys["a"]) {

        player.x -= player.speed;

        moving = true;

    }


    /*
       RIGHT
    */

    if (keys["d"]) {

        player.x += player.speed;

        moving = true;

    }


    /*
       Keep Kai inside map
    */

    player.x = Math.max(
        40,
        Math.min(
            MAP_WIDTH - 40,
            player.x
        )
    );


    player.y = Math.max(
        50,
        Math.min(
            MAP_HEIGHT - 70,
            player.y
        )
    );


    /*
       Walking animation
    */

    if (moving) {

        kai.classList.add("walking");

    } else {

        kai.classList.remove("walking");

    }

}


/* =========================================
   CAMERA FOLLOW
========================================= */

function updateCamera() {

    /*
       Put Kai in the center
       of the screen
    */

    const screenWidth =
        world.clientWidth;

    const screenHeight =
        world.clientHeight;


    let targetX =
        player.x -
        screenWidth / 2;


    let targetY =
        player.y -
        screenHeight / 2;


    /*
       Don't show outside the map
    */

    const maxCameraX =
        MAP_WIDTH - screenWidth;

    const maxCameraY =
        MAP_HEIGHT - screenHeight;


    targetX = Math.max(
        0,
        Math.min(
            maxCameraX,
            targetX
        )
    );


    targetY = Math.max(
        0,
        Math.min(
            maxCameraY,
            targetY
        )
    );


    /*
       Smooth camera movement
    */

    camera.x +=
        (targetX - camera.x) *
        camera.smoothness;


    camera.y +=
        (targetY - camera.y) *
        camera.smoothness;


    /*
       Move map
    */

    map.style.transform =
        `translate(${-camera.x}px, ${-camera.y}px)`;


    /*
       Move objects together with map
    */

    kai.style.transform =
        `translate(
            ${player.x - camera.x - player.width / 2}px,
            ${player.y - camera.y - player.height / 2}px
        )`;


    /*
       Move forest sign with map
    */

    const forestSign =
        document.getElementById(
            "forestExit"
        );

    if (forestSign) {

        forestSign.style.transform =
            `translate(
                ${-camera.x}px,
                ${-camera.y}px
            )`;

    }

}


/* =========================================
   GAME LOOP
========================================= */

function gameLoop() {

    movePlayer();

    updateCamera();

    checkNearby();

    requestAnimationFrame(
        gameLoop
    );

}


gameLoop();


/* =========================================
   NEARBY INTERACTION
========================================= */

function checkNearby() {

    /*
       Forest entrance
    */

    if (
        player.x > 1200 &&
        player.y < 300
    ) {

        showInteraction(
            "Press E to enter the Green Forest"
        );

        return;

    }


    /*
       Village shop
    */

    if (
        player.x < 500 &&
        player.y < 500
    ) {

        showInteraction(
            "Press E to check the Shop"
        );

        return;

    }


    /*
       Fountain
    */

    if (
        player.x > 550 &&
        player.x < 750 &&
        player.y > 400 &&
        player.y < 700
    ) {

        showInteraction(
            "Press E to use the Fountain"
        );

        return;

    }


    hideInteraction();

}


/* =========================================
   SHOW INTERACTION
========================================= */

function showInteraction(text) {

    interactionText.textContent =
        text;

    interaction.classList.add(
        "show"
    );

}


/* =========================================
   HIDE INTERACTION
========================================= */

function hideInteraction() {

    interaction.classList.remove(
        "show"
    );

}


/* =========================================
   INTERACT
========================================= */

function interact() {

    /*
       FOREST
    */

    if (
        player.x > 1200 &&
        player.y < 300
    ) {

        dialogueText.textContent =
            "The Green Forest is ahead. Time for an adventure!";

        setTimeout(
            function() {

                window.location.href =
                    "forest.html";

            },
            1000
        );

        return;

    }


    /*
       SHOP
    */

    if (
    player.x < 500 &&
    player.y < 500
) {
    dialogueText.textContent =
        "Welcome to the village shop! Press E to enter.";
    window.location.href =
        "shop.html";

    return;
}


    /*
       FOUNTAIN
    */

    if (
        player.x > 550 &&
        player.x < 750 &&
        player.y > 400 &&
        player.y < 700
    ) {

        player.hp =
            player.maxHp;

        player.mana =
            player.maxMana;

        updateHUD();

        dialogueText.textContent =
            "The fountain restored Kai's HP and Mana!";

        return;

    }


    dialogueText.textContent =
        "There is nothing to interact with here.";

}


/* =========================================
   UPDATE HUD
========================================= */

function updateHUD() {

    const hpPercent =
        (player.hp /
        player.maxHp) * 100;


    const manaPercent =
        (player.mana /
        player.maxMana) * 100;


    document.getElementById(
        "hpBar"
    ).style.width =
        hpPercent + "%";


    document.getElementById(
        "manaBar"
    ).style.width =
        manaPercent + "%";


    document.getElementById(
        "hpText"
    ).textContent =
        `${player.hp} / ${player.maxHp}`;


    document.getElementById(
        "manaText"
    ).textContent =
        `${player.mana} / ${player.maxMana}`;


    document.getElementById(
        "gold"
    ).textContent =
        player.gold;

}


updateHUD();