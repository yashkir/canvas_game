var BOX;
var OBSTACLES = [];
var OBSTACLE;
var INTERVAL;
var CANVAS = document.createElement("canvas");
CANVAS.width = 640;
CANVAS.height = 480;
var FRAMENUM = 0;
var CONTEXT = CANVAS.getContext("2d");
var KEYS;

document.getElementById("game").insertBefore(CANVAS, document.getElementById("game").childNodes[0]);

function makePiece(width, height, color, x, y, speedX, speedY) {
  var piece = {};
  piece.width = width;
  piece.height = height;
  piece.color = color;
  piece.x = x;
  piece.x2 = x + width;
  piece.y = y;
  piece.y2 = y + height;
  piece.speedX = speedX || 0;
  piece.speedY = speedY || 0;
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
  piece.y2 += piece.speedY;
  piece.x += piece.speedX;
  piece.x2 += piece.speedX;
  piece.context.fillStyle = piece.color;
  piece.context.fillRect(piece.x,piece.y,piece.width,piece.height);
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

function collide(a, b) {
  var hit = true;
  if ((a.x > b.x2) ||
      (a.y > b.y2) ||
      (a.x2 < b.x) ||
      (a.y2 < b.y)) {
    hit = false;
  } else { console.log("hit") }
  return hit;
}

function everyinterval(n) {
  if ((FRAMENUM / n) % 1 == 0) { return true; }
}

function clearCanvas() {
  CONTEXT.clearRect(0, 0, CANVAS.width, CANVAS.height);
}

function startGame() {
  BOX = makePiece(10,10,"blue",50,50);
  OBSTACLES.push(makePiece(10,200,"red",100,100,-1,0));
  INTERVAL = setInterval(updateGame, 20);

  window.addEventListener("keydown", function (e) {
    KEYS = (KEYS || []);
    KEYS[e.keyCode] = true;
  })
  window.addEventListener("keyup", function (e) {
    KEYS = (KEYS || []);
    KEYS[e.keyCode] = false;
  })
}

function updateGame() {
  clearCanvas(CANVAS);
  CONTEXT.fillStyle = "black";
  CONTEXT.fillRect(0, 0, CANVAS.width, CANVAS.height);
  updatePiece(BOX);
  for (i = 0; i < OBSTACLES.length; i++) {
    updatePiece(OBSTACLES[i]);
    if (collide(BOX, OBSTACLES[i])) {
      stopGame();
    }
  }
  FRAMENUM++;
  if (everyinterval(150)) {
    OBSTACLES.push(makePiece(10,200,"red", 200,20,-1,0));
  }
}


function stopGame() {
  clearInterval(INTERVAL);
}

startGame();
