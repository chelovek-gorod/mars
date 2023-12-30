import { Assets } from 'pixi.js'
import { getLoadingBar, removeLoadingBar } from './loadingBar'

const paths = {
    sprites : './src/images/',
    sounds : './src/sounds/',
    music : './src/music/',
    fonts : './src/fonts/',
}

export const sprites = {
    backThings: 'back_things.json',
    battery: 'battery.json',
    button: 'click_button.json',
    factory: 'factory.json',
    fireball: 'fireball.json',
    ground: 'ground_1920x1203px.png',
    ingot: 'ingot_118x88px.png',
    marsGame: 'mars_game_456x137px.png',
    miner: 'miner.json',
    money: 'money_109x99px.png',
    pointer: 'pointer_220x220px.png',
    port: 'port.json',
    smoke: 'smoke_192x192px_25frames.json',
    social: 'social_icons_150x150px.json',
    soil: 'soil_113x91px.png',
    space: 'space_bg_tile_800x800px.jpg',
    tesla: 'tesla_tower.json',
}
const spritesNumber = Object.keys(sprites).length
for (let sprite in sprites) sprites[sprite] = paths.sprites + sprites[sprite]

export const sounds = {
    button: 'se_button_click.mp3',
    electricity: 'se_electricity.mp3',
    out: 'se_out.mp3',
    slash: 'se_slash.mp3',
    sticks: 'se_sticks.mp3',
    swipe: 'se_swipe.mp3',
    whips: 'se_whips.mp3',
}
const soundsNumber = Object.keys(sounds).length
for (let se in sounds) sounds[se] = paths.sounds + sounds[se]

export const music = {
    bgm0: 'bgm_0.mp3',
    bgm1: 'bgm_1.mp3',
    bgm2: 'bgm_2.mp3',
    bgm3: 'bgm_3.mp3',
    bgmStart: 'bgm_start.mp3',
}
for (let bgm in music) music[bgm] = paths.music + music[bgm]

export const fonts = {
    digital: 'Digital.ttf',
    bold: 'Jura-Bold.ttf',
    light: 'Jura-Light.ttf',
    medium: 'Jura-Medium.ttf',
    regular: 'Jura-Regular.ttf',
    semiBold: 'Jura-SemiBold.ttf',
}
for (let font in fonts) fonts[font] = paths.fonts + fonts[font]

///////////////////////////////////////////////////////////////////

export function uploadAssets( loadingDoneCallback ) {
    const assetsNumber = spritesNumber + soundsNumber
    let loadedAssets = 0
    let progressPerAsset = 100 / assetsNumber

    const loadingBar = getLoadingBar()

    const loading = () => {
        loadedAssets++
        loadingBar.update(progressPerAsset * loadedAssets)
        if (loadedAssets === assetsNumber) {
            removeLoadingBar()
            loadingDoneCallback()
        }
    }

    for (let sprite in sprites) {
        Assets.add( {alias: sprite, src: sprites[sprite]} )
        Assets.load( sprite ).then(data => {
            sprites[sprite] = data
            loading()
        })
    }

    for (let se in sounds) {
        Assets.add( {alias: se, src: sounds[se]} )
        Assets.load( se ).then(data => {
            sounds[se] = data
            loading()
        })
    }
}