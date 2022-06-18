'use strict'
var gCanvas
var gCtx
var gDrag = false
var gStartPos
var gCurrImage = null

function onMemeGenInit() {
    gCanvas = document.getElementById('my-canvas')
    gCtx = gCanvas.getContext('2d')
    setMeme()
    _setLineTextInputVal()
    _addListeners()
    _renderCanvas()
    _resizeCanvas()
}

function showMemeGen() {
    document.body.className = 'memegen-open'
}

function getContext() {
    return gCtx
}

function getCanvas(){
    return gCanvas
}

//--- Canvas ---
function _resizeCanvas() {
    let elCanvasContainer = document.querySelector('.canvas-container')
    let imageHeight = +gCurrImage.naturalHeight
    let imageWidth = +gCurrImage.naturalWidth
    let imageRatio = imageHeight/imageWidth

    gCanvas.width = elCanvasContainer.offsetWidth
    gCanvas.height = elCanvasContainer.offsetWidth*imageRatio
}

function _renderCanvas() {
    let image = new Image()
    image.src = getSelectedImage()
    gCurrImage = image

    image.onload = () => {
        gCtx.drawImage(image, 0, 0, gCanvas.width, gCanvas.height)
        _renderLinesSetRange()
    }
  
}

//--- Drawing ---
function _drawText({ strokeColor, color, size, font, text, posX, posY }) {
    gCtx.lineWidth = 2
    gCtx.strokeStyle = strokeColor
    gCtx.fillStyle = color
    gCtx.font = `${size}px ${font}`
    gCtx.textAlign = 'center'
    gCtx.fillText(text, posX, posY)
    gCtx.strokeText(text, posX, posY)
}

function _drawRect({ xStart, yStart, xRate, yRate }) {
    gCtx.beginPath()
    gCtx.strokeStyle = 'black'
    gCtx.rect(xStart, yStart, xRate, yRate)
    gCtx.stroke()
}

function _renderLinesSetRange() {
    const lines = getCurrMeme().lines
    lines.forEach((line, idx) => {
        if (!line.posX) line.posX = gCanvas.width / 2
        if (!line.posY) line.posY = gCanvas.height / 2
        if(line.posY === 'bottom') line.posY = getCanvas().height - line.size
        _drawText(line)
        setRange(line, line)
        
        if (getCurrLineIdx() === idx) _drawRect(line.range), _drawArc(line.range)
    })
}

function _drawArc({ xStart, yStart, xRate, yRate }) {
    gCtx.beginPath()
    gCtx.lineWidth = '2'
    gCtx.arc(xStart + xRate, yStart + yRate, 5, 0, 2 * Math.PI)
    gCtx.strokeStyle = 'white'
    gCtx.stroke()
    gCtx.fillStyle = 'lightgreen'
    gCtx.fill()
}

//--- listeners ---
function _addListeners() {
    _addMouseListeners()
    _addTouchListeners()
    _addWindowListeners()
    _addDownloadBtnListeners()
    _addSaveBtnListeners()
}

function _addWindowListeners() {
    window.addEventListener('resize', () => {
        _resizeCanvas()
        _renderCanvas()
    })
    window.addEventListener('mouseup', _onUp)
    window.addEventListener('touchend', _onUp)
}

function _addMouseListeners() {
    gCanvas.addEventListener('mousemove', _onMove)
    gCanvas.addEventListener('mousedown', _onDown)
    gCanvas.addEventListener('mouseup', _onUp)
}

function _addTouchListeners() {
    gCanvas.addEventListener('touchmove', _onMove)
    gCanvas.addEventListener('touchstart', _onDown)
    gCanvas.addEventListener('touchend', _onUp)
}

function _addDownloadBtnListeners() {
    const elDownload = document.querySelector('.download-link')
    elDownload.addEventListener('mousedown', _clearLineFrame)
    elDownload.addEventListener('touchstart', _clearLineFrame)
}

