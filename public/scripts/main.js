const score = document.querySelector(".score");
const gameArea = document.querySelector(".game__area");
const startScreen = document.querySelector(".game__start-screen");
const gameOver = document.querySelector(".game-over");
const gameOverScore = document.querySelector(".game-over__score");
const restartButton = document.querySelector(".game-over__restart-btn")

document.addEventListener("keydown", pressOn);
document.addEventListener("keyup", pressOff);
startScreen.addEventListener("click", start);
restartButton.addEventListener("click", restartGame);

let keys = {};
let bird
let pipe;

function start() {
    startScreen.classList.add("hide");
    bird = new Bird(50, 100, 50, 40, 5, document)
    pipe = new Pipe(document, bird);
    pipe.buildPipes();
    window.requestAnimationFrame(playGame)
}

function restartGame() {
    this.inPlay = true;
    gameOver.classList.add("hide");
    startScreen.classList.remove("hide");
    gameArea.innerHTML = "";
}

function pressOn(e) {
    e.preventDefault();
    keys[e.code] = true;
    bird.setKeys(keys);
}

function pressOff(e) {
    e.preventDefault();
    keys[e.code] = false;
    bird.setKeys(keys);
}

function playGame() {
    if(bird.getinPlay()) {
        bird.moveBird();
        bird.moveWing()
        bird.incrementScore();
        bird.applyGravity();
        pipe.movePipes(bird);
        window.requestAnimationFrame(playGame)
    }
}

class Bird {
    birdWing;
    counter = 0;
    velocity = 1;
    acceleration = 0.2;
    score = 0;
    yOffset = 10;
    document;

    keys = {
        ArrowLeft: false,
        ArrowRight: false,
        ArrowUp: false,
        ArrowDown: false,
        Space: false
    };

    move = false;

    wing = {
        pos: 15,
        rotate: 20
    }

    constructor(x, y, width, height, speed, document) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.width = width;
        this.height = height;
        this.inPlay = true;
        this.document = document;
        this.makeBird();
    }

    makeBird() {
        let bird = this.document.createElement("div");
        let wing = this.document.createElement("span");
        bird.setAttribute("class", "bird")
        wing.setAttribute("class", "wing");
        bird.appendChild(wing);
        gameArea.appendChild(bird);

        bird.style.top = this.y + "px";
        bird.style.left = this.x + "px";
        bird.style.width = this.width + "px";
        bird.style.height = this.height + "px";
        this.moveWing();
    }

    moveWing() {
        this.getBirdWing().style.transform = "rotate(" + 20 + "deg)";
        if(this.move) {
            this.counter++;
            if(this.counter % 10 > 5) {
                this.wing.rotate = (this.wing.rotate === 20) ? -20 : 20;
                this.getBirdWing().style.transform =  "rotate(" + this.wing.rotate + "deg)";
            }
        }
        this.move = false;
    }

    moveBird() {
        this.getBird().style.top = this.y + "px";
        this.getBird().style.left = this.x + "px";

        if(this.keys.ArrowLeft && this.x >= 0) {
            this.move = true;
            this.x -= this.speed;
        }
        if(this.keys.ArrowRight && this.x <= gameArea.offsetWidth - this.width) {
            this.move = true;
            this.x += this.speed;
        }
        if(this.keys.ArrowUp || keys.Space && this.y >= 0) {
                this.move = true;
                this.y -= this.speed;
        }
        if(this.keys.ArrowDown && this.y <= gameArea.offsetHeight + this.yOffset) {
            this.move = true;
            this.y += this.speed;
        }
    }

    applyGravity() {
        if(this.keys.ArrowUp && this.inPlay) {
            this.velocity = 1;
            this.acceleration = 0.2;
        }
        if(this.inPlay) {
            this.velocity += this.acceleration;
            this.y += this.velocity;
        }
        if(this.y >= gameArea.offsetHeight + this.yOffset + this.height) {
            this.gameOver();
        }
    }

    incrementScore() {
        this.score++;
        score.innerHTML = "Score: " + this.score;

    }

    gameOver() {
        this.inPlay = false;
        gameOver.classList.remove("hide");
        gameOverScore.innerHTML = this.score.toString();
        score.innerHTML = "0";
    }

    getSpeed() {
        return this.speed;
    }

    setSpeed(speed) {
        this.speed = speed;
    }

    setKeys(keys) {
        this.keys = keys;
    }

    getScore() {
        return this.score;
    }

    getBird() {
        return this.document.querySelector(".bird");
    }

    getWidth() {
        return this.width;
    }

    getBirdWing() {
        return this.document.querySelector(".wing");
    }

    setinPlay(inPlay) {
        this.inPlay = inplay;
    }

    getinPlay() {
        return this.inPlay;
    }
}

