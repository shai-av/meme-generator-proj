'use strict'
var testLine = {
    text:'hello',
    size:20,
    font:'Ariel',
    align:'left',
    color:'blue',
    strokeColor:'red',
    posX:100,
    posY:450
}
var testLine2 = {
    text:'bye',
    size:40,
    align:'right',
    color:'yellow',
    strokeColor:'black',
    posX :250,
    posY :250,
    font:'Ariel'
}

var gMeme
var gCurrLine

function createMeme(){
    let meme ={
        image:getSelectedImage(),
        currLine:0,
        lines:[testLine,testLine2]
    } 
    return meme
}

function getMeme(){
   gMeme = createMeme()
   setGCurrLine()
    return gMeme
}

function setGCurrLine(){
    gCurrLine = gMeme.lines[gMeme.currLine]
}

function increaseTextSize(x=5){
    gCurrLine.size+=x
}
function decreaseTextSize(x=5){
    let size = gCurrLine.size
    if(size>5) gCurrLine.size -=x
    else return
}
function setStrokeColor(color){
    gCurrLine.strokeColor = color
}

function setFontColor(color){
    gCurrLine.color = color
}

function setPrevLine(){
    gMeme.currLine = (gMeme.currLine === 0) ? gMeme.lines.length-1 : --gMeme.currLine
    setGCurrLine()
}

function setNextLine(){
    gMeme.currLine = (gMeme.currLine === gMeme.lines.length-1) ? 0 : ++gMeme.currLine
    setGCurrLine()
}

function _setLastLine(){
    gMeme.currLine = gMeme.lines.length-1
    setGCurrLine()
}

function getCurrLine(){
    return gCurrLine
}

function addLine(text){
    let newLine = JSON.parse(JSON.stringify(gCurrLine))
    newLine.text = text
    gMeme.lines.push(newLine)
    _setLastLine()
}

