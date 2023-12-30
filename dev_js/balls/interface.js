class Interface {
    constructor() {
        isActive = false
    }
}

let UI = null

export function getInterface() {
    if (UI === null) UI = new Interface()
    return UI
}