"use strict";

class Rect {
  constructor(x1, y1, x2, y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.y2 = y2;
    this.x2 = x2;
  }
}

class Game {
  constructor(elementId, width, height) {
    var self = this;

    this.settings = {
      backgroundColor : "black",
      startX : 90,
      startY : 180,
      playerHeight: 20,
      playerWidth: 20,
      playerColor: "red",
      fps : 50,
      spawnInterval : 200
    }
    this.fps = this.settings.fps;

    this.playArea = new Rect(0,0,200,180);

    this.canvas = document.createElement("canvas");
    this.canvas.width = 200;
    this.canvas.height = 300;
    this.context = this.canvas.getContext("2d");

    this.frameN = 0;
    this.msPerFrame = Math.floor(1000 / this.fps);

    // TODO inserts before first node, make more flexible?
    var element = document.getElementById(elementId);
    element.insertBefore(this.canvas, element.childNodes[0]);

  }

  start() {
    var boundingBox = new Rect(0, 0, this.canvas.width, this.canvas.height - 100);
    this.player = new Component(this.context, this.settings.startX, this.settings.startY,
                                this.settings.playerWidth, this.settings.playerHeight,
                                this.settings.playerColor, true);
    this.player.setBoundingBox(boundingBox);
    this.buttons = new ControlGroup(this.context, this.canvas.width / 2 - 20 * 3 / 2,
                                                  this.canvas.height - 20 * 4,
                                                  20, 20);
    this.input_object = new Input(this.canvas, this.player, this.buttons);

    this.obstacles = new ObstacleGroup(this.context, 0, 0, this.canvas.width, this.canvas.height - 100);

    this.interval = window.setInterval(() => this.update(), this.msPerFrame);
  }

  stop() {
    clearInterval(this.interval);
  }

  clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.fillStyle = this.settings.backgroundColor;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  onInterval(delay, f) {
    var frameDelay = delay / this.msPerFrame;
    if (this.frameN % frameDelay == 0) {

      f();
    }
  }

  update() {
    this.input_object.update();

    this.clear();
    this.obstacles.update();
    this.player.update();
    this.buttons.update();
    //TODO check collisions
    if(this.obstacles.someoneCollidedWith(this.player)) {
      this.stop();
    }

    this.onInterval(this.settings.spawnInterval, () => this.obstacles.spawn());

    this.frameN++;
  }

  onInputEvent() {
    return;
  }
}

class Component {
  constructor(context, x, y, width, height, color, isMobile) {
    this.context = context;
    this.x1 = x;
    this.y1 = y;
    this.x2 = x + width;
    this.y2 = y + height;
    this.width  = width;
    this.height = height;
    this.color  = color;
    this.isMobile = false;
    this.speedX = 0;
    this.speedY = 0;
    this.boundingBox = false;
  }

  setBoundingBox(value) {
    this.boundingBox = value;
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
      var bounded = false;
      var t = new Rect( this.x1 + this.speedX,
                        this.y1 + this.speedY,
                        this.x2 + this.speedX,
                        this.y2 + this.speedY );

      // Check the bounding box or return
      if (this.boundingBox instanceof Rect) {
        var bb = this.boundingBox;
        if (t.x1 < this.boundingBox.x1 || t.x2 > this.boundingBox.x2 ||
            t.y1 < this.boundingBox.y1 || t.y2 > this.boundingBox.y2) {
          bounded = true;
        }
      }

      if (!bounded) {
        this.x1 = t.x1;
        this.y1 = t.y1;
        this.x2 = t.x2;
        this.y2 = t.y2;
      }
    }
    this.draw();
  }

  draw() {
    this.context.fillStyle = this.color;
    this.context.fillRect(this.x1, this.y1, this.width, this.height);
  }

  clicked(x, y) {
    var r = new Rect(x, y, x, y);
    return this.collidedWith(r);
  }

  collidedWith(a) {
    var l = this.x1;
    var r = this.x2;
    var t = this.y1;
    var b = this.y2;
    if ((r < a.x1) || (l > a.x2) || (b < a.y1) || (t > a.y2)) {
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
    this.obstacles = new Array(0);
    this.x1 = x1;
    this.x2 = x2;
    this.y1 = y1;
    this.y2 = y2;

    this.width = 20; //TODO
    this.height = 20;
  }

  spawn() {
    var x = Math.floor(Math.random() * (this.x2 - this.x1)) + this.x1;
    var obstacle = new Obstacle(
      this.context, x, this.y1, this.width, this.height, "yellow", true);
    obstacle.setSpeedY(1);
    this.obstacles.push(obstacle);
  }

  update() {
    var i;
    for (i = 0; i < this.obstacles.length; i++) {
      if (this.obstacles[i].y2 > this.y2) {
        this.obstacles.splice(i, 1);
      } else {
        this.obstacles[i].update();
      }
    }
  }

  someoneCollidedWith(obj) {
    var i;

    for (i = 0; i < this.obstacles.length; i++) {
      if (this.obstacles[i].collidedWith(obj)) {
        return true;
      }
    }
    return false;
  }
}

class Input {
  constructor(canvas, player, buttons) {
    var self = this;
    this.canvas = canvas;
    this.player = player;
    this.buttons = buttons;

    this.input = {
      keys : [],
      x : false,
      y : false
    }

    // TODO scan for mouse leave
    // TODO keyboard focus
    var handler = self.handleEvent.bind(this);
    if (this.buttons) {
      this.canvas.addEventListener('mousedown', handler);
      this.canvas.addEventListener('mouseup', handler);
      this.canvas.addEventListener('touchstart', handler);
      this.canvas.addEventListener('touchend', handler);
    }
    window.addEventListener('keydown', handler);
    window.addEventListener('keyup', handler);
  }

  handleEvent(e) {
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
      case 'keydown':
        if([37, 38, 39, 40].indexOf(e.keyCode) > -1 ) { e.preventDefault(); };
        this.input.keys[e.keyCode] = true;
        break;
      case 'keyup':
        this.input.keys[e.keyCode] = false;
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

var GAME = new Game("game");
GAME.start();
