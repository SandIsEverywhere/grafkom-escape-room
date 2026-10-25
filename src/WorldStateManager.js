class WorldStateManager {
    constructor(initialState = {}) {
        this.objects = initialState;
        this.listeners = new Map();
    }
}

export default WorldStateManager;
