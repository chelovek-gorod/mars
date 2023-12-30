import { Sprite } from 'pixi.js'
import { sprites } from "./loader"
import { tickerAdd, tickerRemove, removeSprite } from './application'

const settings = {
    stars: 5,
    size: 100,
    maxSize: 150,
    offset: 70,
    scaleRate: 60,
}
settings.delay = settings.scaleRate / settings.stars

function getStarSprite(color) {
    switch(color) {
        case 'red' : return "star_0"
        case 'yellow' : return "star_70"
        case 'green' : return "star_60"
        case 'blue' : return "star_30"
        case 'purple' : return "star_20"
        case 'brown' : return "star_80"
        case 'aqua' : return "star_40"
        case 'stone' : return "star_50"
        case 'pink' : return "star_10"
    }
}

class Star extends Sprite {
    constructor(color, x, y, delay, maxSize) {
        super( sprites.stars.textures[ getStarSprite(color) ] )
        this.delay = delay
        this.anchor.set(0.5)
        this.maxSize = maxSize
        this.pointX = x
        this.pointY = y
        this.stateScale = 0
        this.scaleRate = settings.scaleRate
        this.width = this.height = this.maxSize * this.stateScale
        this.alpha = 1
        this.changePosition()
        tickerAdd( this )
        this.isToDelete = false
    }

    changePosition() {
        const halfOffset = settings.offset / 2
        this.position.x = this.pointX - halfOffset + settings.offset * Math.random()
        this.position.y = this.pointY - halfOffset + settings.offset * Math.random()
    }

    tick( delta ) {
        if (this.delay > 0) return this.delay -= delta
        
        this.stateScale += delta / this.scaleRate
        if (this.stateScale > 0.5) this.alpha = 2 - this.stateScale*2 /* 0.5 ... 1 */
        if (this.stateScale > 1) {
            if (this.isToDelete) {
                tickerRemove(this)
                return removeSprite(this)
            } else {
                this.stateScale = 0
                this.alpha = 1
                this.changePosition()
            }
        }
        this.width = this.height = this.maxSize * this.stateScale
    }

    disappear() {
        this.isToDelete = true
    }
}

export default function getStars(color, x, y, isMaxSize = false) {
    const stars = []
    let colors = []
    if (color === 'color' ) colors = ['red', 'yellow', 'green', 'blue', 'purple', 'brown', 'aqua', 'stone', 'pink'].sort(()=> Math.random - 0.5)
    else for (let i = 0; i < settings.stars; i++) colors.push(color)
    for (let i = 0; i < settings.stars; i++) {
        const size = isMaxSize ? settings.maxSize : settings.size
        stars.push( new Star(colors[i], x, y, settings.delay * i, size ) )
    }
    return stars
}