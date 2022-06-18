'use strict'
var gSelectedImage = null
var gFilterBy = []
var gImages = [
    { src: '1.jpg', tag: ["politic", "president", "trump", "blame", "finger", "funny"] },
    { src: '2.jpg', tag: ["pup", "dog", "kiss", "cute", "couple"] },
    { src: '3.jpg', tag: ["sleep", "dog", "baby", "bed", "cute"] },
    { src: '4.jpg', tag: ["cat", "keyboard", "sleep"] },
    { src: '5.jpg', tag: ["baby", "didit", "success", "conquer", "funny"] },
    { src: '6.jpg', tag: ["funny", "explain", "not", "accurate"] },
    { src: '7.jpg', tag: ["baby", "surprise", "hold", "eye"] },
    { src: '8.jpg', tag: ["smile", "funny", "pleased", "high", "hat"] },
    { src: '9.jpg', tag: ["baby", "evil", "laugh"] },
    { src: '10.jpg', tag: ["obama", "laugh", "funny", "president"] },
    { src: '11.jpg', tag: ["kiss", "funny", "fight"] },
    { src: '12.jpg', tag: ["point", "blame", "funny", "fault"] },
    { src: '13.jpg', tag: ["actor", "drink", "glass", "celebrate"] },
    { src: '14.jpg', tag: ["sunglasses", "matrix"] },
    { src: '15.jpg', tag: ["zero", "shawn", "gameofthrones", "funny"] },
    { src: '16.jpg', tag: ["startrack", "laugh", "funny"] },
    { src: '17.jpg', tag: ["putin", "russia", "president", "finger"] },
    { src: '18.jpg', tag: ["toy", "disney", "funny"] },
    { src: '19.jpg', tag: ["funny", "evil", "dr"] },
    { src: '20.jpg', tag: ["funny", "dog"] },
    { src: '21.jpg', tag: ["funny", "dance", "celebrate", "kid", "child"] },
    { src: '22.jpg', tag: ["trump", "president", "point", "finger", "angry"] },
    { src: '23.jpg', tag: ["shock", "funny", "blame"] },
    { src: '24.jpg', tag: ["ophra", "welcome", "laugh", "show"] },
    { src: '25.jpg', tag: ["music", "nostalgi", "movie"] },
]

function getImages() {
    let images = gImages.slice()
    if (gFilterBy.length) {
        for (var i = 0; i < gFilterBy.length; i++) {
            images = filterImages(gFilterBy[i], images)
        }
    }
    return images
}

function setSelectedImage(img) {
    gSelectedImage = img
}

function getSelectedImage() {
    return gSelectedImage
}

function setFilterBy(val) {
    gFilterBy = val.split(' ')
}

function filterImages(str, images) {
    let tempImages = images.filter(image => {
        let tag = image.tag.filter(tag => tag.includes(str))
        return tag.length > 0
    })
    return tempImages
}