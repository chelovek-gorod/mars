import { Container, Sprite, Graphics, Text } from "pixi.js"
import { sprites, sounds } from "./loader"
import { EventHub, events, activateUI } from './events'
import { clickCeil, checkLangRu, flyTextLayer } from './game'
import getBall, { ballAnimationTime, ballKeys } from "./ball"
import Lock from "./lock"
import getStars from "./star"
import { playSound } from './sound'
import { textStyles } from './fonts'
import HelpFinger from "./helpFinger"
import Bonus, { bonusAnimationTime } from "./bonus"
import Effect from "./effect"
import FlyingText from "./flyingText"

const boardSettings = {
    size: 1480,
    offsetX: 140,
    offsetY: 310,
    stepX: 150,
    stepY: 130,
    halfStepX: 75,
    halfStepY: 65,

    tapSize: 60,

    reserve: [
        {x: 234, y: 98, scale: 0.65},
        {x: 171, y: 87, scale: 0.5},
        {x: 117, y: 75, scale: 0.35},
    ],
}

const labelSettings = {
    scoreTextRu: 'ОЧКИ: ',
    scoreTextEn: 'SCORE: ',
    scoreTextCenterY: 72,

    scoreRecordTextRu: 'РЕКОРД: ',
    scoreRecordTextEn: 'RECORD: ',
    scoreRecordTextCenterY: 136,

    colorsTextRu: 'СЛЕДУЮЩИЙ\nЦВЕТ',
    colorsTextEn: 'NEXT\nCOLOR',
    keysTextRu: 'СЛЕДУЮЩИЙ\nКЛЮЧ',
    keysTextEn: 'NEXT\nKEY',
    hammersTextRu: 'СЛЕДУЮЩИЙ\nМОЛОТ',
    hammersTextEn: 'NEXT\nHAMMER',
    colorsKeysTextCenterY: 260,

    keysX: boardSettings.size - 326,
    keysY: 24,
    keysSize: 140,

    turnsTextRu: 'ходов',
    turnsTextEn: 'turns',
}

const scoreForBalls = {
//balls : score
      5 : 5,
      6 : 7,
      7 : 10,
      8 : 15,
      9 : 25,
}

const boardCeilFillKeys = {
    lock: 'lock',
    free: 'free',
    ball: 'ball',
}

