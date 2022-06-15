'use strict'
function onInit(){
    renderImages()
}
function renderImages(){
    let imageSrcs = getImagesSrcs()

    let strHTML = ''
    imageSrcs.forEach(src=> strHTML += `<div class="grid-item"><img src="img/${src}" onClick="onImgClk(this)"></div>`)

    let gallery = document.querySelector('.gallery')
    gallery.innerHTML = strHTML
}

function onImgClk(img){
    console.log(img);
}