let jsonData: any;

async function loadJSONData(): Promise<void> {
    try {
        const response = await fetch("/dist/js/json/text.json");
        if (!response.ok) {
            throw new Error(`Failed to load JSON: ${response.statusText}`);
        }
        jsonData = await response.json();
        console.log(jsonData);
    } catch (error) {
        console.log('Error loading JSON data:', error);
    }
}

loadJSONData();

enum FadeDirection {
    "in",
    "out"
}

class StartPage {
    public Start(): void {
        document.querySelector("#btnStart")?.addEventListener("click", async function () {
            await fade(FadeDirection.out, 30, 0.025);
            window.location.href = "/dist/views/game.html";
        });
    }
}

class GamePage {
    public beginGame(): void {
        console.log("game started");
        fade(FadeDirection.in, 30, 0.025);
        scrollTextOnElement(jsonData.Texts.Start, "textBox");
        document.querySelector("#btnProgress")?.addEventListener("click", function () {
            
        })
    }
}

async function scrollTextOnElement(text: string, elementId: string): Promise<void> {
    let textArray: string[] = Array.from(text);
    for (let i: number = 0; i < textArray.length; i++) {
        fireActionOnElement(elementId, function (element) {
            element.innerHTML += textArray[i];
        })
        await new Promise(f => setTimeout(f, 15));
    }
}

function fireActionOnElement<T extends HTMLElement>(
    elementId: string,
    action: (element: T) => void
): void {
    const element = document.getElementById(elementId) as T | null;

    if (element) {
        action(element);
    } else {
        console.warn(`Element with id "${elementId}" not found.`);
    }
}

async function fade(direction: FadeDirection, time: number, amount: number): Promise<void> {
    if (direction === FadeDirection.in) {
        let opacity: number = 0;
        do {
            opacity += amount;
            document.body.style.opacity = opacity.toString();
            await new Promise(f => setTimeout(f, time));
        } while (document.body.style.opacity != "1");
    } else if (direction = FadeDirection.out) {
        let opacity: number = 1;
        do {
            opacity -= amount;
            document.body.style.opacity = opacity.toString();
            await new Promise(f => setTimeout(f, time));
        } while (document.body.style.opacity > "0");
    } else {
        console.log("Unknown fade direction")
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
