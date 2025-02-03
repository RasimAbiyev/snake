var direction;
var tilesNum = 225;
var tilesPerRow = Math.sqrt(tilesNum);
var rowStartLeft = [];
var rowStartTop = [];
var rowEndBottom = [];
var rowEndRight = [];
var emptyTiles = [];
var body = [3, 2, 1];
var moving;
var fruitGenerator;
var gameDiv = document.getElementsByClassName('game')[0];
var boxDimensions = (100 / tilesPerRow).toFixed(3);
var restartButton = document.getElementById('restart_game');
var scoreSpan = document.getElementsByClassName('score')[0];
var score = 0;
var speed = 0.1;

restartButton.addEventListener("click", function () {
    restartGame();
}, false);

function createGrid() {
    for (var i = 1; i <= tilesNum; i++) {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        tile.setAttribute('data-tile', i);
        tile.style.width = boxDimensions + '%';
        tile.style.height = boxDimensions + '%';
        gameDiv.appendChild(tile);
    }
}

function createBody() {
    for (var i = 1; i <= body.length; i++) {
        const tile = document.querySelector('[data-tile="' + i + '"]');
        if (i == 3) {
            tile.classList.add("head", "body");
        } else {
            tile.classList.add("body");
        }
    }
}

// Array consisting of upmost left boxes
for (var i = 1; i <= tilesNum; i += tilesPerRow) {
    rowStartLeft.push(i);
}

// Array consisting of upmost right boxes
for (var i = tilesPerRow; i <= tilesNum; i += tilesPerRow) {
    rowEndRight.push(i);
}

// Array consisting of upmost top boxes
for (var i = 1; i <= tilesPerRow; i++) {
    rowStartTop.push(i);
}

// Array consisting of upmost bottom boxes
for (var i = (tilesNum - tilesPerRow) + 1; i <= tilesNum; i++) {
    rowEndBottom.push(i);
}

window.addEventListener("keydown", control, false);

function control(e) {
    // RIGHT ARROW
    if (e.keyCode == "39") {
        if (direction != 'r' && direction != 'l') {
            changeDirection('r');
        }
    }

    // LEFT ARROW
    if (e.keyCode == "37") {
        if (direction != 'l' && direction != 'r') {
            changeDirection('l');
        }
    }

    // DOWN ARROW
    if (e.keyCode == "40") {
        if (direction != 'd' && direction != 'u') {
            changeDirection('d');
        }
    }

    // UP ARROW
    if (e.keyCode == "38") {
        if (direction != 'u' && direction != 'd') {
            changeDirection('u');
        }
    }
}

function changeDirection(d) {
    var directionDeciderNum, directionArrayInit, directionArrayOf;
    switch (d) {
        case "r":
            directionDeciderNum = 1;
            directionArrayInit = rowEndRight;
            directionArrayOf = rowStartLeft;
            break;
        case "l":
            directionDeciderNum = -1;
            directionArrayInit = rowStartLeft;
            directionArrayOf = rowEndRight;
            break;
        case "d":
            directionDeciderNum = tilesPerRow;
            directionArrayInit = rowEndBottom;
            directionArrayOf = rowStartTop;
            break;
        case "u":
            directionDeciderNum = -tilesPerRow;
            directionArrayInit = rowStartTop;
            directionArrayOf = rowEndBottom;
            break;
    }

    clearInterval(moving);

    moving = setInterval(function () {
        direction = d;
        var head = document.getElementsByClassName('head')[0];
        var nextTileNum = directionArrayInit.indexOf(parseInt(head.dataset.tile, 10)) > -1 ? directionArrayOf[directionArrayInit.indexOf(parseInt(head.dataset.tile, 10))] : parseInt(head.dataset.tile, 10) + directionDeciderNum;
        if (body.indexOf(nextTileNum) > -1) {
            scoreSpan.innerHTML = score + ". GAME OVER";
            restartGame();
        } else {
            var nextTile = document.querySelector('[data-tile ="' + nextTileNum + '"]');

            var lastTile = document.querySelector('[data-tile ="' + body[body.length - 1] + '"]');
            body.unshift(nextTileNum);

            nextTile.classList.add("head", "body");

            // IF EATEN FRUIT
            if (nextTile.classList.contains('fruit')) {
                score += 1;
                scoreSpan.innerHTML = score;
                speed = score % 2 == 0 ? speed += 0.01 : speed;
                nextTile.classList.remove('fruit');
                clearInterval(fruitGenerator);
                generateFruit();
                fruitGen();
            }

            // IF JUST MOVING
            else {
                lastTile.classList.remove("body");
                body.pop();
            };
            head.classList.remove("head");
        }
    }, 10 / speed);
}

function generateFruit() {
    var rand;
    var fruit = document.getElementsByClassName('fruit')[0];
    if (fruit) {
        fruit.classList.remove('fruit');
    }
    do {
        rand = Math.floor(Math.random() * tilesNum);
    } while (body.indexOf(rand) > -1);
    document.querySelector('[data-tile ="' + rand + '"]').classList.add('fruit');
}

function fruitGen() {
    fruitGenerator = setInterval(function () {
        generateFruit();
    }, 3000);
};

function startGame() {
    createGrid();
    createBody();
    generateFruit();
}

function restartGame() {
    scoreSpan.innerHTML = score + ". GAME OVER";
    clearInterval(fruitGenerator);
    clearInterval(moving);
    body = [3, 2, 1];
    speed = 0.1;
    score = 0;
    document.querySelector('.game').innerHTML = "";
    direction = '';
    startGame();
}

startGame();

window.addEventListener("keydown", control, false);
window.addEventListener("touchstart", touchControl, false);

let touchStartX = 0;
let touchStartY = 0;

function touchControl(e) {
    // Prevent default scrolling behavior when swiping
    e.preventDefault();
    
    let touchEndX = e.changedTouches[0].clientX;
    let touchEndY = e.changedTouches[0].clientY;

    let diffX = touchEndX - touchStartX;
    let diffY = touchEndY - touchStartY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        // Swipe left or right
        if (diffX > 0) {
            // Swipe right
            if (direction != 'r' && direction != 'l') changeDirection('r');
        } else {
            // Swipe left
            if (direction != 'l' && direction != 'r') changeDirection('l');
        }
    } else {
        // Swipe up or down
        if (diffY > 0) {
            // Swipe down
            if (direction != 'd' && direction != 'u') changeDirection('d');
        } else {
            // Swipe up
            if (direction != 'u' && direction != 'd') changeDirection('u');
        }
    }

    // Update touch start coordinates for the next gesture
    touchStartX = touchEndX;
    touchStartY = touchEndY;
}

// For touch start position
window.addEventListener("touchstart", function (e) {
    touchStartX = e.changedTouches[0].clientX;
    touchStartY = e.changedTouches[0].clientY;
});