export const boardCeils = {
    a1 : {position: {x: 0, y: 0}, neighboring: [null, null, 'a2', 'b2', 'b1', null], fill: 'lock', sprite: null},
    a2 : {position: {x: 0, y: 0}, neighboring: [null, null, 'a3', 'b3', 'b2', 'a1'], fill: 'lock', sprite: null},
    a3 : {position: {x: 0, y: 0}, neighboring: [null, null, 'a4', 'b4', 'b3', 'a2'], fill: 'lock', sprite: null},
    a4 : {position: {x: 0, y: 0}, neighboring: [null, null, 'a5', 'b5', 'b4', 'a3'], fill: 'lock', sprite: null},
    a5 : {position: {x: 0, y: 0}, neighboring: [null, null, null, 'b6', 'b5', 'a4'], fill: 'lock', sprite: null},

    b1 : {position: {x: 0, y: 0}, neighboring: [null, 'a1', 'b2', 'c2', 'c1', null], fill: 'lock', sprite: null},
    b2 : {position: {x: 0, y: 0}, neighboring: ['a1', 'a2', 'b3', 'c3', 'c2', 'b1'], fill: 'lock', sprite: null},
    b3 : {position: {x: 0, y: 0}, neighboring: ['a2', 'a3', 'b4', 'c4', 'c3', 'b2'], fill: 'free', sprite: null},
    b4 : {position: {x: 0, y: 0}, neighboring: ['a3', 'a4', 'b5', 'c5', 'c4', 'b3'], fill: 'free', sprite: null},
    b5 : {position: {x: 0, y: 0}, neighboring: ['a4', 'a5', 'b6', 'c6', 'c5', 'b4'], fill: 'lock', sprite: null},
    b6 : {position: {x: 0, y: 0}, neighboring: ['a5', null, null, 'c7', 'c6', 'b5'], fill: 'lock', sprite: null},

    c1 : {position: {x: 0, y: 0}, neighboring: [null, 'b1', 'c2', 'd2', 'd1', null], fill: 'lock', sprite: null},
    c2 : {position: {x: 0, y: 0}, neighboring: ['b1', 'b2', 'c3', 'd3', 'd2', 'c1'], fill: 'free', sprite: null},
    c3 : {position: {x: 0, y: 0}, neighboring: ['b2', 'b3', 'c4', 'd4', 'd3', 'c2'], fill: 'free', sprite: null},
    c4 : {position: {x: 0, y: 0}, neighboring: ['b3', 'b4', 'c5', 'd5', 'd4', 'c3'], fill: 'free', sprite: null},
    c5 : {position: {x: 0, y: 0}, neighboring: ['b4', 'b5', 'c6', 'd6', 'd5', 'c4'], fill: 'free', sprite: null},
    c6 : {position: {x: 0, y: 0}, neighboring: ['b5', 'b6', 'c7', 'd7', 'd6', 'c5'], fill: 'free', sprite: null},
    c7 : {position: {x: 0, y: 0}, neighboring: ['b6', null, null, 'd8', 'd7', 'c6'], fill: 'lock', sprite: null},

    d1 : {position: {x: 0, y: 0}, neighboring: [null, 'c1', 'd2', 'e2', 'e1', null], fill: 'lock', sprite: null},
    d2 : {position: {x: 0, y: 0}, neighboring: ['c1', 'c2', 'd3', 'e3', 'e2', 'd1'], fill: 'free', sprite: null},
    d3 : {position: {x: 0, y: 0}, neighboring: ['c2', 'c3', 'd4', 'e4', 'e3', 'd2'], fill: 'free', sprite: null},
    d4 : {position: {x: 0, y: 0}, neighboring: ['c3', 'c4', 'd5', 'e5', 'e4', 'd3'], fill: 'free', sprite: null},
    d5 : {position: {x: 0, y: 0}, neighboring: ['c4', 'c5', 'd6', 'e6', 'e5', 'd4'], fill: 'free', sprite: null},
    d6 : {position: {x: 0, y: 0}, neighboring: ['c5', 'c6', 'd7', 'e7', 'e6', 'd5'], fill: 'free', sprite: null},
    d7 : {position: {x: 0, y: 0}, neighboring: ['c6', 'c7', 'd8', 'e8', 'e7', 'd6'], fill: 'free', sprite: null},
    d8 : {position: {x: 0, y: 0}, neighboring: ['c7', null, null, 'e9', 'e8', 'd7'], fill: 'lock', sprite: null},

    e1 : {position: {x: 0, y: 0}, neighboring: [null, 'd1', 'e2', 'f2', null, null], fill: 'lock', sprite: null},
    e2 : {position: {x: 0, y: 0}, neighboring: ['d1', 'd2', 'e3', 'f3', 'f2', 'e1'], fill: 'lock', sprite: null},
    e3 : {position: {x: 0, y: 0}, neighboring: ['d2', 'd3', 'e4', 'f4', 'f3', 'e2'], fill: 'free', sprite: null},
    e4 : {position: {x: 0, y: 0}, neighboring: ['d3', 'd4', 'e5', 'f5', 'f4', 'e3'], fill: 'free', sprite: null},
    e5 : {position: {x: 0, y: 0}, neighboring: ['d4', 'd5', 'e6', 'f6', 'f5', 'e4'], fill: 'free', sprite: null},
    e6 : {position: {x: 0, y: 0}, neighboring: ['d5', 'd6', 'e7', 'f7', 'f6', 'e5'], fill: 'free', sprite: null},
    e7 : {position: {x: 0, y: 0}, neighboring: ['d6', 'd7', 'e8', 'f8', 'f7', 'e6'], fill: 'free', sprite: null},
    e8 : {position: {x: 0, y: 0}, neighboring: ['d7', 'd8', 'e9', 'f9', 'f8', 'e7'], fill: 'lock', sprite: null},
    e9 : {position: {x: 0, y: 0}, neighboring: ['d8', null, null, null, 'f9', 'e8'], fill: 'lock', sprite: null},

    f2 : {position: {x: 0, y: 0}, neighboring: ['e1', 'e2', 'f3', 'g3', null, null], fill: 'lock', sprite: null},
    f3 : {position: {x: 0, y: 0}, neighboring: ['e2', 'e3', 'f4', 'g4', 'g3', 'f2'], fill: 'free', sprite: null},
    f4 : {position: {x: 0, y: 0}, neighboring: ['e3', 'e4', 'f5', 'g5', 'g4', 'f3'], fill: 'free', sprite: null},
    f5 : {position: {x: 0, y: 0}, neighboring: ['e4', 'e5', 'f6', 'g6', 'g5', 'f4'], fill: 'free', sprite: null},
    f6 : {position: {x: 0, y: 0}, neighboring: ['e5', 'e6', 'f7', 'g7', 'g6', 'f5'], fill: 'free', sprite: null},
    f7 : {position: {x: 0, y: 0}, neighboring: ['e6', 'e7', 'f8', 'g8', 'g7', 'f6'], fill: 'free', sprite: null},
    f8 : {position: {x: 0, y: 0}, neighboring: ['e7', 'e8', 'f9', 'g9', 'g8', 'f7'], fill: 'free', sprite: null},
    f9 : {position: {x: 0, y: 0}, neighboring: ['e8', 'e9', null, null, 'g9', 'f8'], fill: 'lock', sprite: null},

    g3 : {position: {x: 0, y: 0}, neighboring: ['f2', 'f3', 'g4', 'h4', null, null], fill: 'lock', sprite: null},
    g4 : {position: {x: 0, y: 0}, neighboring: ['f3', 'f4', 'g5', 'h5', 'h4', 'g3'], fill: 'free', sprite: null},
    g5 : {position: {x: 0, y: 0}, neighboring: ['f4', 'f5', 'g6', 'h6', 'h5', 'g4'], fill: 'free', sprite: null},
    g6 : {position: {x: 0, y: 0}, neighboring: ['f5', 'f6', 'g7', 'h7', 'h6', 'g5'], fill: 'free', sprite: null},
    g7 : {position: {x: 0, y: 0}, neighboring: ['f6', 'f7', 'g8', 'h8', 'h7', 'g6'], fill: 'free', sprite: null},
    g8 : {position: {x: 0, y: 0}, neighboring: ['f7', 'f8', 'g9', 'h9', 'h8', 'g7'], fill: 'free', sprite: null},
    g9 : {position: {x: 0, y: 0}, neighboring: ['f8', 'f9', null, null, 'h9', 'g8'], fill: 'lock', sprite: null},

    h4 : {position: {x: 0, y: 0}, neighboring: ['g3', 'g4', 'h5', 'i5', null, null], fill: 'lock', sprite: null},
    h5 : {position: {x: 0, y: 0}, neighboring: ['g4', 'g5', 'h6', 'i6', 'i5', 'h4'], fill: 'lock', sprite: null},
    h6 : {position: {x: 0, y: 0}, neighboring: ['g5', 'g6', 'h7', 'i7', 'i6', 'h5'], fill: 'free', sprite: null},
    h7 : {position: {x: 0, y: 0}, neighboring: ['g6', 'g7', 'h8', 'i8', 'i7', 'h6'], fill: 'free', sprite: null},
    h8 : {position: {x: 0, y: 0}, neighboring: ['g7', 'g8', 'h9', 'i9', 'i8', 'h7'], fill: 'lock', sprite: null},
    h9 : {position: {x: 0, y: 0}, neighboring: ['g8', 'g9', null, null, 'i9', 'h8'], fill: 'lock', sprite: null},

    i5 : {position: {x: 0, y: 0}, neighboring: ['h4', 'h5', 'i6', null, null, null], fill: 'lock', sprite: null},
    i6 : {position: {x: 0, y: 0}, neighboring: ['h5', 'h6', 'i7', null, null, 'i5'], fill: 'lock', sprite: null},
    i7 : {position: {x: 0, y: 0}, neighboring: ['h6', 'h7', 'i8', null, null, 'i6'], fill: 'lock', sprite: null},
    i8 : {position: {x: 0, y: 0}, neighboring: ['h7', 'h8', 'i9', null, null, 'i7'], fill: 'lock', sprite: null},
    i9 : {position: {x: 0, y: 0}, neighboring: ['h8', 'h9', null, null, null, 'i8'], fill: 'lock', sprite: null},
}

