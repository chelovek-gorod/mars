import { Container, Graphics, Text } from 'pixi.js'
import { textStyles } from './fonts'
import { getAppScreen, Layer } from './application'
import { EventHub, events } from './events'

// loading bar width = 288px

const points = 20
const point = {
    width: 10,
    height: 36,
    radius: 4,
    border: 2,
    offset: 4,
    color: 0x00FF00,
    borderColor: 0x007700,
}
const border = {
    size: 4,
    radius: 6,
    color:  0x007700,
}
border.width = border.size + (point.offset + point.width) * points + point.offset
border.height = border.size + point.offset * 2 + point.height
border.posX = -border.width * 0.5
border.posY = 24

point.startX = border.posX + point.offset * 1.5 
point.startY = border.posY + point.offset * 1.5
point.stepX = point.width + point.offset

const textPosY = 10

class LoadingBar extends Container {
    constructor() {
        super()
        this.border = new Graphics()
        this.border.lineStyle(border.size, border.color, 1)
        this.border.drawRoundedRect(border.posX, border.posY, border.width, border.height, border.radius)
        this.border.endFill()
        this.addChild(this.border)

        this.state = 0

        this.progress = []
        for (let i = 0; i < points; i++) {
            let progress_point = new Graphics()
            progress_point.lineStyle(point.border, point.borderColor, 1)
            progress_point.beginFill(point.color, 1)
            progress_point.drawRoundedRect(point.startX, point.startY, point.width, point.height, point.border)
            progress_point.endFill()

            point.startX += point.stepX

            this.progress.push(progress_point)
        }

        this.text = new Text('0%', textStyles.loading)
        this.text.anchor.set(0.5, 1)
        this.text.position.y = textPosY
        this.addChild(this.text)

        EventHub.on( events.screenResize, screenResize )
        this.layer = new Layer(this)
    }

    update(progress) {
        const range = Math.round(progress)
        this.text.text = range + '%'
        let state = Math.floor(range / 5)
        while (state > this.state) {
            this.addChild(this.progress.shift())
            this.state++
        }
    }
}

let loadingBar = null

function screenResize(screenData) {
    if (!loadingBar) return

    loadingBar.position.x = screenData.centerX
    loadingBar.position.y = screenData.centerY
}

export function getLoadingBar() {
    if (!loadingBar) {
        loadingBar = new LoadingBar()
        screenResize( getAppScreen() )
    }
    return loadingBar
}

export function removeLoadingBar() {
    if (!loadingBar) return

    EventHub.off( events.screenResize, screenResize )
    loadingBar.layer.removeLayer()
}