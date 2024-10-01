"use strict"; 

// Polyfill for async/await functionality
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { 
        return value instanceof P ? value : new P(function (resolve) { resolve(value); }); 
    }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { 
            try { 
                step(generator.next(value)); 
            } catch (e) { 
                reject(e); 
            } 
        }
        function rejected(value) { 
            try { 
                step(generator["throw"](value)); 
            } catch (e) { 
                reject(e); 
            } 
        }
        function step(result) { 
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); 
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

// Global variable to hold JSON data
let jsonData; 
let currentNode = "Item Choice"; // Initial node set to "Item Choice"

// Function to load JSON data
function loadJSONData() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch("/dist/js/json/text.json"); 
            if (!response.ok) {
                throw new Error(`Failed to load JSON: ${response.statusText}`); 
            }
            jsonData = yield response.json(); 
            console.log(jsonData); 
        }
        catch (error) {
            console.log('Error loading JSON data:', error); 
        }
    });
}

// Load JSON data on script execution
loadJSONData();

// Select HTML button elements
const btn1 = document.querySelector("#btn1"); // Button 1
const btn2 = document.querySelector("#btn2"); // Button 2
const btn3 = document.querySelector("#btn3"); // Button 3

// Enum for fade direction
var FadeDirection;
(function (FadeDirection) {
    FadeDirection[FadeDirection["in"] = 0] = "in"; // Fade in
    FadeDirection[FadeDirection["out"] = 1] = "out"; // Fade out
})(FadeDirection || (FadeDirection = {}));

// Start page class to manage start page logic
class StartPage {
    Start() {
        var _a;
        // Event listener for the start button
        (_a = document.querySelector("#btnStart")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield fade(FadeDirection.out, 30, 0.025); 
                window.location.href = "/dist/views/game.html"; 
            });
        });
    }
}

// Game page class to manage game logic
class GamePage {
    beginGame() {
        fade(FadeDirection.in, 30, 0.025);
        scrollTextOnElement(jsonData.Texts.Start.text); // Display start text
        console.log("game started"); // Log game start

        const btnProgress = document.querySelector("#btnProgress"); // Select progress button
        if (btnProgress) {
            // Event listener for progress button click
            btnProgress.addEventListener("click", () => displayCurrentNode(currentNode));
        }
        else {
            console.warn("btnProgress element not found!"); 
        }
    }
}

// Function to display the current node's text and options
function displayCurrentNode(nodeKey) {
    console.log("works2"); 
    const node = jsonData.Texts[nodeKey]; // Get node data from JSON
    if (node) {
        scrollTextOnElement(node.text); // Display node text
        if (node.options) {
            displayOptions(node.options); // Display options if available
        }
    }
    else {
        console.log("End of the path or invalid node."); 
    }
}

// Function to display available options as buttons
function displayOptions(options) {
    const buttons = [btn1, btn2, btn3]; // Button array
    options.forEach((option, index) => {
        if (buttons[index]) {
            buttons[index].textContent = option.choice; // Set button text
            buttons[index].onclick = () => {
                currentNode = option.next; // Update current node
                displayCurrentNode(currentNode); // Display new node
            };
        }
    });
}

// Function to display scrolling text on the specified element
function scrollTextOnElement(text) {
    return __awaiter(this, void 0, void 0, function* () {
        let elementId = "textBox"; 
        let textArray = Array.from(text); 
        for (let i = 0; i < textArray.length; i++) {
            fireActionOnElement(elementId, function (element) {
                element.innerHTML += textArray[i]; 
            });
            yield new Promise(f => setTimeout(f, 15)); 
        }
    });
}

// Function to perform an action on a specified HTML element
function fireActionOnElement(elementId, action) {
    const element = document.getElementById(elementId); // Get element by ID
    if (element) {
        action(element); // Execute the action if element exists
    }
    else {
        console.warn(`Element with id "${elementId}" not found.`);
    }
}

// Function to handle fade in and fade out effects
function fade(direction, time, amount) {
    return __awaiter(this, void 0, void 0, function* () {
        if (direction === FadeDirection.in) {
            let opacity = 0; 
            do {
                opacity += amount; 
                document.body.style.opacity = opacity.toString();
                yield new Promise(f => setTimeout(f, time));
            } while (document.body.style.opacity != "1"); 
        }
        else if (direction == FadeDirection.out) { 
            let opacity = 1; 
            do {
                opacity -= amount; 
                document.body.style.opacity = opacity.toString(); 
                yield new Promise(f => setTimeout(f, time)); 
            } while (document.body.style.opacity > "0"); 
        }
        else {
            console.log("Unknown fade direction");
        }
    });
}

// Event listener for window load to initialize the game
window.addEventListener("load", function () {
    switch (document.body.id) {
        case "start":
            const startPage = new StartPage(); // Create instance of StartPage
            startPage.Start(); // Call start method
            break;
        case "game":
            const gamePage = new GamePage(); // Create instance of GamePage
            gamePage.beginGame(); // Call beginGame method
            break;
        default:
            console.warn("idk bru something ain't right");
            break;
    }
});

//# sourceMappingURL=main.js.map 
