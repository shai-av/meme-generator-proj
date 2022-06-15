'use strict'
var gCanvas
var gCtx
var gCurrImg

function onMemeGenInit() {
    gCanvas = document.getElementById('my-canvas')
    gCtx = gCanvas.getContext('2d')
    gCurrImg = getSelectedImage()
    if (gCurrImg) renderImg(gCurrImg)
    addListeners()
    resizeCanvas()
    renderCanvas()
}

function resizeCanvas() {
    // let elCanvasContainer = document.querySelector('.canvas-container')
    // gCanvas.width = elCanvasContainer.offsetWidth*0.95
    // gCanvas.height = elCanvasContainer.offsetHeight*0.95
    gCanvas.width = 500
    gCanvas.height = 500
}

function renderCanvas() {
    gCtx.fillStyle = '#fafafa'
    gCtx.fillRect(0, 0, gCanvas.width, gCanvas.height)
    gCtx.fillStyle = 'black'

}

//--- listeners ---
function addListeners() {
    // addMouseListeners()
    // addTouchListeners()
    // window.addEventListener('resize', () => {
    //     resizeCanvas()
    //     renderCanvas()
    // })
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
function renderImg(img) {
    let image = new Image()
    image.src = img.dataset.src
    image.onload = () => {
        gCtx.drawImage(image, 0, 0, gCanvas.width, gCanvas.height);
    }
    return image
}

function hideMemeGen(){
    document.querySelector('.memegen').style.display = 'none'
}
function showMemeGen(){
    document.querySelector('.memegen').style.display = 'flex'
}
//--- controller ---
// function onIncreaseTextSize(){
//     gCtx.
// }

// function onDecreaseTextSize(){

// }

// function onStrokeClrChnage(color){
//     gCtx.strokeStyle = color
// }

// function onFontClrChange(color){
//     gCtx.fillStyle = color
// }

// function createMeme(){
//     return {
//         img:getSelectedImage(),
//         lines:['test','test2'],

//     }
// }