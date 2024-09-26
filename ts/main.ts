console.log("I work");

class GamePage {
    public beginGame(): void {
        console.log("game started");

        (async () => {
            let opacity: number = 0;
            do {
                opacity += 0.05;
                document.body.style.opacity = opacity.toString();
                await new Promise(f => setTimeout(f, 30))
            } while (document.body.style.opacity != "1")
        })();
    }
}

class StartPage {
    public Start(): void {
        document.querySelector("#btnStart")?.addEventListener("click", function () {
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
