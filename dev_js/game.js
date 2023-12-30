import { getAppScreen, Layer } from './application'
import Background from './background'
import { smoothShowElement } from './functions'
import { playMusic } from './sound'
import { encode, decode } from './decoder'
import { initState } from './state'
import { EventHub, events } from './events'

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

    /*
    smoothShowElement( new Layer( new Background(screenData) ) , 'center', () => {
        // any callback action
    })
    */

    playMusic()
}