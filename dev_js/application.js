import { Application, Container } from 'pixi.js'
import { playMusic, stopMusic } from './sound'
import { screenResize } from './events'

const containerSize = 1920

const app = new Application({
    background: 0x000000,
    antialias: true, // сглаживание
    resolution: 2,
    resizeTo: window
})
document.body.append( app.view )

const appScreen = {}
resize()

function resize() {
    appScreen.width = app.screen.width
    appScreen.height = app.screen.height
    appScreen.centerX = app.screen.width / 2
    appScreen.centerY = app.screen.height / 2
    appScreen.minSize = app.screen.width > app.screen.height ? app.screen.height : app.screen.width
    appScreen.offsetX = (appScreen.width - appScreen.minSize) / 2
    appScreen.offsetY = (appScreen.height - appScreen.minSize) / 2
    appScreen.scaleRate = appScreen.minSize / containerSize 

    screenResize( appScreen )
}

export function getAppScreen() {
    return appScreen
}

let orientation = window.matchMedia("(orientation: portrait)");
orientation.addEventListener("change", () => setTimeout(resize, 0))
window.addEventListener('resize', () => setTimeout(resize, 0))

window.addEventListener('focus', playMusic)
window.addEventListener('blur', stopMusic)
if ('hidden' in document) document.addEventListener('visibilitychange', visibilityOnChange)
function visibilityOnChange( isHide ) {
    if (isHide) stopMusic()
    else playMusic()
}

export class Layer extends Container {
    constructor( ...elements ) {
        super()
        app.stage.addChild( this )
        if ( elements.length ) this.addChild( ...elements )
        return this
    }

    clearLayer() {
        this.children.forEach(element => element.destroy( {children : true} ))
    }

    removeLayer() {
        this.clearLayer()
        app.stage.removeChild( this )
    }
}

export function clearContainer( container ) {
    while(container.children[0]) {
        removeSprite( container.children[0] )
    }
}

export function removeSprite( sprite ) { if ('currentCeil' in sprite) console.log ( 'BALL currentCeil:', sprite.currentCeil )
    if (sprite.parent) sprite.parent.removeChild( sprite )
    sprite.destroy( {children : true} )
}

export function tickerAdd( element ) {
    if ('tick' in element) tickerArr.push( element )
    else console.warn( 'TRY TO ADD ELEMENT IN TICKER WITHOUT .tick() METHOD:', element)
}

export function tickerRemove( element ) {
    tickerArr = tickerArr.filter( e => e !== element )
}

let tickerArr = [] // entities for update (need e.tick(delta) method)
app.ticker.add( delta => {
    // if (delta = 1) -> FPS = 60 (16.66ms per frame)
    tickerArr.forEach( element => element.tick(delta) )
})