"use strict";
var _a, _b;
var DOMObjectsLiteral = [
    "#btn1",
    "#btn2",
    "#btn3"
];
var Game = /** @class */ (function () {
    function Game(name) {
        var _this = this;
        this.playerName = name;
        DOMObjectsLiteral.forEach(function (element) {
            _this.DOMObjects.push(document.querySelector(element));
        });
    }
    Game.prototype.start = function () {
    };
    return Game;
}());
var playerName = (_a = document.querySelector("#inpName")) === null || _a === void 0 ? void 0 : _a.value;
(_b = document.querySelector("start")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", function () {
    var game = new Game(playerName);
    game.start();
});
//# sourceMappingURL=main.js.map