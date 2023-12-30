import { Container, Sprite, TilingSprite } from "pixi.js"
import { getAppScreen, tickerAdd, tickerRemove } from "./application"
import { sprites } from "./loader"
import { EventHub, events } from './events'

const settings = {
    pipePositions: [{x: 0, y: 0}, {x: 0, y: 0}, {x: 4, y: -276}, {x: -48, y: -320}, {x: 300, y: 300}],
    positionsRate: [{x: 668, y: 944}, {x: 124, y: 186}],
    levels: [1, 0],
    maxLevel: 4,
}

class Factory extends Sprite {
    constructor( screenData, index ) {
        super( sprites.factory.textures["factory_empty.png"] )
        this.anchor.set(0.5, 1)
        this.level = settings.levels[index]
        this.base = new Sprite(sprites.factory.textures[`factory_${this.level}.png`])
        this.base.anchor.set(0.5, 1)
        this.addChild( this.base )

        this.point = {...settings.positionsRate[index]}

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
            if (this.level === 1) this.base.texture = sprites.factory.textures["factory_1.png"]
            else {
                let pipe = new Sprite( sprites.factory.textures[`factory_${this.level}.png`] )
                pipe.anchor.set(0.5, 1)
                this.addChildAt( pipe, 0 )
            }
        }
    }
}

export default Factory