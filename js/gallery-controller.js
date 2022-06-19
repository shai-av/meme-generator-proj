'use strict'
function onGalleryInit() {
    _renderImages()
}

function _renderImages() {
    let images = getImages()
    if (!images.length) {
        strHTML = `<h2 class="no-content-msg">No matching images</h2>`
    } else {
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
}

function onImgClk(img) {
    setSelectedImage(img.dataset.src)
    showMemeGen()
    onMemeGenInit()
}

function showGallery() {
    document.body.className = 'gallery-open'
    setResetDefaultLines()
}

function onSearchIcon() {
    const elSearchInput = document.querySelector('[name=search-img]')
    elSearchInput.focus()
}

function onFilter(val) {
    setFilterBy(val.toLowerCase())
    _renderImages()
}