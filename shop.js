import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

import {
    getFirestore,
    doc,
    getDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";


/* =========================================
   FIREBASE
========================================= */

const firebaseConfig = {

    apiKey: "YOUR_API_KEY",

    authDomain:
        "YOUR_PROJECT.firebaseapp.com",

    projectId:
        "YOUR_PROJECT_ID",

    storageBucket:
        "YOUR_PROJECT.appspot.com",

    messagingSenderId:
        "YOUR_SENDER_ID",

    appId:
        "YOUR_APP_ID"
};


const app =
    initializeApp(firebaseConfig);

const auth =
    getAuth(app);

const db =
    getFirestore(app);


/* =========================================
   PLAYER
========================================= */

let currentUser = null;

let playerData = {

    gold: 125,

    inventory: {

        healthPotion: 0,

        manaPotion: 0,

        superPotion: 0

    }

};


/* =========================================
   ITEM DATA
========================================= */

const shopItems = {

    healthPotion: {

        name: "Health Potion",

        price: 20

    },

    manaPotion: {

        name: "Mana Potion",

        price: 15

    },

    superPotion: {

        name: "Super Potion",

        price: 50

    }

};


/* =========================================
   FIREBASE LOGIN
========================================= */

onAuthStateChanged(
    auth,
    async (user) => {

        if (!user) {

            window.location.href =
                "index.html";

            return;

        }


        currentUser = user;

        await loadPlayerData();

    }
);


/* =========================================
   LOAD PLAYER DATA
========================================= */

async function loadPlayerData() {

    try {

        const playerRef =
            doc(
                db,
                "players",
                currentUser.uid
            );


        const snapshot =
            await getDoc(playerRef);


        if (snapshot.exists()) {

            const data =
                snapshot.data();


            playerData.gold =
                data.gold ?? 125;


            playerData.inventory =
                data.inventory ?? {

                    healthPotion: 0,

                    manaPotion: 0,

                    superPotion: 0

                };

        }


        updateShop();

    }

    catch (error) {

        console.error(
            "Error loading player:",
            error
        );

    }

}


/* =========================================
   BUY ITEM
========================================= */

window.buyItem =
async function(itemId) {

    if (!currentUser) {

        return;

    }


    const item =
        shopItems[itemId];


    if (!item) {

        return;

    }


    /*
       Not enough gold
    */

    if (
        playerData.gold <
        item.price
    ) {

        showMessage(
            "❌ Not enough gold!"
        );

        return;

    }


    /*
       Remove gold
    */

    playerData.gold -=
        item.price;


    /*
       Add item
    */

    if (
        !playerData.inventory[itemId]
    ) {

        playerData.inventory[itemId] =
            0;

    }


    playerData.inventory[itemId]++;


    /*
       Save to Firebase
    */

    try {

        const playerRef =
            doc(
                db,
                "players",
                currentUser.uid
            );


        await updateDoc(
            playerRef,
            {

                gold:
                    playerData.gold,

                inventory:
                    playerData.inventory

            }
        );


        updateShop();


        showMessage(
            `✅ Bought ${item.name}!`
        );

    }

    catch (error) {

        console.error(error);

        showMessage(
            "❌ Could not save purchase."
        );

    }

};


/* =========================================
   UPDATE SHOP UI
========================================= */

function updateShop() {

    document.getElementById(
        "gold"
    ).textContent =
        playerData.gold;


    document.getElementById(
        "healthQuantity"
    ).textContent =
        playerData.inventory
            .healthPotion ?? 0;


    document.getElementById(
        "manaQuantity"
    ).textContent =
        playerData.inventory
            .manaPotion ?? 0;


    document.getElementById(
        "superQuantity"
    ).textContent =
        playerData.inventory
            .superPotion ?? 0;

}


/* =========================================
   MESSAGE
========================================= */

function showMessage(message) {

    const element =
        document.getElementById(
            "shopMessage"
        );


    element.textContent =
        message;


    setTimeout(
        () => {

            element.textContent =
                "Welcome to the shop!";

        },
        2500
    );

}


/* =========================================
   BACK TO VILLAGE
========================================= */

window.goBack =
function() {

    window.location.href =
        "level1.html";

};