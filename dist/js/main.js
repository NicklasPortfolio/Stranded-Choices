"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let jsonData;
let isGenerating = false;
let currentNode = "Item Choice";
let playerInventory = [];
// Load JSON Data
function loadJSONData() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch("/dist/js/json/text.json");
            if (!response.ok) {
                throw new Error(`Failed to load JSON: ${response.statusText}`);
            }
            jsonData = yield response.json();
            console.log("JSON Data Loaded:", jsonData);
        }
        catch (error) {
            console.log('Error loading JSON data:', error);
        }
    });
}
loadJSONData();
// HTML Button Elements
const btn1 = document.querySelector("#btn1");
const btn2 = document.querySelector("#btn2");
const btn3 = document.querySelector("#btn3");
const btnProgress = document.querySelector("#btnProgress");
// Enum for Fade Direction
var FadeDirection;
(function (FadeDirection) {
    FadeDirection[FadeDirection["in"] = 0] = "in";
    FadeDirection[FadeDirection["out"] = 1] = "out";
})(FadeDirection || (FadeDirection = {}));
// Start Page Class
class StartPage {
    Start() {
        var _a;
        (_a = document.querySelector("#btnStart")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const body = document.querySelector("#start");
                yield fade(body, FadeDirection.out, 30, 0.025);
                window.location.href = "/dist/views/game.html";
            });
        });
    }
}
// Game Page Class
class GamePage {
    beginGame() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const body = document.querySelector("#game");
            yield fade(body, FadeDirection.in, 30, 0.025);
            isGenerating = true;
            yield scrollTextOnElement(jsonData.Texts.Start.text);
            (_a = document.querySelector("#btnProgress")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => displayCurrentNode(currentNode));
        });
    }
}
function displayCurrentNode(nodeKey) {
    return __awaiter(this, void 0, void 0, function* () {
        const node = jsonData.Texts[nodeKey];
        if (node) {
            isGenerating = true;
            yield scrollTextOnElement(node.text);
            if (node.options) {
                displayOptions(node.options);
            }
            switch (currentNode) {
                case "Item Choice":
                    yield ChooseItems();
                    currentNode = node.next;
                    displayCurrentNode(currentNode);
                    break;
                case "FirstNight":
                    break;
                default:
                    break;
            }
        }
        else {
            console.log("Invalid or end node.");
        }
    });
}
// Function to Display Options
function displayOptions(options) {
    const buttons = [btn1, btn2, btn3];
    const mainImg = document.querySelector("#mainImg");
    const optionsDiv = document.querySelector("#options");
    mainImg.style.height = "70vh";
    optionsDiv.style.display = "flex";
    options.forEach((option, index) => {
        if (buttons[index]) {
            buttons[index].textContent = option.choice;
            buttons[index].style.display = "block";
            buttons[index].onclick = () => {
                mainImg.style.height = "80vh";
                optionsDiv.style.display = "none";
                currentNode = option.next;
                displayCurrentNode(currentNode);
            };
        }
    });
}
// Scroll Text on Element
function scrollTextOnElement(text) {
    return __awaiter(this, void 0, void 0, function* () {
        let elementId = "textBox";
        let textArray = Array.from(text);
        if (isGenerating) {
            fireActionOnElement(elementId, function (element) {
                element.textContent = "";
            });
            for (let i = 0; i < textArray.length; i++) {
                fireActionOnElement(elementId, function (element) {
                    element.textContent += textArray[i];
                });
                yield new Promise(f => setTimeout(f, 15));
            }
        }
        isGenerating = false;
    });
}
// Fire Action on an Element
function fireActionOnElement(elementId, action) {
    const element = document.getElementById(elementId);
    if (element) {
        action(element);
    }
    else {
        console.warn(`Element with id "${elementId}" not found.`);
    }
}
function ChooseItems() {
    return new Promise((resolve) => {
        const suitcase = document.querySelector("#suitcase");
        const items = document.querySelector("#items").children;
        let amtItems = 0;
        suitcase.style.display = "block";
        for (let i = 0; i < items.length; i++) {
            let itemType = items[i].id;
            items[i].addEventListener("mouseover", function () {
                isGenerating = true;
                scrollTextOnElement(jsonData.Texts["Item Choice"]["ItemTexts"][0][items[i].id]);
            });
            items[i].addEventListener("click", function () {
                if (amtItems < 3 && !playerInventory.includes(itemType)) {
                    let item = items[i];
                    playerInventory.push(itemType);
                    item.style.display = "none";
                    amtItems++;
                    if (amtItems === 3) {
                        suitcase.style.display = "none";
                        resolve();
                    }
                }
            });
        }
    });
}
function fade(object, direction, time, amount) {
    return __awaiter(this, void 0, void 0, function* () {
        if (direction === FadeDirection.in) {
            let opacity = 0;
            do {
                opacity += amount;
                object.style.opacity = opacity.toString();
                yield new Promise(f => setTimeout(f, time));
            } while (object.style.opacity != "1");
        }
        else if (direction === FadeDirection.out) {
            let opacity = 1;
            do {
                opacity -= amount;
                object.style.opacity = opacity.toString();
                yield new Promise(f => setTimeout(f, time));
            } while (object.style.opacity > "0");
        }
        else {
            console.log("Unknown fade direction");
        }
    });
}
// Event Listener for Window Load
window.addEventListener("load", function () {
    switch (document.body.id) {
        case "start":
            const startPage = new StartPage();
            startPage.Start();
            break;
        case "game":
            const gamePage = new GamePage();
            gamePage.beginGame();
            break;
        default:
            console.warn("Unknown page ID");
            break;
    }
});
//# sourceMappingURL=main.js.map