class Pipe {
    pipe = 0;
    spacing = 300;
    amount = Math.floor((gameArea.offsetWidth) / this.spacing);
    pipe1;
    pipe2;
    speed;

    constructor(document, bird) {
        this.document = document;
        this.bird = bird;
        this.speed = this.bird.getSpeed();
    }

    buildPipes() {
        let position;

        for(let i = 0; i < this.amount; i++) {
            position = this.pipe * this.spacing;
            this.createPipes(position);
        }
    }

    createPipes(position) {
        let totalHeight = gameArea.offsetHeight;
        let totalWidth = gameArea.offsetWidth;
        this.pipe++;
        this.pipe1 = this.document.createElement("div");
        this.pipe1.start = position + totalWidth;
        this.pipe1.classList.add("pipe1");
        this.pipe1.height = Math.floor(Math.random() * 350);
        this.pipe1.style.height = this.pipe1.height + "px";
        this.pipe1.style.left = this.pipe1.start + "px";
        this.pipe1.style.top = score.offsetHeight + "px";
        this.pipe1.x = this.pipe1.start;
        this.pipe1.id = "" + this.pipe;
        this.pipe1.style.zIndex = "50";
        gameArea.appendChild(this.pipe1);
        let pipeSpace = Math.floor((Math.random() * 250) + 150) ;
        this.pipe2 = document.createElement("div");
        this.pipe2.start = this.pipe1.start;
        this.pipe2.classList.add("pipe2");
        this.pipe2.height = Math.floor(Math.random() * 350);
        this.pipe2.style.height = totalHeight - (this.pipe1.height + pipeSpace) + "px";
        this.pipe2.style.left = this.pipe1.start + "px";
        this.pipe2.style.bottom = "0px";
        this.pipe2.x = this.pipe1.start;
        this.pipe2.id = "" + this.pipe;
        gameArea.appendChild(this.pipe2)
    }

    movePipes() {
        let pipes = document.querySelectorAll(".pipe1, .pipe2");
        let counter = 0;
        let pipeWidth = 100;
        let speed = this.getSpeed();
        let pipe = this;

        if(this.bird.getScore() % 800 === 0) {
            this.setSpeed(this.getSpeed() + 1);
        }

        pipes.forEach(function (node) {
            node.x -= speed;
            node.style.left = node.x + "px";
            if (node.x + pipeWidth > gameArea.offsetWidth) {
                node.classList.add("hide");
            } else if(node.x + pipeWidth < gameArea.offsetWidth) {
                node.classList.remove("hide");
            }
            if(node.x < 0) {
                node.parentElement.removeChild(node);
                counter++;
            }


            if(pipe.isCollision(node)) {
               pipe.bird.gameOver();
            };
        });

        counter = counter / 2;

        for(let i = 0; i < counter; i++) {
            this.createPipes(-pipeWidth);
        }
    }

    isCollision(pipe) {
        let aRect = this.bird.getBird().getBoundingClientRect();
        let bRect = pipe.getBoundingClientRect();

        return(
            (aRect.bottom > bRect.top) &&
            (aRect.top < bRect.bottom) &&
            (aRect.right > bRect.left) &&
            (aRect.left < bRect.right)
        );

    }

    getSpeed() {
        return this.speed;
    }

    setSpeed(speed) {
        this.speed = speed;
    }
}
