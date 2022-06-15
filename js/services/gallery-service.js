'use strict'
var gSelectedImage = null

var gImages = [
{src:'1.jpg',tag:'politics blame finger funny'},
{src:'2.jpg',tag:'pup dog kiss cute couple'},
{src:'3.jpg',tag:'sleep dog baby bed cute'},
{src:'4.jpg',tag:'cat keyboard sleep'},
{src:'5.jpg',tag:'baby didit success conquer funny'},
{src:'6.jpg',tag:'funny explain notaccurate'},
    
]

// '1.jpg', '2.jpg', '3.jpg',
//     '4.jpg', '5.jpg', '6.jpg',
//     '7.jpg', '8.jpg', '9.jpg',
//     '10.jpg', '11.jpg', '12.jpg',
//     '13.jpg', '14.jpg', '15.jpg',
//     '16.jpg', '17.jpg', '18.jpg'

function getImagesSrcs() {
    return gImages
}

function setSelectedImage(img){
    gSelectedImage = img
}

function getSelectedImage(){
    return gSelectedImage
}