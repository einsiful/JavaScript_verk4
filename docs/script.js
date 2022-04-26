// Einar Árni Bjarnson
let canvas = document.getElementById("canvas-top");
let ctx = canvas.getContext("2d");
let gameState = {
  rectPosX: 10,
  rectPosY: canvas.height / 2 - 10,
  rectVelocity: { x: 0, y: 0 },
  playerSpeed: 0.5,
  enemyTimeout: 60,
  enemyTimeoutInit: 60,
  enemySpeed: 1,
  enemies: [],
  friendTimeout: 60,
  friendTimeoutInit: 60,
  friendSpeed: 1,
  friends: [],
  friendAdded:false,
  score: 0,
  money: 0
};
function random(n) {
  return Math.floor(Math.random() * n);
}
class RectCollider {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
  isColliding(rectCollider) {
    if (
      this.x < rectCollider.x + rectCollider.width &&
      this.x + this.width > rectCollider.x &&
      this.y < rectCollider.y + rectCollider.height &&
      this.height + this.y > rectCollider.y
    ) {
      return true;
    }
    return false;
  }
}
function checkCollision(gameState) {
  let playerCollider = new RectCollider(
    gameState.rectPosX,
    gameState.rectPosY,
    10.5,
    10.5
  );
  for (let i = 0; i < gameState.enemies.length; ++i) {
    let enemyCollider = new RectCollider(
      gameState.enemies[i].x,
      gameState.enemies[i].y,
      10,
      10
    );
    //Þegar að þú collidar á enemy á taparu og færð titring í síman.
    if (playerCollider.isColliding(enemyCollider)) {
      console.log("Titringur")
      window.navigator.vibrate(200); //Vibration
      return true;
    }
  
  }
  for (let i = 0; i < gameState.friends.length; ++i) {
    let friendCollider = new RectCollider(
      gameState.friends[i].x,
      gameState.friends[i].x -= 1,
      gameState.friends[i].y,
      5,
      5
    );
    //þegar að þú nærð rauða kassanum. þá færðu stig.
    //Spawnast alltaf tíunda hvert stig.
    if (playerCollider.isColliding(friendCollider)) {
      gameState.enemySpeed = 1.05;
      gameState.money++;
      gameState.friends.splice(i, 1);
    }
  }
}
//Update Function
function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  gameState.enemyTimeout -= 1;
  //Spawna enemy
  if (gameState.enemyTimeout == 0) {
    gameState.enemyTimeout = Math.floor(gameState.enemyTimeoutInit);
    gameState.enemies.push({
      x: canvas.width,
      y: random(canvas.height),
      velocity: gameState.enemySpeed
    });
    gameState.enemySpeed *= 1.001;
    gameState.enemyTimeoutInit = gameState.enemyTimeoutInit * 0.999;
    //console.log('timeout:'+gameState.enemyTimeoutInit);
    //console.log('speed:'+gameState.enemySpeed);
  }
  ctx.fillStyle = "#FF0000";
  //gameState.rectPosX += gameState.rectVelocity.x;
  gameState.rectPosY += gameState.rectVelocity.y;
  if (gameState.rectPosX > canvas.width - 10) {
    gameState.rectPosX = canvas.width - 10;
    gameState.rectVelocity.x = 0;
  }
  if (gameState.rectPosX < 0) {
    gameState.rectPosX = 0;
    gameState.rectVelocity.x = 0;
  }
  if (gameState.rectPosY < 0) {
    gameState.rectPosY = 0;
    gameState.rectVelocity.y = 0;
  }
  if (gameState.rectPosY > canvas.height - 10) {
    gameState.rectPosY = canvas.height - 10;
    gameState.rectVelocity.y = 0;
  }
  ctx.fillRect(gameState.rectPosX, gameState.rectPosY, 10, 10);
  ctx.fillStyle = "#0000FF";
  for (let i = 0; i < gameState.enemies.length; ++i) {
    gameState.enemies[i].x -= gameState.enemies[i].velocity;
    ctx.fillRect(gameState.enemies[i].x, gameState.enemies[i].y, 10, 10);
  }
  for (let i = 0; i < gameState.enemies.length; ++i) {
    if (gameState.enemies[i].x < -10) {
      gameState.enemies.splice(i, 1);
      gameState.score++;
    }
  }
  //Sýnir Stöðu Money
  document.getElementById("money").innerHTML = "Money: " + gameState.money;

  //Þetta er þegar þú er búin að ná að lifa í ákveðið margar sekúndur
  document.getElementById("score").innerHTML = "Score: " + gameState.score;
  if(gameState.score%10 == 0 && gameState.friendAdded == false){
    gameState.enemySpeed*=1.15;
    gameState.friends.push({
      x: random(canvas.width-20),
      y: random(canvas.height-20),
    });
    gameState.friendAdded = true;
  }
  if(gameState.score%10 == 1 && gameState.friendAdded == true){
    gameState.friendAdded = false;
  }
  for (let i = 0; i < gameState.friends.length; ++i) {
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(gameState.friends[i].x, gameState.friends[i].y, 10, 10);
  }
  if(checkCollision(gameState)==true){
    gameState = {
  rectPosX: 10,
  rectPosY: canvas.height / 2 - 10,
  rectVelocity: { x: 0, y: 0 },
  playerSpeed: 0.5,
  enemyTimeout: 60,
  enemyTimeoutInit: 60,
  enemySpeed: 1,
  enemies: [],
  friendSpeed: 1,
  friends: [],
  friendAdded:false,
  score: 0,
  money: 0
};
  }
}
setInterval(update, 20);
document.addEventListener("keydown", function(event) {
  if (event.keyCode == 39) {
    //Hægri arrow
    gameState.rectVelocity.x = gameState.playerSpeed;
  }
  if (event.keyCode == 37) {
    //Vinstri arrow
    gameState.rectVelocity.x = -gameState.playerSpeed;
  }
  if (event.keyCode == 38) {
    //UpP arrow
    gameState.rectVelocity.y = -gameState.playerSpeed;
  }
});
document.addEventListener("keyup", function(event) {
  if (event.keyCode == 38) {
    gameState.rectVelocity.y = gameState.playerSpeed;
  }
});

