import { Container, Sprite, TilingSprite } from "pixi.js"
import { getAppScreen, tickerAdd, tickerRemove } from "./application"
import { sprites } from "./loader"
import { EventHub, events } from './events'

const settings = {
    minePositions: [{x: 0, y: 0}, {x: 0, y: 0}, {x: 4, y: -276}, {x: -48, y: -320}, {x: 300, y: 300}],
    positionsRate: [{x: -386, y: 642}, {x: 402, y: 536}],
    levels: [1, 0],
    maxLevel: 4,
}

class Miner extends Sprite {
    constructor( screenData, index ) {
        super( sprites.miner.textures["miner_empty.png"] )
        this.anchor.set(0.5, 1)
        this.level = settings.levels[index]
        let miner = new Sprite(sprites.miner.textures[`miner_${this.level}.png`])
        miner.anchor.set(0.5, 1)
        this.addChild(miner)

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
            if (this.level === 1) {
                this.children[0].texture = sprites.miner.textures["miner_1.png"]
            } else {
                let miner = new Sprite(sprites.miner.textures[`miner_${this.level}.png`])
                miner.anchor.set(0.5, 1)
                switch(this.level) {
                    case 2 : this.addChildAt(miner, 0); break;
                    case 3 : this.addChildAt(miner, 2); break;
                    case 4 : this.addChildAt(miner, 0); break;
                }
            }
        }
    }
}

export default Miner