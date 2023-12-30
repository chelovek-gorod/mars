import { Sprite } from "pixi.js"
import { sprites } from "./loader"
import { tickerAdd, tickerRemove } from "./application"

const settings = {
    minScale: 0.5,
    maxScale: 0.6,
    scaleStep: 0.005,
}

class HelpFinger extends Sprite {
    // state.getUseColor.bind(state), state.getAddColor.bind(state) 
    constructor( parentContainer ) {
        super( sprites.pointer )
        this.parentContainer = parentContainer
        this.anchor.set(0.1, 0.1)
        this.scale.x = this.scale.y = settings.maxScale
        this.isScaleUp = false
    }

    showHelp( x, y ) {
        this.position.x = x
        this.position.y = y
        this.parentContainer.addChild( this )
        tickerAdd( this )
    }

    hideHelp() {
        tickerRemove( this )
        this.parentContainer.removeChild( this )
        this.scale.x = this.scale.y = settings.maxScale
        this.isScaleUp = false
    }

    tick( delta ) {
        const scaleStep = delta * settings.scaleStep
        if (this.isScaleUp) {
            this.scale.x = this.scale.y = this.scale.x + scaleStep
            if (this.scale.x > settings.maxScale) {
                this.scale.x = this.scale.y = settings.maxScale
                this.isScaleUp = false
            }
        } else {
            this.scale.x = this.scale.y = this.scale.x - scaleStep
            if (this.scale.x < settings.minScale) {
                this.scale.x = this.scale.y = settings.minScale
                this.isScaleUp = true
            }
        }
    }
}

export default HelpFinger