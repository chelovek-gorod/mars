import { AnimatedSprite } from "pixi.js"
import { sprites } from "./loader"
import { removeSprite } from "./application"

class Effect extends AnimatedSprite {
    constructor(x, y, isKey) {
        super( isKey ? sprites.splash.animations.splash : sprites.smoke.animations.smoke )
        this.loop = false
        this.animationSpeed = 0.5
        this.updateAnchor = false
        this.anchor.set(0.5)
        this.position.x = x
        this.position.y = y
        this.play()
        this.onComplete = () => this.remove()
    }

    remove() {
        this.stop()
        removeSprite(this)
    }
}

export default Effect