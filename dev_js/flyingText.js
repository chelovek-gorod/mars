import { Text } from 'pixi.js'
import { textStyles } from './fonts'
import { getAppScreen, tickerAdd, tickerRemove, removeSprite } from './application'
import { tick } from './functions'

const moveTime = 2400
const scaleRate = 0.5 / ((moveTime / 2) / tick)
const startTime = moveTime / 4
const alphaAdd = 1 / (startTime / tick)
const alphaSub = alphaAdd * 2

class FlyingText extends Text {
    constructor(text) {
        super(text, textStyles.fly)
        this.anchor.set(0.5)
        this.scale.x = 0.5
        this.scale.y = 0.5
        this.alpha = 0

        const screenData = getAppScreen()

        this.position.x = screenData.centerX
        this.position.y = screenData.centerY
        const halfBoardSize = screenData.centerY
        this.halfPath = halfBoardSize / 2
        this.speed = halfBoardSize / (moveTime / tick)
        tickerAdd(this)
    }

    tick( delta ) {
        this.position.y -= this.speed * delta
        this.scale.x = this.scale.y = this.scale.x += scaleRate * delta
        if (this.position.y > this.halfPath) this.alpha += alphaAdd * delta
        else {
            this.alpha -= alphaSub * delta
            if (this.alpha < 0) {
                tickerRemove(this)
                removeSprite(this)
            }
        }
    }
}

export default FlyingText