class EventHandler {
    constructor() {
        this.events = {};
    }
    subscribe(eventName, callback) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(callback);
    }

    unsubscribe(eventName, callback) {
        if (!this.events[eventName]) return;
        this.events[eventName] = this.events[eventName].filter(cb => cb != callback);
    }

    dispatch(eventName, payload) {
        if (!this.events[eventName]) return;
        this.events[eventName].forEach(cb => cb(payload));
    }

    clear() {
        this.events = {};
    }

    clearEvent(event) {
        this.events[event] = [];
    }
}

export default EventHandler;