import { Container, Sprite, TilingSprite } from "pixi.js"
import { getAppScreen, tickerAdd, tickerRemove } from "./application"
import { sprites } from "./loader"
import { EventHub, events } from './events'

const settings = {
    rocketPositions: [{x: 0, y: 0}, {x: 0, y: 0}, {x: 4, y: -276}, {x: -48, y: -320}],
    positionRate: {x: -606, y: 346},
    maxLevel: 4,
}

class Port extends Sprite {
    constructor( screenData ) {
        super( sprites.port.textures["port0.png"] )
        this.anchor.set(0.5, 1)
        this.level = 1

        let port = new Sprite(sprites.port.textures["port1.png"])
        port.anchor.set(0.5, 1)
        this.addChildAt( port, 0 )

        this.point = {...settings.positionRate}

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
            let port = new Sprite(sprites.port.textures[`port${this.level}.png`])
            port.anchor.set(0.5, 1)
            this.addChildAt( port, 0 )
        }
    }
}

export default Port