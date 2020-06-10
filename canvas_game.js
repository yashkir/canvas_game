var BOX;
var INTERVAL;
var CANVAS = document.createElement("canvas");
CANVAS.width = 640;
CANVAS.height = 480;
var CONTEXT = CANVAS.getContext("2d");
var KEYS;

document.getElementById("game").insertBefore(CANVAS, document.getElementById("game").childNodes[0]);

function makePiece(width, height, color, x, y) {
  var piece = {};
  piece.width = width;
  piece.height = height;
  piece.color = color;
  piece.x = x;
  piece.y = y;
  piece.speedX = 0;
  piece.speedY = 0;
  piece.context = CONTEXT;

  return piece;
}

function updatePiece(piece) {
  stopMove();
  if (KEYS && KEYS[37]) { moveleft(); }
  if (KEYS && KEYS[39]) { moveright(); }
  if (KEYS && KEYS[38]) { moveup(); }
  if (KEYS && KEYS[40]) { movedown(); }
  piece.y += piece.speedY;
  piece.x += piece.speedX;
  piece.context.fillStyle = piece.color;
  piece.context.fillRect(piece.x,piece.y,piece.width,piece.height);
}

function updateGame() {
  clearCanvas(CANVAS);
  updatePiece(BOX);
}

function moveup() {
  BOX.speedY -= 1;
}

function movedown() {
  BOX.speedY += 1;
}

function moveleft() {
  BOX.speedX -= 1;
}

function moveright() {
  BOX.speedX += 1;
}

function stopMove() {
  BOX.speedX = 0;
  BOX.speedY = 0;
}

function clearCanvas() {
  CONTEXT.clearRect(0, 0, CANVAS.width, CANVAS.height);
}

function startGame() {
  BOX = makePiece(10,10,"blue",50,50);
  INTERVAL = setInterval(updateGame, 20);
  
  window.addEventListener("keydown", function (e) {
    KEYS = (KEYS || []);
    KEYS[e.keyCode] = true;
  })
  window.addEventListener("keyup", function (e) {
    KEYS[e.keyCode] = false;
  })
}


startGame();
