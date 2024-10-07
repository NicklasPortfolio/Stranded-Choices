let jsonData: any;
let isGenerating: boolean = false;
let currentNode: string = "Item Choice";
let playerInventory: string[] = [];


// Load JSON Data
async function loadJSONData(): Promise<void> {
    try {
        const response = await fetch("/dist/js/json/text.json");
        if (!response.ok) {
            throw new Error(`Failed to load JSON: ${response.statusText}`);
        }
        jsonData = await response.json();
        console.log("JSON Data Loaded:", jsonData);
    } catch (error) {
        console.log('Error loading JSON data:', error);
    }
}

loadJSONData();

// HTML Button Elements
const btn1 = document.querySelector("#btn1") as HTMLButtonElement;
const btn2 = document.querySelector("#btn2") as HTMLButtonElement;
const btn3 = document.querySelector("#btn3") as HTMLButtonElement;
const btnProgress = document.querySelector("#btnProgress") as HTMLButtonElement;

// Enum for Fade Direction
enum FadeDirection {
    "in",
    "out"
}

// Start Page Class
class StartPage {
    public Start(): void {
        document.querySelector("#btnStart")?.addEventListener("click", async function () {
            const body: HTMLElement = document.querySelector("#start") as HTMLElement;
            await fade(body, FadeDirection.out, 30, 0.025);
            window.location.href = "/dist/views/game.html";
        });
    }
}

// Game Page Class
class GamePage {
    async beginGame(): Promise<void> {
        const body: HTMLElement = document.querySelector("#game") as HTMLElement;
        await fade(body, FadeDirection.in, 30, 0.025);
        isGenerating = true;
        await scrollTextOnElement(jsonData.Texts.Start.text);
        document.querySelector("#btnProgress")?.addEventListener("click", () => displayCurrentNode(currentNode));
    }
}

async function displayCurrentNode(nodeKey: string): Promise<void> {
    const node = jsonData.Texts[nodeKey];

    if (node) {
        isGenerating = true;
        await scrollTextOnElement(node.text);
        switch (currentNode) {
            case "Item Choice":
                await ChooseItems();
                currentNode = node.next;
                displayCurrentNode(currentNode);
                break;
            case "FirstNight":
                ChangeBackground("night");
                break;
            default:
                break;
        }
        if (node.options) {
            displayOptions(node.options);
        }
    } else {
        console.log("Invalid or end node.");
    }
}

// Function to Display Options
function displayOptions(options: { choice: string, next: string }[]): void {
    const buttons = [btn1, btn2, btn3];
    const mainImg = document.querySelector("#mainImg") as HTMLElement;
    const optionsDiv = document.querySelector("#options") as HTMLElement;
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
async function scrollTextOnElement(text: string): Promise<void> {
    let elementId: string = "textBox";
    let textArray: string[] = Array.from(text);
    if (isGenerating) {
        fireActionOnElement(elementId, function (element) {
            element.textContent = "";
        })
        for (let i: number = 0; i < textArray.length; i++) {
            fireActionOnElement(elementId, function (element) {
                element.textContent += textArray[i];
            })
            await new Promise(f => setTimeout(f, 15));
        }
    }
    isGenerating = false;
}

// Fire Action on an Element
function fireActionOnElement<T extends HTMLElement>(elementId: string, action: (element: T) => void): void {
    const element = document.getElementById(elementId) as T | null;

    if (element) {
        action(element);
    } else {
        console.warn(`Element with id "${elementId}" not found.`);
    }
}

function ChooseItems(): Promise<void> {
    return new Promise((resolve) => {
        const suitcase = document.querySelector("#suitcase")! as HTMLElement;
        const items = document.querySelector("#items")!.children;
        let amtItems = 0;

        suitcase.style.display = "block";

        for (let i: number = 0; i < items.length; i++) {
            let itemType: string = items[i].id;

            items[i].addEventListener("mouseover", function () {
                isGenerating = true;
                scrollTextOnElement(jsonData.Texts["Item Choice"]["ItemTexts"][0][items[i].id]);
            })

            items[i].addEventListener("click", function () {
                if (amtItems < 3 && !playerInventory.includes(itemType)) {
                    let item = items[i] as HTMLElement;
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

async function fade(object: HTMLElement, direction: FadeDirection, time: number, amount: number): Promise<void> {
    if (direction === FadeDirection.in) {
        let opacity: number = 0;
        do {
            opacity += amount;
            object.style.opacity = opacity.toString();
            await new Promise(f => setTimeout(f, time));
        } while (object.style.opacity != "1");
    } else if (direction === FadeDirection.out) {
        let opacity: number = 1;
        do {
            opacity -= amount;
            object.style.opacity = opacity.toString();
            await new Promise(f => setTimeout(f, time));
        } while (object.style.opacity > "0");
    } else {
        console.log("Unknown fade direction");
    }
}

async function ChangeBackground(background: string) {
    const backgroundImg: HTMLElement = document.querySelector("mainImg") as HTMLElement;
    await fade(backgroundImg, FadeDirection.out, 30, 0.025);
    backgroundImg.style.background = `../img/${background}.png`
    await fade(backgroundImg, FadeDirection.in, 30, 0.025);
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
