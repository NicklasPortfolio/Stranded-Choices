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
let currentNode = "Item Choice";
let playerInventory = [];
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
loadJSONData();
const btn1 = document.querySelector("#btn1");
;
const btn2 = document.querySelector("#btn2");
;
const btn3 = document.querySelector("#btn3");
;
var FadeDirection;
(function (FadeDirection) {
    FadeDirection[FadeDirection["in"] = 0] = "in";
    FadeDirection[FadeDirection["out"] = 1] = "out";
})(FadeDirection || (FadeDirection = {}));
class StartPage {
    Start() {
        var _a;
        (_a = document.querySelector("#btnStart")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield fade(FadeDirection.out, 30, 0.025);
                window.location.href = "/dist/views/game.html";
            });
        });
    }
}
class GamePage {
    beginGame() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            yield fade(FadeDirection.in, 30, 0.025);
            yield scrollTextOnElement(jsonData.Texts.Start.text);
            (_a = document.querySelector("#btnProgress")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => displayCurrentNode(currentNode));
        });
    }
}
function displayCurrentNode(nodeKey) {
    return __awaiter(this, void 0, void 0, function* () {
        const node = jsonData.Texts[nodeKey];
        if (node) {
            yield scrollTextOnElement(node.text);
            if (node.options) {
                displayOptions(node.options);
            }
            if (currentNode == "Item Choice") {
                yield ChooseItems();
                currentNode = node.next;
                displayCurrentNode(currentNode);
            }
        }
        else {
            console.log("End of the path or invalid node.");
        }
    });
}
function displayOptions(options) {
    const buttons = [btn1, btn2, btn3];
    options.forEach((option, index) => {
        if (buttons[index]) {
            buttons[index].textContent = option.choice;
            buttons[index].onclick = () => {
                currentNode = option.next;
                displayCurrentNode(currentNode);
            };
        }
    });
}
function scrollTextOnElement(text) {
    return __awaiter(this, void 0, void 0, function* () {
        let elementId = "textBox";
        let textArray = Array.from(text);
        fireActionOnElement(elementId, function (element) {
            element.textContent = "";
        });
        for (let i = 0; i < textArray.length; i++) {
            fireActionOnElement(elementId, function (element) {
                element.textContent += textArray[i];
            });
            yield new Promise(f => setTimeout(f, 15));
        }
    });
}
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
            items[i].addEventListener("click", function () {
                if (amtItems < 2 && !playerInventory.includes(itemType)) {
                    playerInventory.push(itemType);
                    amtItems++;
                    if (amtItems === 2) {
                        suitcase.style.display = "none";
                        resolve();
                    }
                }
            });
        }
    });
}
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
        else if (direction = FadeDirection.out) {
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
            console.warn("idk bru something ain't right");
            break;
    }
});
//# sourceMappingURL=main.js.map