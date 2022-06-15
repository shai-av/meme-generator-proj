'use strict'
var gCanvas
var gCtx
var gCurrImg
var gCurrMeme


function onMemeGenInit() {
    gCanvas = document.getElementById('my-canvas')
    gCtx = gCanvas.getContext('2d')
    gCurrImg = getSelectedImage()
    gCurrMeme = getMeme()

    setLineTextInputVal()
    addListeners()
    resizeCanvas()
    renderCanvas()
}

function resizeCanvas() {
    // let elCanvasContainer = document.querySelector('.canvas-container')
    // gCanvas.width = elCanvasContainer.offsetWidth*0.95
    // gCanvas.height = elCanvasContainer.offsetHeight*0.95
    gCanvas.width = 500
    gCanvas.height = 500
}

function renderCanvas() {
    let image = new Image()
    image.src = gCurrMeme.image.dataset.src
    image.onload = () => {
        gCtx.drawImage(image, 0, 0, gCanvas.width, gCanvas.height);
        renderLines()
    }
}

//--- listeners ---
function addListeners() {
    // addMouseListeners()
    // addTouchListeners()
    // window.addEventListener('resize', () => {
    //     resizeCanvas()
    //     renderCanvas()
    // })
}

// function addMouseListeners() {
//     gCanvas.addEventListener('mousemove', onMove)
//     gCanvas.addEventListener('mousedown', onDown)
//     gCanvas.addEventListener('mouseup', onUp)
// }

// function addTouchListeners() {
//     gCanvas.addEventListener('touchmove', onMove)
//     gCanvas.addEventListener('touchstart', onDown)
//     gCanvas.addEventListener('touchend', onUp)
// }

function hideMemeGen(){
    document.querySelector('.memegen').style.display = 'none'
}

function showMemeGen(){
    document.querySelector('.memegen').style.display = 'flex'
}

// function drawText(line) {
//     gCtx.lineWidth = 2;
//     gCtx.strokeStyle = line.strokeColor;
//     gCtx.fillStyle = line.color;
//     gCtx.font = `${line.size}px ${line.font}`;
//     gCtx.fillText(line.text, line.posX, line.posY);
//     gCtx.strokeText(line.text, line.posX, line.posY);
//   }
function drawText({strokeColor,color,size,font,text,posX,posY}) {
    gCtx.lineWidth = 2;
    gCtx.strokeStyle = strokeColor;
    gCtx.fillStyle = color;
    gCtx.font = `${size}px ${font}`;
    gCtx.fillText(text, posX, posY);
    gCtx.strokeText(text, posX, posY);
  }
  
  function renderLines(){
    gCurrMeme.lines.forEach(line=>drawText(line))
  }

//--- controller ---
function onIncreaseTextSize(){
    increaseTextSize()
    renderCanvas()
}

function onDecreaseTextSize(){
    decreaseTextSize()
    renderCanvas()
}

function onStrokeClrChnage(color){
    setStrokeColor(color)
    renderCanvas()
}

function onFontClrChange(color){
    setFontColor(color)
    renderCanvas()
}

function onMovePrevLine(){
    setPrevLine()
    setLineTextInputVal()
}

function onMoveNextLine(){
    setNextLine()
    setLineTextInputVal()
}

function setLineTextInputVal(){
    let elLineTxtInput = document.querySelector('[name=line-text]')
    elLineTxtInput.value = getCurrLine().text
}

function onAddLine(){
    let elLineTxtInput = document.querySelector('[name=line-text]')
    addLine(elLineTxtInput.value+'')
    setLineTextInputVal()
    renderLines()
}