const keys = Object.keys(boardCeils)
let lineX = boardSettings.offsetX + boardSettings.stepX * 2
let lineY = boardSettings.offsetY 
let lineCeils = [5, 6, 7, 8, 9, 8, 7, 6, 5]
let ceilIndex = 0
for (let line=0; line < lineCeils.length; line++) {
    let previousLineX = lineX
    for(let i=0; i<lineCeils[line]; i++){
        boardCeils[keys[ceilIndex]].position.x = lineX
        boardCeils[keys[ceilIndex]].position.y = lineY

        // TEST
        // boardCeils[keys[ceilIndex]].fill = boardCeilFillKeys.free
        // ----

        lineX += boardSettings.stepX
        ceilIndex++
    }
    if (line < 4) lineX = previousLineX - boardSettings.halfStepX
    else lineX = previousLineX + boardSettings.halfStepX
    lineY += boardSettings.stepY
}

export function getCeilsClone( targetBoard = board ) {
    if (targetBoard === null) return console.warn('board is not exist')
    const clone = {}
    for (let ceil in targetBoard) {
        const ceilClone = {}
        for (let data in targetBoard[ceil]) {
            const ceilData = targetBoard[ceil][data]
            if (Array.isArray(ceilData)) ceilClone[data] = [...ceilData]
            else if (typeof ceilData === 'object' && ceilData !== null) ceilClone[data] = {...ceilData}
            else ceilClone[data] = ceilData
        }
        clone[ceil] = ceilClone
    }
    return clone
} 

