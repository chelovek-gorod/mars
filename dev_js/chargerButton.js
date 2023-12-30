import { Container, Sprite, TilingSprite } from "pixi.js"
import { getAppScreen, tickerAdd, tickerRemove } from "./application"
import { sprites } from "./loader"
import { EventHub, events } from './events'

const settings = {
    positionRateY: 906,
}

class ChargerButton extends Sprite {
    constructor( screenData ) {
        super( sprites.button.textures["button_off.png"] )
        this.anchor.set(0.5, 1)

        this.screenResize( screenData )
        EventHub.on( events.screenResize, this.screenResize.bind(this) )

        this.eventMode = 'static'
        //this.on('pointertap', this.getClick.bind(this) )
        this.on('pointerdown', this.getClickOn.bind(this))
        this.on('pointerup', this.getClickOff.bind(this))
        this.on('pointerupoutside', this.getClickOff.bind(this))
    }

    screenResize(screenData) {
        this.scale.set(screenData.scaleRate)
        this.position.x = screenData.centerX
        this.position.y = screenData.centerY + settings.positionRateY * screenData.scaleRate
    }

    getClickOn() {
        this.texture = sprites.button.textures["button_on.png"]
    }
    getClickOff() {
        this.texture = sprites.button.textures["button_off.png"]
    }
}

export default ChargerButton