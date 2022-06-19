'use strict'

function onMyMemeInit() {
    setgMyMemes()
    _renderMemes()
}

function _renderMemes() {
    const memes = getMyMemes()
    let strHTML = ''

    if (!memes.length) {
        strHTML = `<h2 class="no-content-msg">No memes to show</h2>`
    } else {
        memes.forEach((meme, idx) => strHTML +=
            `<div class="grid-item">
            <span onclick=onX(${idx})>X</span><img  
            src="${meme.imgData}" 
             onclick="onMemeClk(${idx})">
            </div>`)
    }
    const gallery = document.querySelector('.memes-gallery')
    gallery.innerHTML = strHTML
}

function onMemeClk(memeIdx) {
    const meme = getMyMemes()[memeIdx]
    setSelectedImage(meme.image)
    set_gMeme(meme)
    onMovePrevLine()
    showMemeGen()
    onMemeGenInit()
}

function showMyMemes() {
    document.body.className = 'my-memes-open'
}

function onX(idx) {
    deleteMeme(idx)
    _renderMemes()
}

