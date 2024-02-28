// setup canvas
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);


// function to generate random number
function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}

// function to generate random color
function randomRGB() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

class Ball {
  constructor(x, y, velX, velY, color, size, shape = "circle") {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.color = color;
    this.size = size;
    this.shape = shape;
    this.initColor = color;
  }

  draw(){
    ctx.beginPath();
    ctx.fillStyle = this.color;
    if(this.shape == "circle"){
      ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    }else if(this.shape == "square"){
      let squareSize = this.size +  50;
      ctx.fillRect(this.x - (this.size/2), this.y - (this.size/2),  squareSize, squareSize);
    }else if(this.shape == "heart"){
      let heartX = this.x - 65;
      let heartY = this.y - 65;
      ctx.moveTo(heartX + 75, heartY + 40);
      ctx.bezierCurveTo(heartX + 75, heartY + 37, heartX + 70, heartY + 25, heartX + 50, heartY + 25);
      ctx.bezierCurveTo(heartX + 20, heartY + 25, heartX + 20, heartY + 62.5, heartX + 20, heartY + 62.5);
      ctx.bezierCurveTo(heartX + 20, heartY + 80, heartX + 40, heartY + 102, heartX + 75, heartY + 120);
      ctx.bezierCurveTo(heartX + 110, heartY + 102, heartX + 130, heartY + 80, heartX + 130, heartY + 62.5);
      ctx.bezierCurveTo(heartX + 130, heartY + 62.5, heartX + 130, heartY + 25, heartX + 100, heartY + 25);
      ctx.bezierCurveTo(heartX + 85, heartY + 25, heartX + 75, heartY + 37, heartX + 75, heartY + 40);

    }
    ctx.fill();
  }


  update() {
    if (this.x + this.size >= width) {
      this.velX = -this.velX;
    }

    if (this.x - this.size <= 0) {
      this.velX = -this.velX;
    }

    if (this.y + this.size >= height) {
      this.velY = -this.velY;
    }

    if (this.y - this.size <= 0) {
      this.velY = -this.velY;
    }


    this.x += this.velX;
    this.y += this.velY;
  }

  collisionDetect() {
    for (let j = 0; j < balls.length; j++) {
      if (!(this === balls[j])) {
        const dx = this.x - balls[j].x;
        const dy = this.y - balls[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + balls[j].size) {
          balls[j].color = this.color =
            "rgb(" +
            random(0, 255) +
            "," +
            random(0, 255) +
            "," +
            random(0, 255) +
            ")";
        }else{
          this.color = this.initColor;
        }
      }
    }
  }
}


const updateQtdBalls = (array, qtd) =>{
  if(array.length < qtd){
    while (array.length < qtd) {
      let size = random(10, 40);
      let ball = new Ball(
        random(0 + size, width - size),
        random(0 + size, height - size),
        random(-8, 8),
        random(-8, 8),
        array[0].color,
        size,
        array[0].shape, 
      );
    
      array.push(ball);
    }
  }else if(array.length > qtd){
    array.splice(qtd,array.length - qtd);
  }
}

const updateColorBalls = (array, color) => {
    array.forEach((ball) =>{
      ball.color = color;
      ball.initColor = color;
    });
}


const updateFormsBalls = (array, forms) => {
  array.forEach((ball) =>{
    ball.shape = forms;
  });
}



const initBall = () =>{
  let size = random(10, 40);
  let ball = new Ball(
        random(0 + size, width - size),
        random(0 + size, height - size),
        random(-8, 8),
        random(-8, 8),
        "red",
        size,
      );
    
    return ball;
}

let balls = new Array();
balls[0] = initBall();
updateQtdBalls(balls, 24);

 
function loop() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < balls.length; i++) {
    balls[i].draw();
    balls[i].update();
    balls[i].collisionDetect();

  }

  requestAnimationFrame(loop);
}

const qtdForms = document.querySelectorAll('input[name="quantidade"');
const colorForms = document.querySelectorAll('input[name="cores"');
const FormatForms = document.querySelectorAll('input[name="formas"');

qtdForms.forEach(function(radio) {
  radio.addEventListener('change', function(e){
    updateQtdBalls(balls, e.target.value);
  });
});


colorForms.forEach(function(radio) {
  radio.addEventListener('change', function(e){
    updateColorBalls(balls, e.target.value);
  });
});

FormatForms.forEach(function(radio) {
  radio.addEventListener('change', function(e){
    updateFormsBalls(balls, e.target.value);
  });
});

loop()