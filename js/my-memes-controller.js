'use strict'

function onMyMemeInit() {
    setgMyMemes()
    _renderMemes()
}

function _renderMemes() {
    let memes = getMyMemes()
    let strHTML = ''
    if (!memes.length) {
        strHTML = `<h2 class="no-memes-msg">No memes to show</h2>`
    } else {
        memes.forEach((meme, idx) => strHTML += `<div class="grid-item"><span onclick=onX(${idx})>X</span><img  
                                        src="${meme.imgData}" 
                                        onclick="onMemeClk(${idx})">
                                        </div>`)
    }
    let gallery = document.querySelector('.memes-gallery')
    gallery.innerHTML = strHTML
}

function onMemeClk(memeIdx) {
    let meme = getMyMemes()[memeIdx]
    setSelectedImage(meme.image)
    set_gMeme(meme)
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

