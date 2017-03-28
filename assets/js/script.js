window.onload = function () {
  canvas = document.getElementById('gameCanvas')
  canvasContext = canvas.getContext('2d')

  var framesPerSecond = 30
  setInterval(updateAll, 500 / framesPerSecond)

  canvas.addEventListener('mousemove', updateMousePos)
  ballReset()
  brickReset()
  brickReset1()
}

var ballX = 75
var ballY = 75
var ballSpeedX = 5
var ballSpeedY = 7

var score = 0
var score1 = 0

const BRICK_W = 80
const BRICK_H = 20
const BRICK_COLS = 10
const BRICK_GAP = 2
const BRICK_ROWS = 4
var brickGrid = new Array(BRICK_COLS * BRICK_ROWS)
var brickGrid1 = new Array(BRICK_COLS * BRICK_ROWS)
var brickLeft = 0
var brickLeft1 = 0
const PADDLE_WIDTH = 100
const PADDLE_THICKNESS = 10
const PADDLE_DIST_FROM_EDGE = 90
var paddleX = 300
var paddleX2 = 300

var canvas, canvasContext

var mouseX = 0
var mouseY = 0

var keys = {
  left: false,
  right: false,
  reset: false
}
window.onkeydown = function (e) {
  var kc = e.keyCode
  e.preventDefault()
  if (kc === 39)keys.right = true
  else if (kc === 37)keys.left = true
  else if (kc === 65) keys.reset = true
}

window.onkeyup = function (e) {
  var kc = e.keyCode
  e.preventDefault()
  if (kc === 39)keys.right = false
  else if (kc === 37)keys.left = false
  else if (kc === 65) keys.reset = false
}
function PaddleX2Move () {
  if (keys.right === true && paddleX2 < canvas.width - PADDLE_WIDTH) {
    paddleX2 += 20
  } else if (keys.left === true && paddleX2 > 0) {
    paddleX2 -= 20
  }
}

function updateMousePos (evt) {
  var rect = canvas.getBoundingClientRect()
  var root = document.documentElement

  mouseX = evt.clientX - rect.left - root.scrollLeft
  mouseY = evt.clientY - rect.top - root.scrollTop

  paddleX = mouseX - PADDLE_WIDTH / 2
}

function brickReset () {
  brickLeft = 0
  for (var i = 0; i < BRICK_COLS * BRICK_ROWS; i++) {
    brickGrid[i] = true
    brickLeft++
  }
}
function brickReset1 () {
  brickLeft1 = 0
  for (var h = 0; h < BRICK_COLS * BRICK_ROWS; h++) {
    brickGrid1[h] = true
    brickLeft1++
  }
}

function updateAll () {
  moveAll()
  drawAll()
  PaddleX2Move()
  gameOver()
  restart()
  scoring()
}

function ballReset () {
  ballX = canvas.width / 2
  ballY = canvas.height / 2
}

function moveAll () {
  ballX += ballSpeedX
  ballY += ballSpeedY

  if (ballX < 0) { // left
    ballSpeedX *= -1
  }
  if (ballX > canvas.width) { // right
    ballSpeedX *= -1
  }
  if (ballY < 0) { // top
    ballSpeedY *= -1
  }
  if (ballY > canvas.height) { // bottom
    ballSpeedY *= -1
  }

  var ballBrickCol = Math.floor(ballX / BRICK_W)
  var ballBrickRow = Math.floor(ballY / BRICK_H)
  var brickIndexUnderBall = rowColToArrayIndex(ballBrickCol, ballBrickRow)

  var ballBrickCol1 = Math.floor(ballX / BRICK_W)
  var ballBrickRow1 = Math.floor((canvas.height - ballY) / BRICK_H)
  var brickIndexUnderBall1 = rowColToArrayIndex(ballBrickCol1, ballBrickRow1)

  if (ballBrickCol >= 0 && ballBrickCol < BRICK_COLS &&
  ballBrickRow >= 0 && ballBrickRow < BRICK_ROWS) {
    if (brickGrid[brickIndexUnderBall]) {
      brickGrid[brickIndexUnderBall] = false
      brickLeft--

      ballSpeedY *= -1
    }
  }
  if (ballBrickCol1 >= 0 && ballBrickCol1 < BRICK_COLS &&
    ballBrickRow1 >= 0 && ballBrickRow1 < BRICK_ROWS && ballY > canvas.height / 2) {
    if (brickGrid1[brickIndexUnderBall1]) {
      brickGrid1[brickIndexUnderBall1] = false
      brickLeft1--

      ballSpeedY *= -1
    }
  }

  var paddleTopEdgeY = canvas.height - PADDLE_DIST_FROM_EDGE
  var paddleBottomEdgeY = paddleTopEdgeY + PADDLE_THICKNESS
  var paddleLeftEdgeX = paddleX
  var paddleRightEdgeX = paddleLeftEdgeX + PADDLE_WIDTH
  if (ballY > paddleTopEdgeY && // below the top of paddle
    ballY < paddleBottomEdgeY && // above bottom of paddle
    ballX > paddleLeftEdgeX && // right of the left side of paddle
    ballX < paddleRightEdgeX) {
 // left of the left side of paddle

    ballSpeedY *= -1

    var centerOfPaddleX = paddleX + PADDLE_WIDTH / 2
    var ballDistFromPaddleCenterX = ballX - centerOfPaddleX
    ballSpeedX = ballDistFromPaddleCenterX * 0.35
  }
  var paddleTopEdgeY2 = PADDLE_DIST_FROM_EDGE - 12
  var paddleBottomEdgeY2 = paddleTopEdgeY2 + PADDLE_THICKNESS
  var paddleLeftEdgeX2 = paddleX2
  var paddleRightEdgeX2 = paddleLeftEdgeX2 + PADDLE_WIDTH
  if (ballY > paddleTopEdgeY2 && // below the top of paddle
    ballY < paddleBottomEdgeY2 && // above bottom of paddle
    ballX > paddleLeftEdgeX2 && // right of the left side of paddle
    ballX < paddleRightEdgeX2) {
 // left of the left side of paddle

    ballSpeedY *= -1

    var centerOfPaddleX2 = paddleX2 + PADDLE_WIDTH / 2
    var ballDistFromPaddleCenterX2 = ballX - centerOfPaddleX2
    ballSpeedX = ballDistFromPaddleCenterX2 * 0.35
  }
}

