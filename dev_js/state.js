class State {
    constructor() {
        this.score = 0
        this.record = 0

        // get data from localStorage
        // or set start sate
        this.setState()
    }

    getState() {
        return {
            score: this.score,
            record: this.record,
        }
    }

    setState() {
        // get data from localStorage
        // or set start sate

        this.updateReserveUse()
        this.updateReserveAdd()
    }

    updateReserveUse() {
        
    }

    updateReserveAdd() {
       
    }

    setScore( score ) {
        this.score += score
        if (this.score > this.record) this.record = this.score
    }

    getScore() {
        return { score: this.score, record: this.record }
    }
}

let STATE = null

export function initState() {
    if (STATE === null) STATE = new State()
    return STATE
}