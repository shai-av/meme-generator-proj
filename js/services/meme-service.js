'use strict'
var testLine = {
    text: 'Text Here',
    font: 'Impact',
    size: 35,
    align: 'center',
    color: '#ffffff',
    strokeColor: '#000000',
    posX: undefined,
    posY: 30,
}

var testLine2 = {
    text: 'Text Here',
    font: 'Impact',
    size: 35,
    align: 'center',
    color: '#ffffff',
    strokeColor: '#000000',
    posX: undefined,
    posY: 465
}

var demoLine = {
    text: '',
    font: 'Impact',
    size: 40,
    align: 'center',
    color: '#ffffff',
    strokeColor: '#000000',
    posX: undefined,
    posY: undefined
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

function getMeme() {
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

function setTextAlign(dir){
    gCurrLine.align = dir
}

function setFont(font){
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
    gMeme.lines.push(newLine)
    _setLastIdx()
}

function deleteLine() {
    gMeme.lines.splice(gMeme.currLine, 1)
    if (gMeme.currLine === gMeme.lines.length) _setLastIdx()
    setGCurrLine()
}

function setText(val){
    gCurrLine.text = val
}