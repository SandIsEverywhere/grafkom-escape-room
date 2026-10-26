class GameStateManager {
    constructor() {
        this.state = 'playing';
        this.listeners = new Set();
    }

    getState() {
        return this.state;
    }

    setState(newState) {
        if (this.state == newState) return;

        const previousState = this.state;
        this.state = newState;

        for (const listener of this.listeners) {
            listener(this.state, previousState);
        }
    }

    onChange(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }
}

export default GameStateManager;