function rowColToArrayIndex (col, row) {
  return col + BRICK_COLS * row
}

function drawBricks () {
  for (var eachRow = 0; eachRow < BRICK_ROWS; eachRow++) {
    for (var eachCol = 0; eachCol < BRICK_COLS; eachCol++) {
      var arrayIndex = rowColToArrayIndex(eachCol, eachRow)
      if (brickGrid[arrayIndex]) {
        colorRect(BRICK_W * eachCol, BRICK_H * eachRow, BRICK_W - BRICK_GAP, BRICK_H - BRICK_GAP, 'rgba(255, 174, 153,1)')
      }
    }
  }
}
function drawBricks1 () {
  for (var eachRow = 0; eachRow < BRICK_ROWS; eachRow++) {
    for (var eachCol = 0; eachCol < BRICK_COLS; eachCol++) {
      var arrayIndex = rowColToArrayIndex(eachCol, eachRow)
      if (brickGrid1[arrayIndex]) {
        colorRect(BRICK_W * eachCol, canvas.height - (BRICK_H * (eachRow + 1)), BRICK_W - BRICK_GAP, BRICK_H - BRICK_GAP, 'rgba(153, 205, 255,1)')
      }
    }
  }
}

function drawAll () {
  colorRect(0, 0, canvas.width, canvas.height, 'rgba(0, 0, 0,0.3)') // clear screen

  colorCircle(ballX, ballY, 10, 'rgba(153, 255, 156,1)') // draw ball

  colorRect(paddleX, canvas.height - PADDLE_DIST_FROM_EDGE, PADDLE_WIDTH, PADDLE_THICKNESS, 'white')

  colorRect(paddleX2, PADDLE_DIST_FROM_EDGE - 12, PADDLE_WIDTH, PADDLE_THICKNESS, 'yellow')

  colorTextFont('P2 :' + score1 / 63, 695, 200, '#37E729', '20px Arial')
  colorTextFont('P1 :' + score / 63, 695, 400, '#37E729', '20px Arial')

  drawBricks()
  drawBricks1()
}

function colorRect (topLeftX, topLeftY, boxWidth, boxHeight, fillColor) {
  canvasContext.fillStyle = fillColor
  canvasContext.fillRect(topLeftX, topLeftY, boxWidth, boxHeight)
}

function colorCircle (centerX, centerY, radius, fillColor) {
  canvasContext.fillStyle = fillColor
  canvasContext.beginPath()
  canvasContext.arc(centerX, centerY, 10, 0, Math.PI * 2, true)
  canvasContext.fill()
}

function colorTextFont (showWords, textX, textY, fillColor, font) {
  canvasContext.fillStyle = fillColor
  canvasContext.fillText(showWords, textX, textY)
  canvasContext.font = font
}
function scoring () {
  if (brickLeft === 0) {
    return score++
  }
  if (brickLeft1 === 0) {
    return score1++
  }
}

function gameOver () {
  if (brickLeft === 0) {
    colorTextFont('Player 1 Won', 320, canvas.height / 2, 'pink', '30px Arial')
    setTimeout(function () {
      brickReset()
      brickReset1()
      ballReset()
    }, 1000)
  }
  if (brickLeft1 === 0) {
    colorTextFont('Player 2 Won', 320, canvas.height / 2, 'pink', '30px Arial')

    setTimeout(function () {
      brickReset()
      brickReset1()
      ballReset()
    }, 1000)
  }
}
function restart () {
  if (keys.reset === true) {
    ballReset()
    brickReset()
    brickReset1()
    score = 0
    score1 = 0
  }
}
