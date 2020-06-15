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
  this.buttons = {};
  this.input.x = false;
  this.input.y = false;

  var element = document.getElementById(elementId);
  // TODO inserts before first node, make more flexible?
  element.insertBefore(this.canvas, element.childNodes[0]);

  this.start = function () {

    // Disable the arrow keys from scrolling
    window.addEventListener('keydown', function (e) {
      if([37, 38, 39, 40].indexOf(e.keyCode) > -1 ) {
        e.preventDefault();
      }
    });

    // KEYBOARD
    window.addEventListener('keydown', function (e) {
      self.input.keys[e.keyCode] = true;
    })
    window.addEventListener('keyup', function (e) {
      self.input.keys[e.keyCode] = false;
    })

    //MOUSE AND TOUCH
    this.canvas.addEventListener('mousedown', function (e) {
      self.input.x = e.offsetX;
      self.input.y = e.offsetY;
    })
    this.canvas.addEventListener('mouseup', function (e) {
      self.input.x = false;
      self.input.y = false;
    })
    /* TODO touch events broken
    window.addEventListener('touchstart', function (e) {
      e.preventDefault();
      self.player.setSpeedX(-1);
      self.input.x = e.offsetX;
      self.input.y = e.offsetY;
    })
    this.canvas.addEventListener('touchend', function (e) {
      self.input.x = false;
      self.input.y = false;
    })
    */

    // PLAYER AND GAME LOOP
    this.player = new Component(this.context, this.settings.startX, this.settings.startY,
                                this.settings.playerWidth, this.settings.playerHeight,
                                this.settings.playerColor, true);
    this.obstacles = new ObstacleGroup(this.context, 0, 0, 100, 100);
    this.buttons = new ControlGroup(self.context, this.canvas.width / 2 - 20 * 3 / 2,
                                                  this.canvas.height - 20 * 4,
                                                  20, 20);

    this.obstacles.spawn();
    this.interval = window.setInterval(this.update, 1000 / this.settings.fps);
  }

  this.stop = function () {
    clearInterval(this.interval);
  }

  this.clear = function () {
    this.context.clearRect(0, 0, self.canvas.width, self.canvas.height);
    this.context.fillStyle = self.settings.backgroundColor;
    this.context.fillRect(0, 0, self.canvas.width, self.canvas.height);
  }

  this.update = function () {
    // To be called by window.setInterval, so we must use self to not lose binding

    // INPUT CHECK
    //self.player.setSpeedX(0);
    //self.player.setSpeedY(0);

    if (self.input.x) {
      if (self.buttons.left.clicked(self.input.x, self.input.y)) {
        self.player.setSpeedX(-1);
      } else if (self.buttons.right.clicked(self.input.x, self.input.y)) {
        self.player.setSpeedX(1);
      } else if (self.buttons.up.clicked(self.input.x, self.input.y)) {
        self.player.setSpeedY(-1);
      } else if (self.buttons.down.clicked(self.input.x, self.input.y)) {
        self.player.setSpeedY(1);
      }
    } else {
      self.player.setSpeedX(0);
      self.player.setSpeedY(0);
    }

    if (self.input.keys[37]) { self.player.setSpeedX(-1); }; //left
    if (self.input.keys[38]) { self.player.setSpeedY(-1); }; //up
    if (self.input.keys[39]) { self.player.setSpeedX(1); }; //right
    if (self.input.keys[40]) { self.player.setSpeedY(1); }; //down

    // UPDATE AND REDRAW

    self.clear();
    self.obstacles.update();
    self.player.update();
    self.buttons.update();
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

  this.clicked = function (x, y) {
    var l = this.x;
    var r = this.x + this.width;
    var t = this.y;
    var b = this.y + this.height;
    if ((r < x) || (l > x) || (b < y) || (t > y)) {
      return false;
    } else {
      return true;
    }
  }
}

function TextBox(context, x, y, width, height, color, isMobile) {
  Component.call(this, context, x, y, width, height, color, isMobile);
  //TODO
}

function ControlGroup(context, x, y, w, h, input) {
  this.context = context
  this.input = input;

  this.color = "blue";

  this.up    = new Component(this.context, x + w,     y,         w, h, this.color);
  this.down  = new Component(this.context, x + w,     y + h * 2, w, h, this.color);
  this.left  = new Component(this.context, x,         y + h,     w, h, this.color);
  this.right = new Component(this.context, x + w * 2, y + h,     w, h, this.color);
  this.buttonGroup = [this.up, this.down, this.left, this.right];

  this.update = function () {
    for(button of this.buttonGroup) { button.update() };
  }
}
function Obstacle(context, x, y, width, height, color, isMobile) {
  Component.call(this, context, x, y, width, height, color, isMobile);
}

function ObstacleGroup(context, x1, y1, x2, y2) {
  this.context = context;
  this.obstacles = [];
  this.x1 = x1;
  this.x2 = x2;
  this.y1 = y1;
  this.y2 = y2;

  this.width = 20; //TODO
  this.height = 20;
  
  this.spawn = function () {
    var obstacle = new Obstacle(
      context, this.x1, this.y1, this.width, this.height, "yellow", true);
    obstacle.setSpeedY(1);
    this.obstacles.push(obstacle);
  }

  this.update = function () {
    var i;
    for (i = 0; i < this.obstacles.length; i++) {
      if (this.obstacles[i].y > this.y2) {
        this.obstacles.splice(i, 1);
      } else {
        this.obstacles[i].update();
      }
    }
  }
}

var GAME = new Game("game", 200, 300);
GAME.start();