class Board extends Container {
    // state.getUseColor.bind(state), state.getAddColor.bind(state) 
    constructor(screenData, state) {
        super()
        this.image = new Sprite(sprites.board)
        this.image.width = boardSettings.size
        this.image.height = boardSettings.size
        this.addChild(this.image)

        this.helpFinger = new HelpFinger( this )

        this.state = getCeilsClone( boardCeils )

        this.gameState = state

        const isLangRu = checkLangRu()
        const scoreData = this.gameState.getScore()

        this.scoreText = isLangRu ? labelSettings.scoreTextRu : labelSettings.scoreTextEn
        this.score = new Text( this.scoreText + scoreData.score, textStyles.score )
        this.score.anchor.set( 0.5 )
        this.score.position.x = boardSettings.size / 2
        this.score.position.y = labelSettings.scoreTextCenterY
        this.addChild(this.score)

        this.scoreRecordText = isLangRu ? labelSettings.scoreRecordTextRu : labelSettings.scoreRecordTextEn
        this.scoreRecord = new Text( this.scoreRecordText + scoreData.record, textStyles.scoreRecord )
        this.scoreRecord.anchor.set( 0.5 )
        this.scoreRecord.position.x = boardSettings.size / 2
        this.scoreRecord.position.y = labelSettings.scoreRecordTextCenterY
        this.addChild(this.scoreRecord)

        this.colorsText = isLangRu ? labelSettings.colorsTextRu : labelSettings.colorsTextEn
        this.colorsText = new Text( this.colorsText, textStyles.scoreRecord )
        this.colorsText.anchor.set( 0.5 )
        this.colorsText.position.x = 190
        this.colorsText.position.y = labelSettings.colorsKeysTextCenterY
        this.addChild(this.colorsText)

        this.keysText = isLangRu ? labelSettings.keysTextRu : labelSettings.keysTextEn
        this.keysText = new Text( this.keysText, textStyles.scoreRecord )
        this.keysText.anchor.set( 0.5 )
        this.keysText.position.x = boardSettings.size - 190
        this.keysText.position.y = labelSettings.colorsKeysTextCenterY

        this.keys = new Sprite(sprites.keys)
        this.keys.width = this.keys.height = labelSettings.keysSize
        this.keys.position.x = labelSettings.keysX
        this.keys.position.y = labelSettings.keysY
        
        EventHub.on( events.changeBonus, () => {
            this.keys.texture = sprites.hummers
            this.keysText.text = isLangRu ? labelSettings.hammersTextRu : labelSettings.hammersTextEn
        })

        this.addChild(this.keys)
        this.addChild(this.keysText)

        this.turnsText = isLangRu ? labelSettings.turnsTextRu : labelSettings.turnsTextEn
        this.turnsText = new Text( this.turnsText, textStyles.scoreRecord )
        this.turnsText.anchor.set( 0.5 )
        this.turnsText.position.x = boardSettings.size - 160
        this.turnsText.position.y = labelSettings.scoreRecordTextCenterY
        this.addChild(this.turnsText)

        this.turns = new Text( this.gameState.turnForBonus, textStyles.score )
        this.turns.anchor.set( 0.5 )
        this.turns.position.x = boardSettings.size - 140
        this.turns.position.y = labelSettings.scoreTextCenterY
        this.addChild(this.turns)

        // fill board click points
        this.taps = []
        for (let i = 0; i < keys.length; i++) {
            const tap = new Graphics()
            const x = boardCeils[keys[i]].position.x
            const y = boardCeils[keys[i]].position.y
            tap.beginFill(0x000000, 0.0001)
            //tap.beginFill(0xff0000, 0.5)
            tap.arc(x, y, boardSettings.tapSize, 0, Math.PI * 2)
            tap.endFill()
            tap.eventMode = 'static'
            tap.on('pointertap', this.ceilClick.bind(this, keys[i]) )
            this.taps.push(tap)
            this.addChild(tap)

            // add start locks
            if (this.state[keys[i]].fill === boardCeilFillKeys.lock) {
                const lockX = this.state[ keys[i] ].position.x
                const lockY = this.state[ keys[i] ].position.y
                const lock = new Lock( lockX, lockY )
                this.state[ keys[i] ].sprite = lock
                this.addChild( lock )
            }
        }

        this.reserve = [
            this.gameState.getUseColor(),
            this.gameState.getUseColor(),
            this.gameState.getUseColor(),
        ].map( (color, index) => {
            const x = boardSettings.reserve[ index ].x
            const y = boardSettings.reserve[ index ].y
            const scale = boardSettings.reserve[ index ].scale
            
            const ball = getBall( color, x, y, scale ) 
            this.addChildAt( ball, 3 - index )
            return ball
        })
        console.log('this.reserve', this.reserve)

        this.nextBall = {ceilKey: null, color: null, stars: []}

        this.gameState.getStartColors().forEach( color => {
            let key = this.getRandomCeil()
            this.addBall( key, color, true )
        })

        this.addStarsForNextBall()
       
        this.screenResize(screenData)
        EventHub.on( events.screenResize, this.screenResize.bind(this) )

        this.clickTarget = boardCeilFillKeys.free

        this.isOnHelp = true
        const freeCeil = this.getRandomCeil()
        const helpX = this.state[freeCeil].position.x
        const helpY = this.state[freeCeil].position.y
        this.helpFinger.showHelp( helpX, helpY )
    }

