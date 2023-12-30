import { getAppScreen, Layer } from './application'
import Background from './background'
import { smoothShowElement } from './functions'
import { playMusic } from './sound'
import { encode, decode } from './decoder'
import { initState } from './state'
import { EventHub, events } from './events'
import ChargerButton from './chargerButton'
import Battery from './battery'
import Tesla from './tesla'
import Factory from './factory'
import Miner from './miner'
import Port from './port'

const lang = navigator.language || navigator.userLanguage
let isLangRu = !!(~lang.indexOf('ru'))
export function checkLangRu() {
    return isLangRu
}

export function startGame() {
    /*
    state = initState()
    */
    const screenData = getAppScreen()

    let bg = new Background(screenData)
    let screenLayer = new Layer( bg )

    let port = new Port(screenData)
    screenLayer.addChild(port)

    let factory1 = new Factory(screenData, 1)
    screenLayer.addChild(factory1)

    let battery1 = new Battery(screenData, 1)
    screenLayer.addChild(battery1)

    let miner0 = new Miner(screenData, 0)
    screenLayer.addChild(miner0)

    let tesla = new Tesla(screenData)
    screenLayer.addChild(tesla)

    let miner1 = new Miner(screenData, 1)
    screenLayer.addChild(miner1)

    let battery0 = new Battery(screenData, 0)
    screenLayer.addChild(battery0)

    let button = new ChargerButton(screenData)
    screenLayer.addChild(button)

    let factory0 = new Factory(screenData, 0)
    screenLayer.addChild(factory0)

    /*
    smoothShowElement( new Layer( new Background(screenData) ) , 'center', () => {
        // any callback action
    })
    */

    playMusic()
}