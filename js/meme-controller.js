'use strict'
var gCanvas
var gCtx
var gDrag = false
var gStartPos

function onMemeGenInit() {
    gCanvas = document.getElementById('my-canvas')
    gCtx = gCanvas.getContext('2d')
    setMeme()
    _setLineTextInputVal()
    addListeners()
    resizeCanvas()
    renderCanvas()
}

function hideMemeGen() {
    document.querySelector('.memegen').style.display = 'none'
}

function showMemeGen() {
    document.querySelector('.memegen').style.display = 'flex'
}

//--- Canvas ---
function resizeCanvas() {
    let elCanvasContainer = document.querySelector('.canvas-container')
    // gCanvas.width = elCanvasContainer.offsetWidth * 0.95
    // gCanvas.height = elCanvasContainer.offsetHeight * 0.95
    gCanvas.width = 500
    gCanvas.height = 500
}

function renderCanvas() {
    let image = new Image()
    image.src = getCurrMeme().image.dataset.src
    image.onload = () => {
        gCtx.drawImage(image, 0, 0, gCanvas.width, gCanvas.height)
        renderLinesSetRange()
    }
}

//--- Drawing ---
function drawText({ strokeColor, color, size, font, align, text, posX, posY }) {
    gCtx.lineWidth = 2
    gCtx.strokeStyle = strokeColor
    gCtx.fillStyle = color
    gCtx.font = `${size}px ${font}`
    gCtx.textAlign = align
    gCtx.fillText(text, posX, posY)
    gCtx.strokeText(text, posX, posY)
}

function drawRect({ xStart, yStart, xRate, yRate }) {
    gCtx.beginPath()
    gCtx.strokeStyle = 'black'
    gCtx.rect(xStart, yStart, xRate, yRate)
    gCtx.stroke()
}

function renderLinesSetRange() {
    const lines = getCurrMeme().lines
    lines.forEach((line, idx) => {
        if (!line.posX) line.posX = gCanvas.width / 2
        if (!line.posY) line.posY = gCanvas.height / 2
        drawText(line)
        setRange(line, line)
        if (getCurrLineIdx() === idx) drawRect(line.range)
    })
}

//--- listeners ---
function addListeners() {
    addMouseListeners()
    addTouchListeners()
    window.addEventListener('resize', () => {
        resizeCanvas()
        renderCanvas()
    })
}

function addMouseListeners() {
    gCanvas.addEventListener('mousemove', onMove)
    gCanvas.addEventListener('mousedown', onDown)
    gCanvas.addEventListener('mouseup', onUp)
}

function addTouchListeners() {
    gCanvas.addEventListener('touchmove', onMove)
    gCanvas.addEventListener('touchstart', onDown)
    gCanvas.addEventListener('touchend', onUp)
}

//--- events handlers ---
function onDown(ev) {
    const pos = getPosFromEv(ev)
    let lineIdx = getClickedLineIdx(pos)
    if (lineIdx !== -1) {
        setCurrLineIdx(lineIdx)
        _setControllerValuesByLine()
        renderCanvas()
        gDrag = true
        gStartPos = pos
    }
}

function onMove(ev) {
    if (gDrag) {
        const pos = getPosFromEv(ev)
        if (isOutOfCanvas(pos)) {
            onUp()
            return
        }
        const dx = pos.posX - gStartPos.posX
        const dy = pos.posY - gStartPos.posY
        moveLine(dx, dy)
        gStartPos = pos
        renderCanvas()
    }
}

function onUp() {
    gDrag = false
}

function getClickedLineIdx({ posX, posY }) {
    const lines = getCurrMeme().lines
    const lineIdx = lines.findIndex(({ range }) => {
        return posX >= range.xStart && posX <= range.xStart + range.xRate &&
            posY >= range.yStart && posY <= range.yStart + range.yRate
    })
    return lineIdx
}

function getPosFromEv(ev) {
    let posX
    let posY
    if (ev.type.includes('touch')) {
        ev.preventDefault()
        ev = ev.changedTouches[0]
        posX = ev.pageX - ev.target.offsetLeft - ev.target.clientLeft
        posY = ev.pageY - ev.target.offsetTop - ev.target.clientTop
    } else {
        posX = ev.offsetX
        posY = ev.offsetY
    }
    return { posX, posY }
}

function isOutOfCanvas({ posX, posY }) {
    return (posX <= -1 || posY <= -1 || posX >= gCanvas.width - 1 || posY >= gCanvas.height - 1)
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
    renderLinesSetRange()
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
    const tempLineIdx = getCurrLineIdx()
    setCurrLineIdx(-1)
    renderCanvas()
    setTimeout(() => {
        const data = gCanvas.toDataURL()
        elLink.href = data
        elLink.download = 'my-img.jpg'
        setCurrLineIdx(tempLineIdx)
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

function _isNoLineSelected() {
    return getCurrLineIdx() === -1
}

function onTextChange(val) {
    if (!_isLines()) return
    setText(val)
    renderCanvas()
}

function _isLines() {
    return getCurrMeme().lines.length !== 0
}

