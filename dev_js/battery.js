import { Container, Sprite, TilingSprite } from "pixi.js"
import { getAppScreen, tickerAdd, tickerRemove } from "./application"
import { sprites } from "./loader"
import { EventHub, events } from './events'

const settings = {
    positionsRate: [{x: -690, y: 944}, {x: 668, y: 312}],
    levels: [1, 0],
    maxLevel: 4,
}

class Battery extends Sprite {
    constructor( screenData, index ) {
        super( sprites.battery.textures[`battery${settings.levels[index]}.png`] )
        this.anchor.set(0.5, 1)

        this.point = {...settings.positionsRate[index]}

        this.level = settings.levels[index]

        this.screenResize( screenData )
        EventHub.on( events.screenResize, this.screenResize.bind(this) )

        this.eventMode = 'static'
        this.on('pointertap', this.getClick.bind(this) )
    }

    screenResize(screenData) {
        this.scale.set(screenData.scaleRate)
        this.position.x = screenData.centerX + this.point.x * screenData.scaleRate
        this.position.y = screenData.centerY + this.point.y * screenData.scaleRate
    }

    getClick() {
        if (this.level < settings.maxLevel) {
            this.level++
            this.texture = sprites.battery.textures[`battery${this.level}.png`]
        }
    }
}

export default Battery