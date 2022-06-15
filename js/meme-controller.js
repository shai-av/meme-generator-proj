'use strict'
var gCanvas
var gCtx
var gCurrMeme


function onMemeGenInit() {
    gCanvas = document.getElementById('my-canvas')
    gCtx = gCanvas.getContext('2d')
    gCurrMeme = getMeme()

    setLineTextInputVal()
    addListeners()
    resizeCanvas()
    renderCanvas()
}

function resizeCanvas() {
    // let elCanvasContainer = document.querySelector('.canvas-container')
    // gCanvas.width = elCanvasContainer.offsetWidth * 0.95
    // gCanvas.height = elCanvasContainer.offsetHeight * 0.95
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
    window.addEventListener('resize', () => {
        resizeCanvas()
        renderCanvas()
    })
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

function hideMemeGen() {
    document.querySelector('.memegen').style.display = 'none'
}

function showMemeGen() {
    document.querySelector('.memegen').style.display = 'flex'
}

function drawText({ strokeColor, color, size, font, text, posX, posY }) {
    gCtx.lineWidth = 2;
    gCtx.strokeStyle = strokeColor;
    gCtx.fillStyle = color;
    gCtx.font = `${size}px ${font}`;
    gCtx.fillText(text, posX, posY);
    gCtx.strokeText(text, posX, posY);
}

function drawRect({posX,posY,size,text}) {
    gCtx.beginPath();
    gCtx.strokeStyle = 'white'
    gCtx.rect(posX-size/4, posY-size,  text.length*size*0.6,(size+10));
    gCtx.stroke();
}

function renderLines() {
    gCurrMeme.lines.forEach(line => {
        if(gCurrLine === line) drawRect(line);
        drawText(line)
    })
}

//--- controller ---
function onIncreaseTextSize() {
    if(!LinesExist()) return
    increaseTextSize()
    renderCanvas()
}

function onDecreaseTextSize() {
    if(!LinesExist()) return
    decreaseTextSize()
    renderCanvas()
}

function onStrokeClrChnage(color) {
    if(!LinesExist()) return
    setStrokeColor(color)
    renderCanvas()
}

function onFontClrChange(color) {
    if(!LinesExist()) return
    setFontColor(color)
    renderCanvas()
}

function onMovePrevLine() {
    if(!LinesExist()) return
    setPrevLine()
    setLineTextInputVal()
    renderCanvas()
}

function onMoveNextLine() {
    if(!LinesExist()) return
    setNextLine()
    setLineTextInputVal()
    renderCanvas()
}

function setLineTextInputVal() {
    let elLineTxtInput = document.querySelector('[name=line-text]')
    if (gCurrMeme.lines.length === 0) {
        elLineTxtInput.value = 'Enter Text Here'
    } else elLineTxtInput.value = getCurrLine().text
}

function onAdd() {
    let elLineTxtInput = document.querySelector('[name=line-text]')
    addLine(elLineTxtInput.value + '')
    setLineTextInputVal()
    renderLines()
}

function onDelete() {
    if(!LinesExist()) return
    deleteLine()
    renderCanvas()
    setLineTextInputVal()
}

function downloadCanvas(elLink) {
    const data = gCanvas.toDataURL()
    elLink.href = data
    elLink.download = 'my-img.jpg'
}

function LinesExist(){
    return gCurrMeme.lines.length !== 0
}