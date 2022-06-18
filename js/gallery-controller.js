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
    showMemeGen()
    onMemeGenInit()
}

function showGallery(){
    document.body.className = 'gallery-open'
    resetDefaultLines()
}

function onSearchIcon(){
    const elSearchInput = document.querySelector('[name=search-img]')
    elSearchInput.focus()
}

function onFilter(val){
    setFilterBy(val.toLowerCase())
    renderImages()
}