    screenResize(screenData) {
        this.position.x = screenData.offsetX
        this.position.y = screenData.offsetY
        this.scale.x = this.scale.y = screenData.minSize / boardSettings.size
    }

    getTurnCallback( type ) {
        this.clickTarget = boardCeilFillKeys[type]
    }

    ceilClick(key) {
        if (this.state[key].fill !== this.clickTarget) return null
        
        if (this.isOnHelp) {
            this.isOnHelp = false
            this.helpFinger.hideHelp()
        }
        
        switch(this.clickTarget) {
            // add ball
            case boardCeilFillKeys.free : return clickCeil( key ) // function from game.js

            // unlock lock
            case boardCeilFillKeys.lock :
                this.state[key].fill = boardCeilFillKeys.free
                this.state[key].sprite.unlock()
                this.state[key].sprite = null
                this.clickTarget = boardCeilFillKeys.free
                playSound( sounds.unlock )
                this.addChild( new Effect(this.state[key].position.x, this.state[key].position.y, true) )
                return null

            // remove ball
            case boardCeilFillKeys.ball :
                this.state[key].fill = boardCeilFillKeys.free
                this.state[key].sprite.hide()
                this.state[key].sprite = null
                this.clickTarget = boardCeilFillKeys.free
                playSound( sounds.out )
                this.addChild( new Effect(this.state[key].position.x, this.state[key].position.y, false) )
                return null
            default : return clickCeil( key ) // function from game.js
        }
    }
    getClick(key) {
        const newReserveColor = this.gameState.getTurn( this.getTurnCallback.bind(this) )
        const innerColor = this.getBallFromReserve(newReserveColor)
        playSound(sounds.swipe)
        // get click back if click is available
        this.addBall( key, innerColor )
    }
    getBallFromReserve(newReserveColor) {
        const ball = this.reserve.shift()
        const color = ball.color
        ball.hide()

        this.reserve[0].move( boardSettings.reserve[0] )
        this.reserve[1].move( boardSettings.reserve[1] )
        const x = boardSettings.reserve[2].x
        const y = boardSettings.reserve[2].y
        const scale = boardSettings.reserve[2].scale
        
        const newBall = getBall( newReserveColor, x, y, scale ) 
        this.reserve.push( newBall )
        this.addChildAt( newBall, 1 )

        return color
    }

