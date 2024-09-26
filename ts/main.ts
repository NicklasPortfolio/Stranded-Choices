enum FadeDirection {
    "in",
    "out"
}

class GamePage {
    public beginGame(): void {
        console.log("game started");

        fade(FadeDirection.in, 30, 0.025)
    }
}

class StartPage {
    public Start(): void {
        document.querySelector("#btnStart")?.addEventListener("click", async function () {
            await fade(FadeDirection.out, 30, 0.025);
            window.location.href = "/dist/views/game.html";
        });
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
