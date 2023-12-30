import { utils } from "pixi.js";

export const EventHub = new utils.EventEmitter()

export const events = {
    screenResize: 'screenResize',
    activateUI: 'activateUI',
    changeBonus: 'changeBonus',
}

export function screenResize( data ) {
    EventHub.emit( events.screenResize, data )
}

export function activateUI( data ) {
    EventHub.emit( events.activateUI, data )
}

export function changeBonus() {
    EventHub.emit( events.changeBonus )
}

/*
USAGE

Init:
anyFunction( data )

Subscribe:
EventHub.on( events.eventKey, ( event ) => {
    // event actions 
})

*/

