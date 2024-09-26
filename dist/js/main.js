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
console.log("I work");
class GamePage {
    beginGame() {
        console.log("game started");
        (() => __awaiter(this, void 0, void 0, function* () {
            let opacity = 0;
            do {
                opacity += 0.05;
                document.body.style.opacity = opacity.toString();
                yield new Promise(f => setTimeout(f, 30));
            } while (document.body.style.opacity != "1");
        }))();
    }
}
class StartPage {
    Start() {
        var _a;
        (_a = document.querySelector("#btnStart")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
            window.location.href = "/dist/views/game.html";
        });
    }
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