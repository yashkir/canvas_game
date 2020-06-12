function Game(elementId, width, height) {
  var self = this;

  this.settings = {
    backgroundColor : "black",
    startX : 50,
    startY : 50,
    playerHeight: 20,
    playerWidth: 20,
    playerColor: "red",
    fps : 50
  }

  this.canvas = document.createElement("canvas");
  this.canvas.width = width;
  this.canvas.height = height;
  this.context = this.canvas.getContext("2d");

  this.frameN = 0;
  this.input = new Object()
  this.input.keys = [];

  var element = document.getElementById(elementId);
  // TODO inserts before first node, make more flexible?
  element.insertBefore(this.canvas, element.childNodes[0]);

  this.start = function () {
    this.player = new Component(this.context, this.settings.startX, this.settings.startY,
                                this.settings.playerWidth, this.settings.playerHeight,
                                this.settings.playerColor, true);

    // Disable the arrow keys from scrolling
    window.addEventListener('keydown', function (e) {
      if([37, 38, 39, 40].indexOf(e.keyCode) > -1 ) {
        e.preventDefault();
      }
    });
    window.addEventListener('keydown', function (e) {
      self.input.keys[e.keyCode] = true;
    })
    window.addEventListener('keyup', function (e) {
      self.input.keys[e.keyCode] = false;
    })
    this.interval = window.setInterval(this.update, 1000 / this.settings.fps);
  }

  this.stop = function () {
    clearInterval(this.interval);
  }

  this.update = function () {
    // To be called by window.setInterval, so we must use self to not lose binding
    self.context.clearRect(0, 0, self.canvas.width, self.canvas.height);
    self.context.fillStyle = self.settings.backgroundColor;
    self.context.fillRect(0, 0, self.canvas.width, self.canvas.height);
    
    self.player.setSpeedX(0);
    self.player.setSpeedY(0);

    if (self.input.keys[37]) { self.player.setSpeedX(-1); }; //left
    if (self.input.keys[38]) { self.player.setSpeedY(-1); }; //up
    if (self.input.keys[39]) { self.player.setSpeedX(1); }; //right
    if (self.input.keys[40]) { self.player.setSpeedY(1); }; //down
    self.player.update();
  }

  this.onInputEvent = function (e) {
    return;
  }
}

function Component(context, x, y, width, height, color, isMobile) {
  this.context = context;
  this.x = x;
  this.y = y;
  this.width  = width;
  this.height = height;
  this.color  = color;
  this.isMobile = false;
  this.speedX = 0;
  this.speedY = 0;

  this.setSpeedX = function (x) {
    if (!this.isMobile) { this.isMobile = true }
    this.speedX = x;
  }

  this.setSpeedY = function (y) {
    if (!this.isMobile) { this.isMobile = true }
    this.speedY = y;
  }

  this.update = function () {
    if (this.isMobile) {
      this.x += this.speedX;
      this.y += this.speedY;
    }
    this.draw();
  }

  this.draw = function () {
    this.context.fillStyle = this.color;
    this.context.fillRect(this.x, this.y, this.width, this.height);
  }
}

var GAME = new Game("game", 200, 300);
GAME.start();
