"use strict";

class Game {
  constructor(elementId, width, height) {
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

    // TODO inserts before first node, make more flexible?
    var element = document.getElementById(elementId);
    element.insertBefore(this.canvas, element.childNodes[0]);

  }

  start() {
    this.player = new Component(this.context, this.settings.startX, this.settings.startY,
                                this.settings.playerWidth, this.settings.playerHeight,
                                this.settings.playerColor, true);
    this.buttons = new ControlGroup(this.context, this.canvas.width / 2 - 20 * 3 / 2,
                                                  this.canvas.height - 20 * 4,
                                                  20, 20);
    this.input_object = new Input(this.canvas, this.player, this.buttons);

    this.obstacles = new ObstacleGroup(this.context, 0, 0, 100, 100);
    this.obstacles.spawn();

    this.update = this.update.bind(this);
    this.interval = window.setInterval(this.update, 1000 / this.settings.fps);
  }

  stop() {
    clearInterval(this.interval);
  }

  clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.fillStyle = this.settings.backgroundColor;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  update() {
    this.input_object.update();

    this.clear();
    this.obstacles.update();
    this.player.update();
    this.buttons.update();
  }

  onInputEvent() {
    return;
  }
}

class Component {
  constructor(context, x, y, width, height, color, isMobile) {
    this.context = context;
    this.x = x;
    this.y = y;
    this.width  = width;
    this.height = height;
    this.color  = color;
    this.isMobile = false;
    this.speedX = 0;
    this.speedY = 0;
  }

  setSpeedX(x) {
    if (!this.isMobile) { this.isMobile = true }
    this.speedX = x;
  }

  setSpeedY(y) {
    if (!this.isMobile) { this.isMobile = true }
    this.speedY = y;
  }

  update() {
    if (this.isMobile) {
      this.x += this.speedX;
      this.y += this.speedY;
    }
    this.draw();
  }

  draw() {
    this.context.fillStyle = this.color;
    this.context.fillRect(this.x, this.y, this.width, this.height);
  }

  clicked(x, y) {
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

class ControlGroup {
  constructor(context, x, y, w, h, input) {
    this.context = context
    this.input = input;

    this.color = "blue";

    this.up    = new Component(this.context, x + w,     y,         w, h, this.color);
    this.down  = new Component(this.context, x + w,     y + h * 2, w, h, this.color);
    this.left  = new Component(this.context, x,         y + h,     w, h, this.color);
    this.right = new Component(this.context, x + w * 2, y + h,     w, h, this.color);
    this.buttonGroup = [this.up, this.down, this.left, this.right];
  }

  update() {
    var button;
    for(button of this.buttonGroup) { button.update() };
  }
}

class Obstacle extends Component {
  // empty class
}

class ObstacleGroup {
  constructor(context, x1, y1, x2, y2) {
    this.context = context;
    this.obstacles = [];
    this.x1 = x1;
    this.x2 = x2;
    this.y1 = y1;
    this.y2 = y2;

    this.width = 20; //TODO
    this.height = 20;
  }

  spawn() {
    var obstacle = new Obstacle(
      this.context, this.x1, this.y1, this.width, this.height, "yellow", true);
    obstacle.setSpeedY(1);
    this.obstacles.push(obstacle);
  }

  update() {
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
class Input {
  constructor(canvas, player, buttons) {
    var self = this;
    this.canvas = canvas;

    this.input = new Object()
    this.input.keys = [];
    this.input.x = false;
    this.input.y = false;

    this.player = player;
    this.buttons = buttons;

    // Event listeners, we must use 'self' here. First disable defaults.
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

    // Mouse and touch TODO scan for mouse leave
    var handler = self.handleEvent.bind(this);
    if (this.buttons) {
      this.canvas.addEventListener('mousedown', handler);
      this.canvas.addEventListener('mouseup', handler);
    }
    // TODO touch events broken
    this.canvas.addEventListener('touchstart', handler);
    this.canvas.addEventListener('touchend', handler);
  }

  handleEvent(e) {
    e.preventDefault();
    switch(e.type) {
      case 'mousedown':
        this.input.x = e.offsetX;
        this.input.y = e.offsetY;
        break;
      case 'mouseup':
        this.input.x = false;
        this.input.y = false;
        break;
      case 'touchstart':
        var bcr = e.target.getBoundingClientRect();
        this.input.x = e.targetTouches[0].clientX - bcr.x;
        this.input.y = e.targetTouches[0].clientY - bcr.y;
        break;
      case 'touchend':
        this.input.x = false;
        this.input.y = false;
        break;
    }
  }

  update() {
    if (this.buttons) {
      if (this.input.x) {
        if (this.buttons.left.clicked(this.input.x, this.input.y)) {
          this.player.setSpeedX(-1);
        } else if (this.buttons.right.clicked(this.input.x, this.input.y)) {
          this.player.setSpeedX(1);
        } else if (this.buttons.up.clicked(this.input.x, this.input.y)) {
          this.player.setSpeedY(-1);
        } else if (this.buttons.down.clicked(this.input.x, this.input.y)) {
          this.player.setSpeedY(1);
        }
      } else {
        this.player.setSpeedX(0);
        this.player.setSpeedY(0);
      }
    } else {
      this.player.setSpeedX(0);
      this.player.setSpeedY(0);
    }

    if (this.input.keys[37]) { this.player.setSpeedX(-1); }; //left
    if (this.input.keys[38]) { this.player.setSpeedY(-1); }; //up
    if (this.input.keys[39]) { this.player.setSpeedX(1); }; //right
    if (this.input.keys[40]) { this.player.setSpeedY(1); }; //down
  }
}

var GAME = new Game("game", 200, 300);
GAME.start();