//document.querySelector("body").addEventListener("touchmove", function(ev) {
//  console.log( ev.touches, ev.type);
//  gameState.rectVelocity.y = gameState.playerSpeed;
//});

//Hér er ég að reyna að gera Touchevent en ég næ því ekki
// The item (or items) to press and hold on
let item = document.querySelector("body");

let timerID;
let counter = 0;

let pressHoldEvent = new CustomEvent("pressHold");

// Increase or decreae value to adjust how long
// one should keep pressing down before the pressHold
// event fires
let pressHoldDuration = 50;

// Listening for the mouse and touch events    
item.addEventListener("mousedown", pressingDown, false);
item.addEventListener("mouseup", notPressingDown, false);
item.addEventListener("mouseleave", notPressingDown, false);

item.addEventListener("touchstart", pressingDown, false);
item.addEventListener("touchend", notPressingDown, false);

// Listening for our custom pressHold event
item.addEventListener("pressHold", doSomething, false);

function pressingDown(e) {
  // byrjar the timer
  requestAnimationFrame(timer);

  e.preventDefault();

  console.log("Pressing!");
}

function notPressingDown(e) {
  // Stoppar timerinn
  cancelAnimationFrame(timerID);
  counter = 0;

  console.log("Not pressing!");
}

//
// Keyrir á 60 fps þegar að þú ýtir á takkan
//
function timer() {
  console.log("Timer tick!");

  if (counter < pressHoldDuration) {
    timerID = requestAnimationFrame(timer);
    counter++;
  } else {
    console.log("Press threshold reached!");
    item.dispatchEvent(pressHoldEvent);
  }
}

function doSomething(e) {
  console.log("pressHold event fired!");
}

function toggleFullScreen() {
  if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}
document.addEventListener("keydown", function(e) {
  if (e.key === "F10") {
    toggleFullScreen();
  }
}, false);