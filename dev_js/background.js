import { Container, Sprite, TilingSprite } from "pixi.js"
import { getAppScreen, tickerAdd, tickerRemove } from "./application"
import { sprites } from "./loader"
import { EventHub, events } from './events'

const space = {
    speed: 0.2,
    size: 800,
}

const sun = {
    speed: 0.25,
    startY: 3200,
}

const phobos = {
    speed: 0.4,
    startY: 3200,
}

const deimos = {
    speed: 0.35,
    startY: 3200,
}

const mars = {
    offsetY: 76,
    width: 1920,
    height: 1203,
}

class Background extends Container {
    constructor( screenData ) {
        super()
        this.space = new TilingSprite( sprites.space )
        this.addChild(this.space)

        this.sun = new Sprite( sprites.backThings.textures["star_106x106px.png"] )
        this.sun.anchor.set(0.5, 1)
        this.sun.position.y = sun.startY / 3
        this.addChild(this.sun)

        this.phobos = new Sprite( sprites.backThings.textures["phobos.png"] )
        this.phobos.anchor.set(0.5, 1)
        this.phobos.position.y = phobos.startY / 2
        this.addChild(this.phobos)

        this.deimos = new Sprite( sprites.backThings.textures["deimos.png"] )
        this.deimos.anchor.set(0.5, 1)
        this.deimos.position.y = deimos.startY
        this.addChild(this.deimos)

        this.mars = new Sprite( sprites.ground )
        this.mars.anchor.set(0.5, 0)
        this.mars.scaleRate = 1
        this.addChild(this.mars)

        this.screenResize( screenData )
        EventHub.on( events.screenResize, this.screenResize.bind(this) )

        tickerAdd(this)
    }

    screenResize(screenData) {
        this.space.width = screenData.width
        this.space.height = (1 + Math.ceil(screenData.centerY / space.size)) * space.size
        this.space.position.x = 0
        this.space.position.y = 0

        this.sun.position.x = Math.floor(screenData.width / 3)
        this.phobos.position.x = Math.floor(screenData.width / 3) * 2
        this.deimos.position.x = screenData.centerX

        if (mars.height < screenData.centerY) this.mars.scaleRate = screenData.centerY / mars.height
        if (mars.width < screenData.width) this.mars.scaleRate *= screenData.width / mars.width
        this.mars.width = mars.width * this.mars.scaleRate
        this.mars.height = mars.height * this.mars.scaleRate
        this.mars.position.x = screenData.centerX
        this.mars.position.y = screenData.centerY - (mars.offsetY * this.mars.scaleRate)
    }

    tick(delta) {
        this.space.position.y -= space.speed * delta
        if (this.space.position.y < -space.size) this.space.position.y += space.size

        this.sun.position.y -= sun.speed * delta
        if (this.sun.position.y < 0) this.sun.position.y += sun.startY

        this.phobos.position.y -= phobos.speed * delta
        if (this.phobos.position.y < 0) this.phobos.position.y += phobos.startY

        this.deimos.position.y -= deimos.speed * delta
        if (this.deimos.position.y < 0) this.deimos.position.y += deimos.startY
    }
}

export default Background