'use strict'
var gCanvas
var gCtx
var gDrag = false
var gDragCorner = false
var gRotate = false
var gCornerIdx
var gStartPos
var gCurrImage = null

function onMemeGenInit() {
    gCanvas = document.getElementById('my-canvas')
    gCtx = gCanvas.getContext('2d')
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

function getCanvas() {
    return gCanvas
}

//--- Canvas ---
function _resizeCanvas() {
    const elCanvasContainer = document.querySelector('.canvas-container')
    const imageHeight = +gCurrImage.naturalHeight
    const imageWidth = +gCurrImage.naturalWidth
    const imageRatio = imageHeight / imageWidth

    gCanvas.width = elCanvasContainer.offsetWidth
    gCanvas.height = elCanvasContainer.offsetWidth * imageRatio
}

function _renderCanvas() {
    const image = new Image()
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

function _drawRect({ xStart, yStart, xRate, yRate }, { topLeft, bottomLeft, topRight, bottomRight }) {
    gCtx.save()
    gCtx.beginPath()
    gCtx.strokeStyle = 'black'
    gCtx.rect(...topLeft)
    gCtx.rect(...bottomLeft)
    gCtx.rect(...topRight)
    gCtx.rect(...bottomRight)
    gCtx.fillStyle = 'white'
    gCtx.fill()
    gCtx.rect(xStart, yStart, xRate, yRate)
    gCtx.stroke()
    gCtx.restore()
}

function _renderLinesSetRange() {
    const lines = getCurrMeme().lines

    lines.forEach((line, idx) => {
        if (!line.posX) line.posX = gCanvas.width / 2
        if (!line.posY) line.posY = gCanvas.height / 2
        if (line.posY === 'bottom') line.posY = getCanvas().height - line.size
        _drawText(line)
        setRange(line)
        if (getCurrLineIdx() === idx) _drawRect(line.range, line.corners), _drawArc(line.rotArc)
    })
}

function _drawArc({ xStart, yStart, size }) {
    gCtx.save()
    gCtx.beginPath()
    gCtx.lineWidth = '2'
    gCtx.arc(xStart, yStart, size, 0, 2 * Math.PI)
    gCtx.strokeStyle = 'white'
    gCtx.stroke()
    gCtx.fillStyle = 'lightgreen'
    gCtx.fill()
    gCtx.restore()
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

function _addSaveBtnListeners() {
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
    if (_isRotArc(pos)) {
        gRotate = true
        gStartPos = pos
        console.log('rotation try')
        return
    } else if (_getCornerIdx(pos) !== -1) {
        gDragCorner = true
        gStartPos = pos
        gCornerIdx = _getCornerIdx(pos)
    } else {
        const lineIdx = _getClickedLineIdx(pos)
        if (lineIdx !== -1) {
            setCurrLineIdx(lineIdx)
            _setControllerValuesByLine()
            _setLineTextInputVal()
            _renderCanvas()
            gDrag = true
            gStartPos = pos
        } else setCurrLineIdx(-1), _renderCanvas(), _setLineTextInputVal()
    }
}

function _onMove(ev) {
    if (!gDrag && !gDragCorner && !gRotate) return
    const pos = _getPosFromEv(ev)
    const dx = pos.posX - gStartPos.posX
    const dy = pos.posY - gStartPos.posY

    if (gDrag) {
        moveLine(dx, dy)
    } else if (gDragCorner) {
        _onResizeLine(dx, dy)
    } else if (gRotate) {
        // rotateTxt(dx,dy)

        //rotate template 
        //ctx.save()
        //ctx.translate(posX,posY)
        //ctx.rotate("deg"*Math.PI/180)
        //ctx.txt(txt,0,0)
        //ctx.restore
    }
    gStartPos = pos
    _renderCanvas()
}

function _onUp() {
    if (gDrag) gDrag = false
    if (gDragCorner) gDragCorner = false
    if(gRotate) gRotate = false
}

function _onResizeLine(dx, dy) {
    const corenerIdx = gCornerIdx
    switch (corenerIdx) {
        case 0:
            resizeLine(-dx, -dy)
            break
        case 1:
            resizeLine(-dx, dy)
            break
        case 2:
            resizeLine(dx, -dy)
            break
        case 3: resizeLine(dx, dy)
    }
}

function _isRotArc({ posX, posY }) {
    const circle = getCurrLine().rotArc
    const distance = Math.sqrt((circle.xStart - posX) ** 2 + (circle.yStart - posY) ** 2)
    return distance <= circle.size
}

function _getCornerIdx({ posX, posY }) {
    const allCorners = Object.values(getCurrLine().corners)
    return allCorners.findIndex((corner) => {
        return posX >= corner[0] && posX <= corner[0] + corner[2] &&
            posY >= corner[1] && posY <= corner[1] + corner[3]
    })
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
    const elLineTxtInput = document.querySelector('[name=line-text]')
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

function onAlign(dir) {
    if (_isNoLineSelected()) return
    setAlign(dir)
    _renderCanvas()
}

function _downloadCanvas(elLink) {
    const data = gCanvas.toDataURL()
    elLink.href = data
    elLink.download = 'my-img.jpg'
}

function onSave() {
    const meme = getCurrMeme()
    const imgDataUrl = gCanvas.toDataURL()
    saveMeme(meme, imgDataUrl)
    _showHidesaveModal()
}

function _showHidesaveModal() {
    document.body.classList.add('save-modal-open')
    setTimeout(() => {
        document.body.classList.remove('save-modal-open')
    }, 1000 * 1.5)
}

function _setLineTextInputVal() {
    const elLineTxtInput = document.querySelector('[name=line-text]')

    if (!_isLines()) {
        elLineTxtInput.value = 'press +Add'
        elLineTxtInput.disabled = true
    } else {
        if (getCurrLineIdx() === -1) {
            elLineTxtInput.value = 'No line selected'
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

