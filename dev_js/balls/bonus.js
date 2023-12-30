import { Container, Sprite } from "pixi.js"
import { sprites, sounds } from "./loader"
import { tickerAdd, tickerRemove, removeSprite } from './application'
import { tick } from "./functions"
import { playSound } from './sound'

export const bonusAnimationTime = 2400
const framesInOut = (bonusAnimationTime / tick) / 4
const framesNormal = framesInOut * 2
const steps = 1 / framesInOut
const rotationSpeed = 0.01

class Bonus extends Container {
    // state.getUseColor.bind(state), state.getAddColor.bind(state) 
    constructor( isKey, point ) {
        super()
        this.position.x = this.position.y = point

        this.bg = new Sprite( isKey ? sprites.effectYellow : sprites.effectPurple )
        this.bg.anchor.set( 0.5 )
        this.bg.alpha = 0
        this.addChild(this.bg)

        this.image = new Sprite( isKey ? sprites.keys : sprites.hummers )
        this.image.anchor.set( 0.5 )
        this.image.scale.x = this.image.scale.y = 0
        this.addChild(this.image)

        this.frame = 0
        tickerAdd( this )
        playSound(sounds.bonus)
    }

    tick( delta ) {
        this.frame += delta
        this.bg.rotation += rotationSpeed * delta
        if (this.frame < framesInOut) {
            this.bg.alpha += delta * steps
            this.image.scale.x = this.image.scale.y = this.bg.alpha 
        } else if (this.frame > framesInOut + framesNormal) {
            this.bg.alpha -= delta * steps
            this.image.scale.x = this.image.scale.y = this.bg.alpha
            if (this.bg.alpha <= 0) {
                tickerRemove( this )
                removeSprite( this )
            }
        }
    }
}

export default Bonus