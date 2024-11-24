let player;
let gravity;
let obstacles = [];
let score = 0;
let gravityDirection = 1;
let obstacleSpeed = 5;
let spawnRate = 100;

function setup() {
  createCanvas(800, 400);
  player = new Player();
  gravity = createVector(0, 0.3);
}

function draw() {
  background(135, 206, 235);

  if (frameCount % 500 === 0 && spawnRate > 40) {
    spawnRate -= 10;
    obstacleSpeed += 0.5;
  }

  textSize(24);
  fill(0);
  text('Score: ' + score, 10, 30);

  player.applyGravity();
  player.update();
  player.display();

  if (frameCount % spawnRate === 0) {
    obstacles.push(new Obstacle());
  }

  for (let i = obstacles.length - 1; i >= 0; i--) {
    obstacles[i].update();
    obstacles[i].display();

    if (obstacles[i].hits(player)) {
      noLoop();
      textSize(32);
      fill(255, 0, 0);
      text("Game Over!", width / 2 - 80, height / 2);
    }

    if (obstacles[i].offscreen()) {
      obstacles.splice(i, 1);
      score++;
    }
  }
}

function touchStarted() {
  gravityDirection *= -1;
}

class Player {
  constructor() {
    this.pos = createVector(50, height / 2);
    this.vel = createVector(0, 0);
    this.size = 30;
    this.drag = 0.95;
  }

  applyGravity() {
    this.vel.add(p5.Vector.mult(gravity, gravityDirection));
  }

  update() {
    this.vel.mult(this.drag);
    this.pos.add(this.vel);
    this.vel.limit(10);

    if (this.pos.y > height - this.size / 2) {
      this.pos.y = height - this.size / 2;
      this.vel.y = 0;
    } else if (this.pos.y < this.size / 2) {
      this.pos.y = this.size / 2;
      this.vel.y = 0;
    }
  }

  display() {
    fill(255, 255, 0);
    ellipse(this.pos.x, this.pos.y, this.size);
  }
}

class Obstacle {
  constructor() {
    this.pos = createVector(width, random(50, height - 50));
    this.size = random(30, 60);
    this.speed = obstacleSpeed;
  }

  update() {
    this.pos.x -= this.speed;
  }

  display() {
    fill(255, 0, 0);
    rect(this.pos.x, this.pos.y, this.size, this.size);
  }

  hits(player) {
    return (
      player.pos.x + player.size / 2 > this.pos.x &&
      player.pos.x - player.size / 2 < this.pos.x + this.size &&
      player.pos.y + player.size / 2 > this.pos.y &&
      player.pos.y - player.size / 2 < this.pos.y + this.size
    );
  }

  offscreen() {
    return this.pos.x + this.size < 0;
  }
}