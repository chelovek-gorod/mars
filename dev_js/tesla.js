import { Container, Sprite, TilingSprite, Graphics } from "pixi.js"
import { getAppScreen, tickerAdd, tickerRemove } from "./application"
import { sprites } from "./loader"
import { EventHub, events } from './events'

const settings = {
    ringPositionsY: [-260],
    ballPositionsY: [-320],
    positionStep: -37,
    maxLevel: 5,
    positionRate: {x: -28, y: 520},
    tap: {x: -28, y: 260, radius: 200},
}
for (let i = 0; i < settings.maxLevel; i++) {
    settings.ringPositionsY.push( settings.ringPositionsY[i] + settings.positionStep )
    settings.ballPositionsY.push( settings.ballPositionsY[i] + settings.positionStep )
}

class Tesla extends Sprite {
    constructor( screenData ) {
        super( sprites.tesla.textures["base.png"] )
        this.anchor.set(0.5, 1)
        this.level = 0

        this.ball = new Sprite( sprites.tesla.textures["ball.png"] )
        this.ball.anchor.set(0.5)
        this.ball.position.y = settings.ballPositionsY[this.level]
        this.addChild( this.ball )

        let ring = new Sprite( sprites.tesla.textures["ring.png"] )
        ring.anchor.set(0.5)
        ring.position.y = settings.ringPositionsY[this.level]
        this.addChildAt( ring, 0 )

        this.screenResize( screenData )
        EventHub.on( events.screenResize, this.screenResize.bind(this) )

        this.eventMode = 'static'
        this.on('pointertap', this.getClick.bind(this) )
    }

    screenResize(screenData) {
        this.scale.set(screenData.scaleRate)
        this.position.x = screenData.centerX + settings.positionRate.x * screenData.scaleRate
        this.position.y = screenData.centerY + settings.positionRate.y * screenData.scaleRate
    }

    getClick() {
        if (this.level < settings.maxLevel) {
            this.level++

            let ring = new Sprite( sprites.tesla.textures["ring.png"] )
            ring.anchor.set(0.5)
            ring.position.y = settings.ringPositionsY[this.level]
            this.addChild( ring )

            this.removeChild(this.ball)
            this.ball.position.y = settings.ballPositionsY[this.level]
            this.addChild( this.ball )
        }
    }
}

export default Tesla