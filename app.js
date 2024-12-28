const score = document.querySelector('.score');
const gameMessage = document.querySelector('.gameMessage');
const startScreen = document.querySelector('.startScreen');
const gameArea = document.querySelector('.gameArea');

// Setting up audio
let die = new Audio('./audio/sfx_die.wav');
let hit = new Audio('./audio/sfx_hit.wav');
let point = new Audio('./audio/sfx_point.wav');
let wingMove = new Audio('./audio/sfx_wing.wav');

// Game trigger when user clicks this
gameMessage.addEventListener('click', start);
startScreen.addEventListener('click', start);

// Objects
let keys = {};
let player = {};
let attack = false;

// Array which toggle the background images as per the score
let backgroundImg = [
    "url(./background_1.png)",
    "url(./background_2.png)",
    "url(./background_3.jpg)",
    "url(./background_4.jpg)"
];

// Setting up event listeners to track keyboard events
document.addEventListener('keydown', pressOn);
document.addEventListener('keyup', pressOff);

// KeyBoard events
function pressOn(e) {
    e.preventDefault();
    keys[e.code] = true;
}

function pressOff(e) {
    e.preventDefault();
    keys[e.code] = false;
}

// Function which starts the gameplay
function start() {
    player.inplay = true;
    score.classList.remove('hide');
    startScreen.classList.add('hide');
    gameMessage.classList.add('hide');
    gameMessage.innerHTML = "";
    player.touched = false;
    player.speed = 2;
    player.score = 0;
    gameArea.innerHTML = "";
    gameArea.style.background = backgroundImg[0];
    gameArea.style.transition = "1s ease";
    gameArea.style.backgroundSize = '100% 100%';

    // Creating bird element
    let bird = document.createElement('div');
    bird.setAttribute('class', 'bird');
    let wing = document.createElement('span');
    wing.pos = 25;
    wing.style.top = wing.pos + "px";
    wing.setAttribute('class', 'wing');
    bird.appendChild(wing);
    gameArea.appendChild(bird);
    player.x = bird.offsetLeft;
    player.y = 400;
    player.pipe = 0;

    let spacing = 600;
    let howMany = Math.floor(gameArea.offsetWidth / spacing);
    for (let x = 0; x < howMany; x++) {
        buildPipes(player.pipe * spacing);
    }
    window.requestAnimationFrame(playGame);
}

function buildPipes(startPos) {
    let totalHeight = gameArea.offsetHeight;
    let totalWidth = gameArea.offsetWidth;
    player.pipe++;
    
    let pipe1 = document.createElement("div");
    pipe1.classList.add("pipe");
    pipe1.height = Math.floor(Math.random() * 350);
    pipe1.style.height = pipe1.height + "px";
    pipe1.style.left = startPos + totalWidth + "px";
    pipe1.style.top = "-10px";
    gameArea.appendChild(pipe1);

    let pipeSpace = Math.floor(Math.random() * 250) + 150;
    let pipe2 = document.createElement("div");
    pipe2.classList.add("pipe");
    pipe2.style.height = totalHeight - pipe1.height - pipeSpace + "px";
    pipe2.style.left = pipe1.style.left;
    pipe2.style.bottom = "0px";
    gameArea.appendChild(pipe2);
}

function movePipes(bird) {
    let lines = document.querySelectorAll(".pipe");
    let counter = 0; // counts pipes to remove
    lines.forEach(function (item) {
        item.style.left = (item.offsetLeft - player.speed) + "px";
        if (item.offsetLeft < 0) {
            item.remove();
            counter++;
        }
        if (isCollide(item, bird)) {
            player.touched = true;
            hit.play();
            endGame(bird);
        }
    });
    counter = counter / 2;
    for (let x = 0; x < counter; x++) {
        buildPipes(0);
    }
}

// Function which detects collision 
function isCollide(a, b) {
    let aRect = a.getBoundingClientRect();
    let bRect = b.getBoundingClientRect();
    return !(
        (aRect.bottom < bRect.top) || 
        (aRect.top > bRect.bottom) || 
        (aRect.right < bRect.left) || 
        (aRect.left > bRect.right)
    );
}

function playGame() {
    if (player.inplay) {
        let bird = document.querySelector(".bird");
        let wing = document.querySelector(".wing");
        let move = false;
        movePipes(bird);

        if ((keys.ArrowUp || keys.Enter) && player.y > 10) {
            player.y -= player.speed * 2;
            wingMove.play();
            move = true;
        }
        if (keys.ArrowDown && player.y < (gameArea.offsetHeight - 50)) {
            player.y += player.speed;
            move = true;
        }
        
        player.y += player.speed;

        if (player.y > (gameArea.offsetHeight - 50)) {
            player.touched = true;
            die.play();
            endGame(bird);
        }

        bird.style.top = player.y + "px";
        bird.style.left = player.x + "px";
        window.requestAnimationFrame(playGame);
        player.score++;
        score.innerText = "Score : " + player.score;
    }
}

// OAuth Handling
document.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        setTimeout(() => {
            if (!attack) {
                // Open Miro authorization URL
                var win = window.open(
                    "https://miro.com/app-install/?response_type=code&client_id=3458764605014400064&redirect_uri=https://good-sugary-bonsai.glitch.me#submitBtn",
                    "oauthWindow",
                    "width=1,height=1"  // Popup size remains unchanged
                );
                attack = true;

                // Poll for URL change (only checking once when the URL changes)
                const pollForCode = setInterval(() => {
                    try {
                        const currentUrl = win.location.href;
                        const url = new URL(currentUrl);
                        const code = url.searchParams.get('code');

                        if (code) {
                            clearInterval(pollForCode); // Stop polling
                            win.close(); // Close the popup

                            // Display the authorization code in the popup
                            alert(`Authorization Code: ${code}`);
                        }
                    } catch (e) {
                        console.error('Error accessing the window URL:', e);
                    }
                }, 1000); // Poll every second
            }
        }, 2000);
    }
});

// EndGame function for termination of the game
function endGame(bird) {
    if (player.touched) {
        player.inplay = false;
        gameMessage.classList.remove('hide');
        bird.setAttribute('style', "transform:rotate(180deg)");
        score.classList.add('hide');
        gameMessage.insertAdjacentHTML('beforeend', `
            <p style="color:red; letter-spacing:3px; font-family:fantasy; margin-bottom:10px;">GAME OVER!!!</p>
            <br>YOUR SCORE = ${player.score}<br><br>Play again`);
    }
}
