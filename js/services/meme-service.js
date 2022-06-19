'use strict'

var gMeme
var gCurrLine

var gDefLine1 = {
    text: 'Text here',
    font: 'Impact',
    size: 35,
    color: '#ffffff',
    strokeColor: '#000000',
    posX: undefined,
    posY: 50,
    range: {}
}

var gDefLine2 = {
    text: 'Text here',
    font: 'Impact',
    size: 35,
    color: '#ffffff',
    strokeColor: '#000000',
    posX: undefined,
    posY: 'bottom',
    range: {}
}

var gDemoLine = {
    text: '',
    font: 'Impact',
    size: 40,
    color: '#ffffff',
    strokeColor: '#000000',
    posX: undefined,
    posY: undefined,
    range: {}
}

function _createMeme() {
    const meme = {
        image: getSelectedImage(),
        currLine: 0,
        lines: [gDefLine1, gDefLine2]
    }
    return meme
}

function setMeme() {
    gMeme = _createMeme()
    setGCurrLine()
    return gMeme
}

function set_gMeme(meme){
    gMeme = meme
}

function setGCurrLine() {
    gCurrLine = gMeme.lines[gMeme.currLine]
}

function increaseTextSize(x = 5) {
    gCurrLine.size += x
}

function decreaseTextSize(x = 5) {
    const size = gCurrLine.size
    if (size > 5) gCurrLine.size -= x
}

function setStrokeColor(color) {
    gCurrLine.strokeColor = color
}

function setFontColor(color) {
    gCurrLine.color = color
}

function setFont(font) {
    gCurrLine.font = font
}

function setPrevLine() {
    gMeme.currLine = (gMeme.currLine <= 0) ? gMeme.lines.length - 1 : --gMeme.currLine
    setGCurrLine()
}

function setNextLine() {
    gMeme.currLine = (gMeme.currLine === gMeme.lines.length - 1) ? 0 : ++gMeme.currLine
    setGCurrLine()
}

function _setLastIdx() {
    gMeme.currLine = gMeme.lines.length - 1
    setGCurrLine()  /// if lines[] empty , set currLine to -1
}

function getCurrLine() {
    return gCurrLine
}

function setAlign(dir) {
    switch (dir) {
        case 'left':
            gCurrLine.posX = gCurrLine.range.xRate / 2
            break
        case 'right':
            gCurrLine.posX = getCanvas().width - gCurrLine.range.xRate / 2
            break
        default: gCurrLine.posX = getCanvas().width / 2
    }
}

function addLine(str = '') {
    const newLine = JSON.parse(JSON.stringify(gDemoLine))
    newLine.text = str
    newLine.posY = undefined
    gMeme.lines.push(newLine)
    _setLastIdx()
}

function deleteLine() {
    gMeme.lines.splice(gMeme.currLine, 1)
    if (gMeme.currLine === gMeme.lines.length) _setLastIdx()
    setGCurrLine()
}

function setText(val) {
    gCurrLine.text = val
}

function setRange(line, { posX, posY, text, size }) {
    const context = getContext()
    const txtWidth = context.measureText(text).width
    line.range = {
        xStart: posX - txtWidth / 2 - 5,
        yStart: posY - size * 1.2,
        xRate: txtWidth + 10,
        yRate: size * 1.5
    }
   setLineCorners(line,line.range)
}
function setLineCorners(line,{xStart,yStart,xRate,yRate}){
    line.corners ={
        topLeft:[xStart-10, yStart-10, 10, 10],
        bottomLeft:[xStart-10, yStart+yRate, 10, 10],
        topRight:[xStart+xRate, yStart-10, 10, 10],
        bottomRight:[xStart+xRate, yStart+yRate, 10, 10]
    }
}
//////////////////////////

function getCurrLineIdx() {
    return gMeme.currLine
}

function setCurrLineIdx(idx) {
    gMeme.currLine = idx
    if (idx === -1) return
    setGCurrLine()
}

function moveLine(dx, dy) {
    gCurrLine.posX += dx
    gCurrLine.posY += dy
}

function resizeLine(dx,dy){
    gCurrLine.size += (dx+dy)*0.47
}

function getCurrMeme() {
    return gMeme
}

function resetDefaultLines() {
    gDefLine1 = {
        text: 'Text here',
        font: 'Impact',
        size: 35,
        color: '#ffffff',
        strokeColor: '#000000',
        posX: undefined,
        posY: 50,
        range: {}
    }

    gDefLine2 = {
        text: 'Text here',
        font: 'Impact',
        size: 35,
        color: '#ffffff',
        strokeColor: '#000000',
        posX: undefined,
        posY: 'bottom',
        range: {}
    }
}

function setResetDefaultLines(){
    resetDefaultLines()
}