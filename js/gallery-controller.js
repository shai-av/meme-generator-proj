'use strict'
function onGalleryInit() {
    renderImages()
}
function renderImages() {
    let images = getImages()

    let strHTML = ''
    images.forEach((img) => strHTML += `<div class="grid-item"><img 
                                        data-src=img/${img.src} 
                                        data-tag=
                                        src="img/${img.src}" 
                                        onclick="onImgClk(this)">
                                        </div>`)

    let gallery = document.querySelector('.gallery')
    gallery.innerHTML = strHTML
}

function onImgClk(img) {
    setSelectedImage(img)
    hideGallery()
    showMemeGen()
    onMemeGenInit()
}

function hideGallery(){
    document.querySelector('.gallery').style.display = 'none'
}
function showGallery(){
    document.querySelector('.gallery').style.display = 'grid'
}