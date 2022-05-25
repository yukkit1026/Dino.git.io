let imgStack = [];
let img;
let bg;

let dieSound;
let jumpSound;
let speedSound;

let rand = true;

let dino = 1;
let bird = 5;
let cactus = 3;

let animate = 0;

let onGround = true;

var speed;
let gravitySpeed = 0;
let gravityStrength = 0.1;
let jumpStrength = 0.1;
let jumpSpeed = 5;

//========================================
let score = 0;
let highscore = 0;

function preload() {
  imgStack.push(img = loadImage('img/dino1.png'));
  imgStack.push(img = loadImage('img/dino2.png'));
  imgStack.push(img = loadImage('img/dino3.png'));
  imgStack.push(img = loadImage('img/cactus1.png'));
  imgStack.push(img = loadImage('img/cactus2.png'));
  imgStack.push(img = loadImage('img/bird1.png'));
  imgStack.push(img = loadImage('img/bird2.png'));

  soundFormats('mp3');
  dieSound = loadSound('sound/dead');
  jumpSound = loadSound('sound/jump');
  speedSound = loadSound('sound/speed');
}

function setup() {
  bg = loadImage('img/bg3.png')
  console.log('InnerHeight: ' + innerHeight + ', InnerWidth: ' + innerWidth);
  createCanvas(600, 400); //top - bottom, left - right
  base = height - 40;
  dinox = 10;
  dinoy = base - 40;
  obsx = width - 40;
  obsy = base - 40;
  speed = 3;
  birdy = obsy - 40;
}

function draw() {
  background(bg);
  //console.log('Canvas width: ' + width + ', height: ' + height);
  dinoAnimation();
  updateObstacles();

  keyPressed();
  gameSpeed();
  //console.log(speed);

  //console.log('dino:' + dino);
  image(imgStack[dino], dinox, dinoy);

  stroke('black');
  line(0, base, width, base); //x1,y1,x2,y2

  fill(0, 0, 0);
  textSize(16);
  textAlign(RIGHT);
  text('HighScore: ' + highscore, 590, 15);

  fill(0, 0, 0);
  textSize(16);
  textAlign(LEFT);
  text('Score: ' + Math.floor(score / 2), 10, 15);
}

function dinoAnimation() {
  animate += 1;
  score += 1;
  if (animate % 10 == 0) {
    dino == 1 ? dino = 2 : dino = 1;
  }
}

//obstacle
function newObstacles() {
  if (rand) {
    num = randomImg(2, 7);
    addition = Math.floor(Math.random() * 3);
  }

  if (num >= 5) {
    num = birdAnimation(num);
    image(imgStack[num], obsx, birdy);

    rand = false;

    gameOverBird();
  }
  else {
    addCactus(addition);
    rand = false;
  }
}

function updateObstacles() {
  newObstacles();
  if (obsx > -40) {
    obsx -= speed;
  }
  else {
    obsx = width;
    rand = true;
  }
}

function birdAnimation(num) {
  if (num == 5) {
    animate % 20 == 0 ? num = 6 : num = 5;
  }
  else if (num == 6) {
    animate % 20 == 0 ? num = 5 : num = 6;
  }
  return num;
}

function addCactus(add) {
  for (i = add; i >= 0; i--) {
    image(imgStack[num], obsx + (i * 20), obsy);
  }
  gameOverCactus();
}

function keyPressed() {
  if (keyIsDown(UP_ARROW) && onGround) {
    if (dinoy == base - 40) {
      jumpSound.play();
    }
    jumping();
  }
  else if (keyIsDown(DOWN_ARROW)) {
    crouch();
  }
  else {
    gravity();
  }
}

function jumping() {
  if (jumpSpeed > 0 && onGround && gravitySpeed <= 0) {
    jumpSpeed -= jumpStrength;
    dinoy -= jumpSpeed;
    dino = 0;
  }
  else {
    onGround = false;
  }
}

function crouch() {
  gravitySpeed += 0.3;
  dinoy += gravitySpeed;
  if (dinoy >= 320) {
    diff = dinoy - 320;
    dinoy = dinoy - diff;
  }
}

function gravity() {
  gravitySpeed += gravityStrength;
  dinoy += gravitySpeed;
  //console.log(`Gravity: ` + gravitySpeed);
  if (dinoy >= 320) {
    diff = dinoy - 320;
    dinoy = dinoy - diff;
    gravitySpeed = 0;
    jumpSpeed = 5;
    onGround = true;
  }
}

function randomImg(start, end) {
  num = Math.floor(Math.random() * end);
  //console.log('num: ' + num);
  if (num < start + 1) {
    randomImg(start, end);
  }
  return num;
}

function gameSpeed() {
  if (score % 1000 == 0) {
    speedSound.play();
    speed += 1;
  }
}

function gameOverCactus() {
  if ((dinox + 40 > obsx &&
    dinoy + 40 > obsy &&
    dinox < obsx + 40 &&
    dinoy < obsy + 40)) {
    noLoop();
    gameOverText();
  }
}

function gameOverBird() {
  if ((dinox + 40 > obsx &&
    dinoy + 40 > obsy &&
    dinox < obsx + 40 &&
    dinoy < birdy + 40)) {
    gameOverText();
    noLoop();
  }
}

function gameOverText() {
  dieSound.play();

  fill(255, 0, 0);
  textSize(25);
  textStyle(ITALIC);
  textAlign(CENTER);
  text('Game Over!', 300, 150);

  textSize(20);
  textStyle(NORMAL);
  textAlign(CENTER);
  text('Left   Click   to   try   again!!!', 300, 200);
}


function mouseClicked() {
  dinox = 0;
  dinoy = 400;
  obsx = -40;
  if (score > highscore) {
    highscore = Math.floor(score / 2);
  }
  speed = 3;
  score = 0;
  loop();
}
