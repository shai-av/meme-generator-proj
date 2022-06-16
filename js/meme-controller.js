'use strict'
var gCanvas
var gCtx
var gCurrMeme


function onMemeGenInit() {
    gCanvas = document.getElementById('my-canvas')
    gCtx = gCanvas.getContext('2d')
    gCurrMeme = getMeme()

    _setLineTextInputVal()
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


//--- Drawing ---
function drawText({ strokeColor, color, size, font, align, text, posX = gCanvas.width / 2, posY = gCanvas.height / 2 }) {
    gCtx.lineWidth = 2
    gCtx.strokeStyle = strokeColor
    gCtx.fillStyle = color
    gCtx.font = `${size}px ${font}`
    gCtx.textAlign = align
    gCtx.fillText(text, posX, posY)
    gCtx.strokeText(text, posX, posY)
}

function drawRect({ posX = gCanvas.width / 2, posY = gCanvas.height / 2, size, text }) {
    gCtx.beginPath()
    gCtx.strokeStyle = 'black'
    gCtx.rect(posX - text.length * size / 2 - 3, posY - size * 1.2, text.length * size + 3, size * 1.5)
    gCtx.stroke()
}

function renderLines() {
    const lines = gCurrMeme.lines
    lines.forEach((line, idx) => {
        if (gCurrMeme.currLine === idx) drawRect(line)
        drawText(line)
    })
}

//--- controller ---
function onIncreaseTextSize() {
    if (_isNoLineSelected()) return
    increaseTextSize()
    renderCanvas()
}

function onDecreaseTextSize() {
    if (_isNoLineSelected()) return
    decreaseTextSize()
    renderCanvas()
}

function onStrokeClrChnage(color) {
    if (_isNoLineSelected()) return
    setStrokeColor(color)
    renderCanvas()
}

function onFontClrChange(color) {
    if (_isNoLineSelected()) return
    setFontColor(color)
    renderCanvas()
}

function onMovePrevLine() {
    if (!_isLines()) return
    setPrevLine()
    _setLineTextInputVal()
    renderCanvas()
    _setControllerValuesByLine()
}

function onMoveNextLine() {
    if (!_isLines()) return
    setNextLine()
    _setLineTextInputVal()
    renderCanvas()
    _setControllerValuesByLine()
}

function onAlign(dir) {
    if (_isNoLineSelected()) return
    setTextAlign(dir)
    renderCanvas()
}

function onAdd() {
    let elLineTxtInput = document.querySelector('[name=line-text]')
    addLine(elLineTxtInput.value + '')
    _setLineTextInputVal()
    renderLines()
    elLineTxtInput.focus()
    _setControllerValuesByLine()
}

function onDelete() {
    if (_isNoLineSelected()) return
    deleteLine()
    renderCanvas()
    _setLineTextInputVal()
    _setControllerValuesByLine()
}

function onFontChange(font) {
    setFont(font)
    renderCanvas()
}

function _downloadCanvas(elLink) {
    const tempLineIdx = gCurrMeme.currLine
    gCurrMeme.currLine = -1
    renderCanvas()
    setTimeout(() => {
        const data = gCanvas.toDataURL()
        elLink.href = data
        elLink.download = 'my-img.jpg'
        gCurrMeme.currLine = tempLineIdx
        renderCanvas()
    }, 1000 * 1)
}

function _setLineTextInputVal() {
    let elLineTxtInput = document.querySelector('[name=line-text]')
    if (!_isLines()) {
        elLineTxtInput.value = 'press +Add'
        elLineTxtInput.disabled = true
    } else {
        elLineTxtInput.disabled = false
        elLineTxtInput.value = getCurrLine().text
    }
}

function _isNoLineSelected() {
    return gCurrMeme.currLine === -1
}

function _isLines() {
    return gCurrMeme.lines.length !== 0
}

function onTextChange(val) {
    if (!_isLines()) return
    setText(val)
    renderCanvas()
}

function hideMemeGen() {
    document.querySelector('.memegen').style.display = 'none'
}

function showMemeGen() {
    document.querySelector('.memegen').style.display = 'flex'
}

function _setControllerValuesByLine() {
    if (!_isLines()) return
    const elFontClr = document.querySelector('[name=font-color]')
    const elStrokeClr = document.querySelector('[name=stroke-color]')
    const elfont = document.querySelector('[name=font-select]')
    const line = getCurrLine()

    elFontClr.value = line.color
    elStrokeClr.value = line.strokeColor
    elfont.value = line.font
}