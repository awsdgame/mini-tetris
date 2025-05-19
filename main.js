const canva = document.querySelector('#game');
const ctx = canva.getContext('2d');

const gridWidth = 10;
const gridHeight = 20;
const blockSize = 20;



let score = 0;
const scoreDisplay = document.querySelector('#score');
const SHAPES = [
    [[1, 1, 1, 1]], // I
    [[1, 1], [1, 1]], // O
    [[0, 1, 0], [1, 1, 1]], // T
    [[1, 0, 0], [1, 1, 1]], // L
    [[0, 0, 1], [1, 1, 1]], // J
    [[0, 1], [0, 1], [1, 1]], // S
    [[1, 0], [1, 1], [0, 1]] // Z
];

const board = Array.from({ length: gridHeight }, () => Array(gridWidth).fill(0));

function drawBlock(x, y, color = 'red') {
    ctx.fillStyle = color;
    ctx.fillRect(x * blockSize, y * blockSize, blockSize - 1, blockSize - 1);
}

function drawCurrentBlock() {
    for (let y = 0; y < block.shape.length; y++) {
        for (let x = 0; x < block.shape[y].length; x++) {
            if (block.shape[y][x] === 1) {
                drawBlock(block.x + x, block.y + y);
            }
        }
    }
}

function getRandomShape() {
    const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    return {
        x: Math.floor(gridWidth / 2) - Math.floor(shape[0].length / 2),
        y: 0,
        shape: shape
    };
}

let block = getRandomShape();

function drawBoard() {
    ctx.clearRect(0, 0, canva.width, canva.height);

    for (let i = 0; i < gridHeight; i++) {
        for (let j = 0; j < gridWidth; j++) {
            if (board[i][j] === 1) {
                drawBlock(j, i, 'white');
            }
        }
    }
    drawCurrentBlock();
}

function canMove(newX, newY, newShape = block.shape) {
    for (let y = 0; y < newShape.length; y++) {
        for (let x = 0; x < newShape[y].length; x++) {
            if (newShape[y][x] === 1) {
                const bx = newX + x;
                const by = newY + y;
                if (bx < 0 || bx >= gridWidth || by >= gridHeight || (by >= 0 && board[by][bx])) {
                    return false;
                }
            }
        }
    }
    return true;
}

function placeBlock() {
    for (let y = 0; y < block.shape.length; y++) {
        for (let x = 0; x < block.shape[y].length; x++) {
            if (block.shape[y][x] === 1) {
                board[block.y + y][block.x + x] = 1;
            }
        }
    }
    clearFullRows();
    block = getRandomShape();
}

function clearFullRows() {
    let linesCleared = 0;
    for (let y = gridHeight - 1; y >= 0; y--) {
        if (board[y].every(cell => cell === 1)) {
            board.splice(y, 1);
            board.unshift(Array(gridWidth).fill(0));
            linesCleared++;
            y++;
        }
    }
    if (linesCleared > 0) {
        const pointTable = [0, 40, 100, 300, 1200];
        score += pointTable[linesCleared];
        scoreDisplay.innerText = score;
    }
}

function gameLoop() {
    if (canMove(block.x, block.y + 1)) {
        block.y++;
    } else {
        placeBlock();
    }
    drawBoard();
}

document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft' && canMove(block.x - 1, block.y)) {
        block.x--;
    } else if (e.key === 'ArrowRight' && canMove(block.x + 1, block.y)) {
        block.x++;
    } else if (e.key === 'ArrowDown' && canMove(block.x, block.y + 1)) {
        block.y++;
    }
    drawBoard();
});

setInterval(gameLoop, 500);
