'use strict'
function onGalleryInit() {
    renderImages()
}
function renderImages() {
    let images = getImages()

    let strHTML = ''
    images.forEach((img) => strHTML += `<div class="grid-item"><img 
                                        data-src=img/${img.src} 
                                        data-tag=${img.tag}
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
    document.querySelector('.gallery-container').style.display = 'none'
    document.body.classList.remove('gallery-open')
}
function showGallery(){
    document.querySelector('.gallery-container').style.display = 'grid'
    document.body.classList.add('gallery-open')
}