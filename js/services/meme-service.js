'use strict'
var testLine = {
    text: 'Text Here1',
    font: 'Impact',
    size: 35,
    align: 'center',
    color: '#ffffff',
    strokeColor: '#000000',
    posX: undefined,
    posY: 30,
    range: {}
}

var testLine2 = {
    text: 'Text Here2',
    font: 'Impact',
    size: 35,
    align: 'center',
    color: '#ffffff',
    strokeColor: '#000000',
    posX: undefined,
    posY: 465,
    range: {}
}

var demoLine = {
    text: '',
    font: 'Impact',
    size: 40,
    align: 'center',
    color: '#ffffff',
    strokeColor: '#000000',
    posX: undefined,
    posY: undefined,
    range: {}
}

var gMeme
var gCurrLine

function createMeme() {
    let meme = {
        image: getSelectedImage(),
        currLine: 0,
        lines: [testLine, testLine2]
    }
    return meme
}

function setMeme() {
    gMeme = createMeme()
    setGCurrLine()
    return gMeme
}

function setGCurrLine() {
    gCurrLine = gMeme.lines[gMeme.currLine]
}

function increaseTextSize(x = 5) {
    gCurrLine.size += x
}
function decreaseTextSize(x = 5) {
    let size = gCurrLine.size
    if (size > 5) gCurrLine.size -= x
}
function setStrokeColor(color) {
    gCurrLine.strokeColor = color
}

function setFontColor(color) {
    gCurrLine.color = color
}

function setTextAlign(dir) {
    gCurrLine.align = dir
}

function setFont(font) {
    gCurrLine.font = font
}

function setPrevLine() {
    gMeme.currLine = (gMeme.currLine === 0) ? gMeme.lines.length - 1 : --gMeme.currLine
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

function addLine() {
    let newLine
    if (gMeme.lines.length === 0) {
        newLine = JSON.parse(JSON.stringify(demoLine))
    } else newLine = JSON.parse(JSON.stringify(gCurrLine))
    newLine.text = ''
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
    line.range = {
        xStart: posX - text.length * size / 2 - 3,
        yStart: posY - size * 1.2,
        xRate: text.length * size + 3,
        yRate: size * 1.5
    }
}

function getCurrLineIdx() {
    return gMeme.currLine
}

function setCurrLineIdx(idx) {
    gMeme.currLine = idx
    if (idx === -1) return
    setGCurrLine()
}
function moveLine(dx,dy){
    gCurrLine.posX += dx
    gCurrLine.posY += dy
}

function getCurrMeme(){
    return gMeme
}