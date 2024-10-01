let jsonData: any;
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
            await fade(FadeDirection.out, 30, 0.025);
            window.location.href = "/dist/views/game.html";
        });
    }
}

// Game Page Class
class GamePage {
    async beginGame(): Promise<void> {
        await fade(FadeDirection.in, 30, 0.025);
        await scrollTextOnElement(jsonData.Texts.Start.text);
        document.querySelector("#btnProgress")?.addEventListener("click", () => displayCurrentNode(currentNode));
    }
}

async function displayCurrentNode(nodeKey: string): Promise<void> {
    const node = jsonData.Texts[nodeKey];
    const suitcaseElement = document.querySelector(".suitcase-image") as HTMLElement;

    if (node) {
        await scrollTextOnElement(node.text);
        if (node.options) {
            displayOptions(node.options);
        }
        if (currentNode == "Item Choice") {
            await ChooseItems();
            currentNode = node.next;
            displayCurrentNode(currentNode);
        }
    } else {
        console.log("Invalid or end node.");
    }
}

window.addEventListener("DOMContentLoaded", () => {
    const btnProgress = document.querySelector("#btnProgress") as HTMLDivElement;

    if (btnProgress) {
        btnProgress.addEventListener("click", () => {
            console.log("btnProgress clicked!");

            // Update the text to indicate the next step
            currentNode = "Item Choice";
            displayCurrentNode(currentNode);
        });
    } else {
        console.warn("btnProgress element not found in the DOM!");
    }
});

// Function to Display Options
function displayOptions(options: { choice: string, next: string }[]): void {
    const buttons = [btn1, btn2, btn3];

    options.forEach((option, index) => {
        if (buttons[index]) {
            buttons[index].textContent = option.choice;
            buttons[index].style.display = "block";
            buttons[index].onclick = () => {
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

async function fade(direction: FadeDirection, time: number, amount: number): Promise<void> {
    if (direction === FadeDirection.in) {
        let opacity: number = 0;
        do {
            opacity += amount;
            document.body.style.opacity = opacity.toString();
            await new Promise(f => setTimeout(f, time));
        } while (document.body.style.opacity != "1");
    } else if (direction === FadeDirection.out) {
        let opacity: number = 1;
        do {
            opacity -= amount;
            document.body.style.opacity = opacity.toString();
            await new Promise(f => setTimeout(f, time));
        } while (document.body.style.opacity > "0");
    } else {
        console.log("Unknown fade direction");
    }
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