function _addSaveBtnListeners(){
    const elSave = document.querySelector('.save-btn')
    elSave.addEventListener('mousedown', _clearLineFrame)
    elSave.addEventListener('touchstart', _clearLineFrame)
}
function _clearLineFrame() {
    setCurrLineIdx(-1)
    _renderCanvas()
    setGCurrLine()
    _setLineTextInputVal()
}

//--- events handlers ---
function _onDown(ev) {
    const pos = _getPosFromEv(ev)
    let lineIdx = _getClickedLineIdx(pos)
    if (lineIdx !== -1) {
        setCurrLineIdx(lineIdx)
        _setControllerValuesByLine()
        _setLineTextInputVal()
        _renderCanvas()
        gDrag = true
        gStartPos = pos
    } else setCurrLineIdx(-1), _renderCanvas(), _setLineTextInputVal()
}

function _onMove(ev) {
    if (gDrag) {
        const pos = _getPosFromEv(ev)
        const dx = pos.posX - gStartPos.posX
        const dy = pos.posY - gStartPos.posY
        moveLine(dx, dy)
        gStartPos = pos
        _renderCanvas()
    }
}

function _onUp() {
    if (gDrag) gDrag = false
}

function _getClickedLineIdx({ posX, posY }) {
    const lines = getCurrMeme().lines
    const lineIdx = lines.findIndex(({ range }) => {
        return posX >= range.xStart && posX <= range.xStart + range.xRate &&
            posY >= range.yStart && posY <= range.yStart + range.yRate
    })
    return lineIdx
}

function _getPosFromEv(ev) {
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
    _renderCanvas()
}

function onDecreaseTextSize() {
    if (_isNoLineSelected()) return
    decreaseTextSize()
    _renderCanvas()
}

function onStrokeClrChnage(color) {
    if (_isNoLineSelected()) return
    setStrokeColor(color)
    _renderCanvas()
}

function onFontClrChange(color) {
    if (_isNoLineSelected()) return
    setFontColor(color)
    _renderCanvas()
}

function onMovePrevLine() {
    if (!_isLines()) return
    setPrevLine()
    _setLineTextInputVal()
    _renderCanvas()
    _setControllerValuesByLine()
}

function onMoveNextLine() {
    if (!_isLines()) return
    setNextLine()
    _setLineTextInputVal()
    _renderCanvas()
    _setControllerValuesByLine()
}

function onAdd(str = '') {
    let elLineTxtInput = document.querySelector('[name=line-text]')
    addLine(str)
    _setLineTextInputVal()
    _renderLinesSetRange()
    elLineTxtInput.focus()
    _setControllerValuesByLine()
    _renderCanvas()
}

function onDelete() {
    if (_isNoLineSelected()) return
    deleteLine()
    _renderCanvas()
    _setLineTextInputVal()
    _setControllerValuesByLine()
}

function onFontChange(font) {
    if (_isNoLineSelected()) return
    setFont(font)
    _renderCanvas()
}

function onAlign(dir){
    if (_isNoLineSelected()) return
    setAlign(dir)
    _renderCanvas()
}

function _downloadCanvas(elLink) {
    const data = gCanvas.toDataURL()
    elLink.href = data
    elLink.download = 'my-img.jpg'
}

function onSave(){
    const meme = getCurrMeme()
    const imgDataUrl = gCanvas.toDataURL()
    saveMeme(meme,imgDataUrl)
}

function _setLineTextInputVal() {
    let elLineTxtInput = document.querySelector('[name=line-text]')

    if (!_isLines()) {
        elLineTxtInput.value = 'press +Add'
        elLineTxtInput.disabled = true
    } else {
        if (getCurrLineIdx() === -1) {
            elLineTxtInput.value = 'No Line Selected'
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
    _renderCanvas()
}

function _isLines() {
    return getCurrMeme().lines.length !== 0
}

