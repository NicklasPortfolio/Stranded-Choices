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
let currentNode = "Start";
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
        var _a;
        console.log("game started");
        fade(FadeDirection.in, 30, 0.025);
        scrollTextOnElement(jsonData.Texts.Start);
        (_a = document.querySelector("#btnProgress")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
            displayCurrentNode(currentNode);
        });
    }
}
function displayCurrentNode(nodeKey) {
    const node = jsonData.Texts[nodeKey];
    if (node) {
        scrollTextOnElement(node.text);
        displayOptions(node.options);
    }
    else {
        console.log("End of the path or invalid node.");
    }
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
        let elementId = "btnText";
        let textArray = Array.from(text);
        for (let i = 0; i < textArray.length; i++) {
            fireActionOnElement(elementId, function (element) {
                element.innerHTML += textArray[i];
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