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

function getContext(){
    return gCtx
}
//--- Canvas ---
function resizeCanvas() {
    let elCanvasContainer = document.querySelector('.canvas-container')
    gCanvas.width = elCanvasContainer.offsetWidth * 0.95
    // gCanvas.height = elCanvasContainer.offsetHeight * 0.95
    gCanvas.height = gCanvas.width
    // gCanvas.width = 500
    // gCanvas.height = 500
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
function drawText({ strokeColor, color, size, font, text, posX, posY }) {
    gCtx.lineWidth = 2
    gCtx.strokeStyle = strokeColor
    gCtx.fillStyle = color
    gCtx.font = `${size}px ${font}`
    gCtx.textAlign = 'center'
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
        if (getCurrLineIdx() === idx) drawRect(line.range),drawArc(line.range)
    })
}

function drawArc({ xStart, yStart, xRate, yRate }) {
    gCtx.beginPath()
    gCtx.lineWidth = '2'
    gCtx.arc(xStart+xRate, yStart+yRate, 5, 0, 2 * Math.PI)
    gCtx.strokeStyle = 'white'
    gCtx.stroke()
    gCtx.fillStyle = 'lightgreen'
    gCtx.fill()
}

//--- listeners ---
function addListeners() {
    addMouseListeners()
    addTouchListeners()
    addWindowListeners()
    addDownloadBtnListenesrs()
}

function addWindowListeners() {
    window.addEventListener('resize', () => {
        resizeCanvas()
        renderCanvas()
    })
    window.addEventListener('mouseup', onUp)
    window.addEventListener('touchend', onUp)
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

function addDownloadBtnListenesrs(){
    const elDownload = document.querySelector('.download-link')
    elDownload.addEventListener('mousedown',clearLineFrame)
    elDownload.addEventListener('touchstart', clearLineFrame)
}
function clearLineFrame(){
    setCurrLineIdx(-1)
    renderCanvas()
    setGCurrLine()
    _setLineTextInputVal()
}
//--- events handlers ---
function onDown(ev) {
    const pos = getPosFromEv(ev)
    let lineIdx = getClickedLineIdx(pos)
    if (lineIdx !== -1) {
        setCurrLineIdx(lineIdx)
        _setControllerValuesByLine()
        _setLineTextInputVal()
        renderCanvas()
        gDrag = true
        gStartPos = pos
    } else setCurrLineIdx(-1), renderCanvas(), _setLineTextInputVal()
}

function onMove(ev) {
    if (gDrag) {
        const pos = getPosFromEv(ev)
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

function onAdd() {
    let elLineTxtInput = document.querySelector('[name=line-text]')
    addLine(elLineTxtInput.value + '')
    _setLineTextInputVal()
    renderLinesSetRange()
    elLineTxtInput.focus()
    _setControllerValuesByLine()
    renderCanvas()
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
    const data = gCanvas.toDataURL();
    elLink.href = data;
    elLink.download = 'my-img.jpg';
}

function _setLineTextInputVal() {
    let elLineTxtInput = document.querySelector('[name=line-text]')

    if (!_isLines()) {
        elLineTxtInput.value = 'press +Add'
        elLineTxtInput.disabled = true
    } else {
        if (getCurrLineIdx() === -1) {
            elLineTxtInput.value = 'no line selected'
            elLineTxtInput.disabled = true
        } else {
            elLineTxtInput.disabled = false
            elLineTxtInput.value = getCurrLine().text
        }
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

