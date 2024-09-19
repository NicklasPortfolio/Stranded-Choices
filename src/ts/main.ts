const DOMObjectsLiteral: string[] = [
    "#btn1",
    "#btn2",
    "#btn3"
];

class Game {
    readonly DOMObjects!: HTMLElement[];
    playerName: string;

    public constructor(name: string) {
        this.playerName = name;

        DOMObjectsLiteral.forEach(element => {
            this.DOMObjects.push(document.querySelector(element) as HTMLElement);
        });
    }

    public start(): void {
        
    }
}

const playerName: string | undefined = (document.querySelector("#inpName") as HTMLInputElement)?.value;

document.querySelector("start")?.addEventListener("click", function() {
    const game = new Game(playerName)
    game.start();
})