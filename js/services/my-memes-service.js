'use strict'
var gMyMemes = []
var gSTORAGE_KEY = 'myMemes'

function setgMyMemes() {
    const memes = _loadMemesFromStorage()
    if (memes) gMyMemes = memes
}

function saveMeme(obj, imgData) {
    obj.imgData = imgData
    gMyMemes.push(obj)
    _saveMemesToStorage()
}

function _saveMemesToStorage() {
    const str = JSON.stringify(gMyMemes)
    localStorage.setItem(gSTORAGE_KEY, str)
}

function _loadMemesFromStorage() {
    const str = localStorage.getItem(gSTORAGE_KEY)
    return JSON.parse(str)
}

function getMyMemes() {
    return gMyMemes
}

function deleteMeme(idx) {
    gMyMemes.splice(idx, 1)
    _saveMemesToStorage()
}