    addBall( ceil, color, isStart = false ) {
        const x = this.state[ ceil ].position.x
        const y = this.state[ ceil ].position.y
        
        const ball = getBall( color, x, y, 1 )
        this.state[ ceil ].sprite = ball
        this.addChild( ball )
        this.state[ ceil ].fill = boardCeilFillKeys.ball

        if (this.nextBall.ceilKey === ceil) this.replaceStarsForNextBall()

        if (!isStart) setTimeout( this.checkColors.bind(this, ceil ), ballAnimationTime )
    }

    addNextBall() {
        // clear existing stars
        if (this.nextBall.ceilKey && this.nextBall.stars.length) {
            this.nextBall.stars.forEach( star => star.disappear() )
            this.nextBall.stars = []
        } else {
            this.nextBall.ceilKey = this.getRandomCeil()
        }

        // this method called only if line be cleared
        // or if exist free ceil for user action
        playSound(sounds.swipe)
        const ceilKey = this.nextBall.ceilKey
        const color = this.nextBall.color
        this.addStarsForNextBall()
        this.addBall( ceilKey, color )
    }

    addStarsForNextBall() {
        this.nextBall.color = this.gameState.getAddColor()
        this.replaceStarsForNextBall()
    }

    replaceStarsForNextBall() {
        // clear existing stars
        if (this.nextBall.ceilKey && this.nextBall.stars.length) {
            this.nextBall.stars.forEach( star => star.disappear() )
            this.nextBall.stars = []
        }

        this.nextBall.ceilKey = this.getRandomCeil()

        if (this.nextBall.ceilKey) {
            const x = this.state[ this.nextBall.ceilKey ].position.x
            const y = this.state[ this.nextBall.ceilKey ].position.y
            this.nextBall.stars = getStars(this.nextBall.color , x, y)
            this.nextBall.stars.forEach( star => this.addChild( star ) )
        } /*else {
            console.log('no free ceil for next ball', this.nextBall)
        }*/
    }

    getRandomCeil( type = boardCeilFillKeys.free ) {
        const ceils = []
        for(let i = 0; i < keys.length; i++) {
            if (this.state[ keys[i] ].fill === type) ceils.push( keys[i] )
        }
        if (ceils.length === 0) return null

        const index = Math.floor( Math.random() * ceils.length )
        return ceils[index]
    }

