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
      //TODO make the angular option changeable
      playerAngular: true,
      backgroundColor : "black",
      startX : 90,
      startY : 180,
      playerHeight: 20,
      playerWidth: 20,
      playerColor: "red",
      fps : 50,
      spawnInterval : 1500,
      image: "img/spaceship.png"
    }
    this.canvas = document.createElement("canvas");
    this.canvas.width = 200;
    this.canvas.height = 300;
    // TODO inserts before first node, make more flexible?
    var element = document.getElementById(elementId);
    element.insertBefore(this.canvas, element.childNodes[0]);

    this.context = this.canvas.getContext("2d");
    this.playArea = new Rect(0,0,200,180);

    this.fps = this.settings.fps;
    this.frameN = 0;
    this.msPerFrame = Math.floor(1000 / this.fps);
    this.__isRunning = false;
  }

  splashScreen() {
    this.clear();
  }

  start() {
    this.__isRunning = true;

    this.player = new ImageComponent(this.context, this.settings.startX, this.settings.startY,
                                     this.settings.playerWidth, this.settings.playerHeight,
                                     this.settings.image, true);
    this.playBox = new Rect(0, 0, this.canvas.width, this.canvas.height - 100);
    this.GUI = new Component(this.context, 0, this.playBox.y2, this.canvas.width, this.playBox.y2, "#222222");
    if (this.settings.playerAngular) {
      this.player.isAngular = true;
    }
    this.player.angle = -(Math.PI / 2)
    this.player.setBoundingBox(this.playBox);

    this.buttons = new ControlGroup(this.context, this.canvas.width - 20 * 4,
                                                  this.canvas.height - 20 * 4,
                                                  20, 20);
    this.input_object = new Input(this.canvas, this.player, this.buttons);
    this.score = new TextBox(this.context, 20, this.canvas.height - 20, "14px monospace", "score");
    this.GUI.spawnInterval = new TextBox(this.context, 20, this.canvas.height - 40, "10px monospace", "spawn");
    this.gameOver = new TextBox(this.context, 35, this.canvas.height /2, "20px monospace", "GAME OVER");
    this.sndGameOver = new Sound("sound/game_over.ogg");

    this.obstacles = new ObstacleGroup(this.context, this.playBox);

    this.interval = window.setInterval( () => this.update(), this.msPerFrame );
  }

  stop() {
    clearInterval(this.interval);
    this.__isRunning = false;

    this.gameOver.update();
  }

  clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.fillStyle = this.settings.backgroundColor;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  onInterval(delay, f) {
    var frameDelay = Math.floor(delay / this.msPerFrame);
    if (this.frameN % frameDelay == 0) {
      f();
    }
  }

  update() {
    this.input_object.update();

    this.clear();
    this.GUI.update();
    this.obstacles.update();
    this.player.update();
    this.buttons.update();
    this.score.text = "score: " + this.frameN;
    this.score.update();

    this.onInterval(this.settings.spawnInterval, () => this.obstacles.spawn());
    this.settings.spawnInterval -= this.settings.spawnInterval/1000;
    this.GUI.spawnInterval.text = "spawn: " + Math.floor(this.settings.spawnInterval);
    this.GUI.spawnInterval.update();

    if(this.obstacles.someoneCollidedWith(this.player)) {
      this.stop();
      this.sndGameOver.play();
      return;
    }

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
    this.isMobile = isMobile;
    this.moveRate = 2;
    this.speedX = 0;
    this.speedY = 0;

    this.isAngluar = false;
    this.rotationRate = 0.1;
    this.speedR = 0;
    this.speedF = 0;
    this.angle = 0;

    this.gravity = 0;
    this.speedGravity = 0;
    this.bounce = 0;

    this.boundingBox = false;
  }

  setBoundingBox(value) {
    this.boundingBox = value;
  }

  setSpeedX(x) {
    this.speedX = x;
  }

  setSpeedY(y) {
    this.speedY = y;
  }

  sendKeys(vKeys) {
    this.speedX = 0;
    this.speedY = 0;
    this.speedF = 0;
    this.speedR = 0;
    if (!this.isAngular) {
      if (vKeys.up)    { this.speedY = -this.moveRate };
      if (vKeys.down)  { this.speedY = this.moveRate };
      if (vKeys.left)  { this.speedX = -this.moveRate };
      if (vKeys.right) { this.speedX = this.moveRate };
    } else {
      if (vKeys.up)    { this.speedF = this.moveRate };
      if (vKeys.down)  { this.speedF = -this.moveRate };
      if (vKeys.left)  { this.speedR = -this.rotationRate };
      if (vKeys.right) { this.speedR = this.rotationRate };
    }
  }

  update() {
    if (this.isMobile) {
      var bounded = false;
      var t;

      this.speedGravity += this.gravity;

      // calculate the target rectangle
      if (!this.isAngular) {
        t = new Rect( this.x1 + this.speedX,
                      this.y1 + this.speedY + this.speedGravity,
                      this.x2 + this.speedX,
                      this.y2 + this.speedY + this.speedGravity );
      } else {
        this.angle += this.speedR;
        var transX = this.speedF * Math.cos(this.angle);
        var transY = this.speedF * Math.sin(this.angle);

        t = new Rect( this.x1 + transX,
                      this.y1 + transY + this.speedGravity,
                      this.x2 + transX,
                      this.y2 + transY + this.speedGravity );
      }


      // Check the bounding box or return
      // TODO stick it to the box
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
      } else if ( this.bounce && (t.y2 >= this.boundingBox.y2) ) {
        this.speedGravity *= -this.bounce;
      }
    }

    this.draw();
  }

  draw() {
    if (this.isAngular != 0) {
      this.context.save();
      this.context.translate( (this.x1 + this.x2) / 2, (this.y1 + this.y2) / 2 );
      this.context.rotate(this.angle);
      this.context.fillStyle = this.color;
      this.context.fillRect(this.width / -2, this.height / -2, this.width, this.height);
      this.context.restore();
    } else {
      this.context.fillStyle = this.color;
      this.context.fillRect(this.x1, this.y1, this.width, this.height);
    }
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

class ImageComponent extends Component {
  constructor(context, x, y, width, height, image, isMobile) {
    super(context, x, y, width, height, "blue", isMobile);
    this._image = new Image();
    this._image.src = image;
  }

  draw() {
    if (this.isAngular != 0) {
      this.context.save();

      this.context.translate( (this.x1 + this.x2) / 2, (this.y1 + this.y2) / 2 );
      this.context.rotate(this.angle + Math.PI / 2);

      this.context.fillStyle = this.color;
      this.context.drawImage(this._image, this.width / -2, this.height / -2, this.width, this.height);

      this.context.restore();
    } else {
      this.context.fillStyle = this.color;
      this.context.drawImage(this._image, this.x1, this.y1, this.width, this.height);
    }
  }
}

class Sound {
  constructor(src) {
    this._sound = document.createElement("audio");
    this._sound.src = src;
    this._sound.setAttribute("preload", "auto");
    this._sound.setAttribute("controls", "none");
    this._sound.style.display = "none";
    document.body.appendChild(this._sound);
  }

  play() {
    this._sound.play();
  }

  stop() {
    this._sound.pause();
  }
}

class TextBox {
  constructor(context, x, y, font, text, color) {
    this._context = context;
    this._x = x;
    this._y = y;
    this._font = font;
    this._text = text;
    this._color = color || "white";
  }

  set text(value) {
    this._text = value;
  }

  update() {
    this.draw();
  }

  draw() {
    this._context.font = this._font;
    this._context.fillStyle = this._color;
    this._context.fillText(this._text, this._x, this._y);
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
  constructor(context, r) {
    this.context = context;
    this.obstacles = new Array(0);
    this.x1 = r.x1;
    this.x2 = r.x2;
    this.y1 = r.y1;
    this.y2 = r.y2;
    this.rect = r;

    this.width = 20;
    this.height = 20;
  }

  spawn() {
    var x = Math.floor(Math.random() * (this.x2 - this.x1)) + this.x1;
    var obstacle = new Obstacle(
      this.context, x, this.y1, this.width, this.height, "yellow", true);
    //obstacle.setSpeedY(1);
    obstacle.gravity = 0.05;
    obstacle.bounce = 0.3;
    obstacle.angle = Math.random() * Math.PI * 2;
    obstacle.setBoundingBox(this.rect);
    this.obstacles.push(obstacle);
  }

  update() {
    var i;
    // Remove out of bounds obstacles
    for (i = 0; i < this.obstacles.length; i++) {
      if (this.obstacles[i].y2 > (this.y2 + 5)) {
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
    this.speed = 2;
    this.canvas = canvas;
    this.player = player;
    this.buttons = buttons;

    this.vKeys = new VirtualKeys();

    this.input = {
      keys : [],
      x : false,
      y : false
    }

    // TODO scan for mouse leave
    // TODO keyboard focus
    var handler = this.handleEvent.bind(this);
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
          this.vKeys.left = true;
        } else if (this.buttons.right.clicked(this.input.x, this.input.y)) {
          this.vKeys.right = true;
        } else if (this.buttons.up.clicked(this.input.x, this.input.y)) {
          this.vKeys.up = true;
        } else if (this.buttons.down.clicked(this.input.x, this.input.y)) {
          this.vKeys.down = true;
        }
      } else {
        this.vKeys.reset();
      }
    } else {
      this.vKeys.reset()
    }

    if (this.input.keys[37]) { this.vKeys.left = true; }; //left
    if (this.input.keys[38]) { this.vKeys.up = true; }; //up
    if (this.input.keys[39]) { this.vKeys.right = true; }; //right
    if (this.input.keys[40]) { this.vKeys.down = true; }; //down

    this.player.sendKeys(this.vKeys);
  }
}

class VirtualKeys {
  constructor() {
    this.up = false
    this.down = false
    this.left = false
    this.right = false
  }

  reset() {
    for (var key in this) {
      this[key] = false;
    }
  }
}

var GAME = new Game("game");
GAME.splashScreen();
