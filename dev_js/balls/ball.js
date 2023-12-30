import { AnimatedSprite, Sprite } from "pixi.js"
import { sprites } from "./loader"
import { removeSprite, tickerAdd, tickerRemove } from "./application"
import { tick } from "./functions"

export const ballAnimationTime = 300
const settings = {
    size: 142,
    animationTime: ballAnimationTime,
    animationSteps: ballAnimationTime / tick
}

export const ballKeys = {
    red : 'red',
    yellow : 'yellow',
    green: 'green',
    blue : 'blue',
    purple : 'purple',
    brown : 'brown',
    aqua : 'aqua',
    stone : 'stone',
    pink : 'pink',
    color : 'color'
}

const mixinBall = {
    move( data, callback = null ) {
        this.scaleMax = data.scale
        this.scaleStepRate = (this.scaleMax - this.scaleRate) / settings.animationSteps
        let dx = (data.x - this.position.x) / settings.animationSteps
        let dy = (data.y - this.position.y) / settings.animationSteps
        this.target = {x: data.x, y: data.y, dx, dy}
        this.isInner = true
        this.callback = callback
        tickerAdd(this)
    },

    hide( callback = null ) {
        this.callback = callback
        this.isInner = false
        tickerAdd(this)
    },

    tick(delta) {
        if (this.isInner) {
            this.scaleRate += delta * this.scaleStepRate
            if (this.target) {
                this.position.x += delta * this.target.dx
                this.position.y += delta * this.target.dy
            }
            if (this.scaleRate >= this.scaleMax) {
                this.scaleRate = this.scaleMax
                if (this.target) {
                    this.position.x = this.target.x
                    this.position.y = this.target.y
                    this.target = null
                }
                tickerRemove(this)
                if (this.callback) this.callback()
            }
            this.width = this.height = settings.size * this.scaleRate
        } else {
            this.alpha -= delta * this.alphaRate
            if (this.alpha <= 0) {
                tickerRemove( this )
                if (this.callback) this.callback()
                setTimeout( () => removeSprite(this), 0 )
            }
        }
    }
}

class ColorBall extends AnimatedSprite {
    constructor(x, y, scaleMax, callback) {
        super(sprites.balls.animations.color)
        this.color = ballKeys.color
        this.target = null
        this.callback = callback
        this.isInner = true
        this.loop = true
        this.animationSpeed = 0.3
        this.updateAnchor = true
        this.position.x = x
        this.position.y = y
        this.scaleRate = 0
        this.scaleMax = scaleMax
        this.scaleStepRate = (this.scaleMax - this.scaleRate) / settings.animationSteps
        this.alphaRate = 1 / settings.animationSteps
        this.play()
        tickerAdd(this)
    }
}
Object.assign(ColorBall.prototype, mixinBall)

class Ball extends Sprite {
    constructor(spriteName, color, x, y, scaleMax, callback) {
        super(sprites.balls.textures[spriteName])
        this.color = color
        this.target = null
        this.callback = callback
        this.isInner = true
        this.anchor.set(0.5)
        this.position.x = x
        this.position.y = y
        this.scaleRate = 0
        this.scaleMax = scaleMax
        this.scaleStepRate = (this.scaleMax - this.scaleRate) / settings.animationSteps
        this.alphaRate = 1 / settings.animationSteps
        tickerAdd(this)
    }
}
Object.assign(Ball.prototype, mixinBall)

export default function getBall( color, x, y, scaleMax = 1, callback = null ) {
    switch(color) {
        case ballKeys.color : return new ColorBall(x, y, scaleMax, callback)
        case ballKeys.red : return new Ball("ball_0", color, x, y, scaleMax, callback)
        case ballKeys.yellow : return new Ball("ball_70", color, x, y, scaleMax, callback)
        case ballKeys.green : return new Ball("ball_60", color, x, y, scaleMax, callback)
        case ballKeys.blue : return new Ball("ball_30", color, x, y, scaleMax, callback)
        case ballKeys.purple : return new Ball("ball_20", color, x, y, scaleMax, callback)
        case ballKeys.brown : return new Ball("ball_80", color, x, y, scaleMax, callback)
        case ballKeys.aqua : return new Ball("ball_40", color, x, y, scaleMax, callback)
        case ballKeys.stone : return new Ball("ball_50", color, x, y, scaleMax, callback)
        case ballKeys.pink : return new Ball("ball_10", color, x, y, scaleMax, callback)
    }
}