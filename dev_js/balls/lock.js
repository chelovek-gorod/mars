import { Sprite } from "pixi.js";
import { sprites } from "./loader"
import { removeSprite, tickerAdd, tickerRemove } from "./application"
import { ballAnimationTime } from "./ball"
import { tick } from "./functions"

const settings = {
    width: 116,
    height: 126,
    anchorX: 0.55,
    anchorY: 0.49,
    alphaStep: 0.25 / (ballAnimationTime / tick) 
}

class Lock extends Sprite {
    constructor(x, y) {
        super( sprites.lock )
        this.anchor.set(settings.anchorX, settings.anchorY)
        this.width = settings.width
        this.height = settings.height
        this.position.x = x
        this.position.y = y
    }

    unlock() {
        setTimeout( () => tickerAdd(this), ballAnimationTime )
    }

    tick( delta ) {
        this.alpha -= settings.alphaStep * delta
        if (this.alpha <= 0) {
            tickerRemove( this )
            removeSprite( this )
        }
    }
}

export default Lock