    checkColors( key ) {
        // update key label
        this.turns.text = this.gameState.turnForBonus

        const color = this.state[key].sprite.color
        // collect colors in arrays by directions from current ceil
        const lines = []
        for(let line = 0; line < 6; line++) {
            lines.push([])
            let lineKey = key // current checked ceil
            while( this.state[lineKey].neighboring[line] !== null) {
                // update key
                lineKey = this.state[lineKey].neighboring[line]
                if (this.state[lineKey].fill !== boardCeilFillKeys.ball) break
                else lines[line].push( {key: lineKey, color: this.state[lineKey].sprite.color} )
            }
        }

        // connect lins in long lines
        const longLines = [
            [...lines[0].reverse(), {key, color}, ...lines[3]],
            [...lines[1].reverse(), {key, color}, ...lines[4]],
            [...lines[2].reverse(), {key, color}, ...lines[5]],
        ]

        const clearLines = []

        // check balls in long lines from end
        for(let lineIndex = 0; lineIndex < 3; lineIndex++) { 
            const line = longLines[lineIndex]
            const steps = line.length
            if (steps < 5) continue
            let lastColor = null
            let colorsSize = 0
            let lineChains = []
            for(let ceil = 0; ceil < steps; ceil++) {
                if (line[ceil].color === ballKeys.color
                || lastColor === line[ceil].color
                || lastColor === null) {
                    if (lineChains.length === 0) lineChains.push([])
                    if (line[ceil].color === ballKeys.color) colorsSize++
                    else {
                        colorsSize = 0
                        lastColor = line[ceil].color
                    }
                } else {
                    const colorBalls = colorsSize > 0 ? lineChains[0].slice(colorsSize * -1) : []
                    lineChains.unshift(colorBalls)
                    colorsSize = 0
                    lastColor = line[ceil].color
                }
                lineChains[0].push(line[ceil])
            }
            lineChains.forEach(line => {
                if (line.length > 4) clearLines.push(line)
            })
        }

        if (clearLines.length) {
            // sort lines from min to max lengths
            clearLines.sort( (a, b) => a.length - b.length )
            console.log([...clearLines])

            // check unique balls in line
            for(let lineIndex = 0; lineIndex < clearLines.length; lineIndex++) {
                const arrToDell = []
                clearLines[lineIndex].forEach( ball => {
                    let isExist = false
                    for(let nextLineIndex = lineIndex + 1; nextLineIndex < clearLines.length; nextLineIndex++) {
                        if (clearLines[nextLineIndex].find( otherBall => otherBall.key === ball.key)) isExist = true
                    }
                    if (!isExist) arrToDell.push(ball)
                })
                const delay = (1 + lineIndex) * ballAnimationTime * 2
                if (arrToDell.length) {
                    setTimeout( () => {
                        this.gameState.setClosed(arrToDell.length)

                        const score = scoreForBalls[ clearLines[lineIndex].length ]
                        const comboRange = lineIndex + 1
                        const scoreData = this.gameState.getScore()
                        const resultScore = score * comboRange
                        flyTextLayer.addChild( new FlyingText('+' + resultScore) )
                        this.gameState.setScore(resultScore)
                        this.score.text = this.scoreText + scoreData.score
                        this.scoreRecord.text = this.scoreRecordText + scoreData.record

                        this.clearLine( arrToDell, comboRange )

                        // if it is last line of all cleared lines
                        if (lineIndex === clearLines.length - 1) {
                            setTimeout( () => this.addNextBall(), ballAnimationTime )
                        }
                    }, delay)
                }
            }
        } else {
            let delay = 300
            let helpCeil = null

            if (this.clickTarget === boardCeilFillKeys.lock) {
                setTimeout( () => this.addChild( new Bonus(true, boardSettings.size / 2) ), delay)
                helpCeil = this.getRandomCeil( boardCeilFillKeys.lock )
            } else if (this.clickTarget === boardCeilFillKeys.ball) {
                setTimeout( () => this.addChild( new Bonus(false, boardSettings.size / 2) ), delay)
                helpCeil = this.getRandomCeil( boardCeilFillKeys.ball )
            }

            if (helpCeil) {
                this.isOnHelp = true
                const helpX = this.state[helpCeil].position.x
                const helpY = this.state[helpCeil].position.y
                this.helpFinger.showHelp( helpX, helpY )
                delay += bonusAnimationTime
            }

            if (!this.nextBall.ceilKey) this.nextBall.ceilKey = this.getRandomCeil()
            console.log(this.nextBall.ceilKey, this.isOnHelp)
            if (this.nextBall.ceilKey || this.isOnHelp) setTimeout( () => activateUI(true), delay)
            else alert( "GAME OVER" )
        }
    }

    clearLine( line, comboRange ) {

        // remove balls
        for(let i = 0; i < line.length; i++) {
            const ceil = line[i].key
            this.state[ceil].sprite.hide()
            this.state[ceil].sprite = null
            this.state[ceil].fill = boardCeilFillKeys.free
            // add stars
            const x = this.state[ceil].position.x
            const y = this.state[ceil].position.y
            getStars(line[i].color, x, y, true).forEach( star => {
                this.addChild( star )
                star.disappear()
            })
        }

        playSound(sounds['clear' + comboRange])
    }
}

let board = null

export default function getBoard(screenData, state) {
    if (!board) board = new Board( screenData, state )
    return board
}