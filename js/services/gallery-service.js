'use strict'
var gSelectedImage = null

var gImages = [
{src:'1.jpg',tag:["politic", "president" ,"trump", "blame", "finger", "funny"]},
{src:'2.jpg',tag:["pup", "dog", "kiss", "cute", "couple"]},
{src:'3.jpg',tag:["sleep" ,"dog" ,"baby" ,"bed" ,"cute"]},
{src:'4.jpg',tag:["cat", "keyboard", "sleep"]},
{src:'5.jpg',tag:["baby", "didit", "success" ,"conquer", "funny"]},
{src:'6.jpg',tag:["funny", "explain", "not" ,"accurate"]},
{src:'7.jpg',tag:["baby","surprise","hold","eye"]},
{src:'8.jpg',tag:["smile","funny","pleased","high","hat"]},
{src:'9.jpg',tag:["baby","evil","laugh"]},
{src:'10.jpg',tag:["obama","laugh","funny","president"]},
{src:'11.jpg',tag:["kiss","funny","fight"]},
{src:'12.jpg',tag:["point","blame","funny","fault"]},
{src:'13.jpg',tag:["actor","drink","glass","celebrate"]},
{src:'14.jpg',tag:["sunglasses","matrix"]},
{src:'15.jpg',tag:["zero","shawn","gameofthrones","funny"]},
{src:'16.jpg',tag:["startrack","laugh","funny"]},
{src:'17.jpg',tag:["putin","russia","president","finger"]},
{src:'18.jpg',tag:["toy","disney","funny"]}
]

function getImages() {
    return gImages
}

function setSelectedImage(img){
    gSelectedImage = img
}

function getSelectedImage(){
    return gSelectedImage
}