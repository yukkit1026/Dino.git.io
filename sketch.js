"use strict";
class AnimateObstacle {
  constructor(x, y, width, height, type, animate) {
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.type = type;
    this.animate = animate;
    if(type == 0){this.repeat = randomNum(1, 4);}else{this.repeat = 1;}
  }

  moveObstacle() {
    this.x -= speed;
    if (this.type == 1 && (score % 20) == 0) {
      this.animate = this.animate == 5 ? 6 : 5;
    }
  }
}

let imgStack = [];
let obsStack;

let img, bg;

let dieSound, jumpSound, speedSound;

let dinoImg;

let vertical;

let dinox, dinoy, dinoHeight, dinoWidth;
let obsx, obsy, obsWidth, obsHeight;

let gravitySpeed, gravityStrength;
let jumpSpeed, jumpStrength;

let animate = 0;

let score, highscore = 0;

let speed;

let onGround;

let generateObs;

let jumpCount;
//========================================

function preload() {
  imgStack.push((img = loadImage("img/dino1.png")));
  imgStack.push((img = loadImage("img/dino2.png")));
  imgStack.push((img = loadImage("img/dino3.png")));
  imgStack.push((img = loadImage("img/cactus1.png")));
  imgStack.push((img = loadImage("img/cactus2.png")));
  imgStack.push((img = loadImage("img/bird1.png")));
  imgStack.push((img = loadImage("img/bird2.png")));

  soundFormats("mp3");
  dieSound = loadSound("sound/dead");
  jumpSound = loadSound("sound/jump");
  speedSound = loadSound("sound/speed");
}

function setup() {
  obsStack = [];

  bg = loadImage("img/bg3.png");
  console.log("InnerHeight: " + innerHeight + ", InnerWidth: " + innerWidth);
  createCanvas(600, 400); //top - bottom, left - right

  dinoImg = 1;

  vertical = height - 40; //line, 360

  dinox = 10;
  dinoy = vertical - 40;
  dinoHeight = 40;
  dinoWidth = 40;

  obsx = width + 40;
  obsy = vertical - 40;

  speed = 2;

  gravitySpeed = 0;
  gravityStrength = 0.07;

  jumpSpeed = 5;
  jumpStrength = 0.2;

  score = 0;

  onGround = true;

  generateObs = true;

  jumpCount = 100;
}

function draw() {
  background(bg);
  dinoAnimation(); //ok
  updateObstacles();

  gameSpeed();
  image(imgStack[dinoImg], dinox, dinoy);
  gravity();

  stroke("black");
  line(0, vertical, width, vertical); //x1,y1,x2,y2

  fill(0, 0, 0);
  textSize(16);
  textAlign(RIGHT);
  text("HighScore: " + (sessionStorage.getItem("highscore") | 0), 590, 15);

  fill(0, 0, 0);
  textSize(16);
  textAlign(LEFT);
  text("Score: " + Math.floor(score / 2), 10, 15);


  if(keyIsDown(38)){
      if (dinoy == vertical - 40) {
        jumpSound.play();
      }
      jumping();        
  }
  else if(keyIsDown(40) && onGround == false){
    crouch();
  }
}

function dinoAnimation() {
  animate += 1;
  score += 1;
  if (animate % 10 == 0) {
    dinoImg == 1 ? (dinoImg = 2) : (dinoImg = 1);
  }
}

function updateObstacles() {
  console.log(obsStack)

  if (generateObs) {
    generateObs = false;
    newObstacles();        
  } 

  animateObstacle();
  if(obsStack[obsStack.length - 1].x <= 400 - randomNum(0, 200)){
    generateObs = true;
  }

  if(obsStack[0].x < -60){
    obsStack.shift();
  }
  
}

function animateObstacle() {
  for(let i = 0; i < obsStack.length; i++){
    for(let j = 0;j < obsStack[i].repeat;j++){
      image(imgStack[obsStack[i].animate], obsStack[i].x + (j*20), obsStack[i].y);      
      if(dinox + dinoWidth - 15 > obsStack[i].x &&
        dinox < obsStack[i].x + obsStack[i].width - 15 &&
        dinoy < obsStack[i].y + obsStack[i].height - 15 &&
        dinoy + dinoHeight - 15 > obsStack[i].y 
        ){              
        noLoop()
        gameOverText();
      }
    }
    obsStack[i].moveObstacle(); 
    
  }
}

function newObstacles() {
  
  let num = randomNum(0, 2);  

  if (num == 0) { // cactus
    let animate = new AnimateObstacle(obsx, obsy, 40, 40, num, 3);
    obsStack.push(animate);
  } else { //bird
    // let animate = new AnimateObstacle(obsx, obsy - randomNum(50,50), 40, 40, num, 5);
    let animate = new AnimateObstacle(obsx, obsy - randomNum(0,50), 40, 40, num, 5);
    obsStack.push(animate);
  }
}

function birdAnimation(num) {
  if (num == 5) {
    animate % 20 == 0 ? (num = 6) : (num = 5);
  } else if (num == 6) {
    animate % 20 == 0 ? (num = 5) : (num = 6);
  }
  return num;
}

function keyPressed(){
  if(keyCode == ESCAPE){
    setup();
    loop();
  }  
}

function keyTyped() {
  // print(key + ": " + keyCode)
  if (key === "p") {
    noLoop();
  } else if (key == "c") {
    loop();
  } 
}

function jumping() {  
  jumpSpeed -= jumpStrength;
  dinoy -= jumpSpeed;  
  onGround = false;
}

function crouch() {
  gravitySpeed += 0.3;
  dinoy += gravitySpeed;
  if (dinoy >= 320) {
    dinoy = vertical - 40;
    onGround = true;
  }
}

function gravity() {
  gravitySpeed += gravityStrength;
  dinoy += gravitySpeed;
  if (dinoy >= 320) {
    dinoy = vertical - 40;
    gravitySpeed = 0;
    jumpSpeed = 7;
    onGround = true;
  }
}

function randomNum(start, end) {
  let num = Math.floor(Math.random() * (end - start) + start);
  return num;
}

function gameSpeed() {
  if (score % 500 == 0) {
    speedSound.play();
    speed += 1;
    gravityStrength += 0.02
  }
}

function gameOverText() {
  dieSound.play();

  fill(255, 0, 0);
  textSize(25);
  textStyle(ITALIC);
  textAlign(CENTER);
  text("Game Over!", 300, 150);

  textSize(20);
  textStyle(NORMAL);
  textAlign(CENTER);
  text("'Esc'  to   try   again!!!", 300, 200);

  if(score > highscore){
    highscore = score;
    sessionStorage.setItem("highscore", highscore);
  }
}
