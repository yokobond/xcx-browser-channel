export class BrowserChannelSession {

    /**
     * @param {string} channelName - The channel name to join
     * @constructor
     */
    constructor (channelName) {
        /**
         * channel name
         * @type {string}
         */
        this.channelName = channelName;

        /**
         * a BroadcastChannel of this session
         * @type {BroadcastChannel}
         */
        this.channel = new BroadcastChannel(channelName);

        /**
         * key and values received
         * @type {object}
         */
        this.values = {};

        /**
         * listeners for broadcast events
         * @type {Array<function>}
         */
        this.broadcastEventListeners = [];

        /**
         * last event received
         * @type {object}
         */
        this.lastEvent = null;

        this.channel.addEventListener('message', event => {
            this.onMessage(event.data);
        });
        this.channel.addEventListener('messageerror', event => {
            this.onError(event.data);
        });
    }

    /**
     * Closes the channel
     */
    close () {
        if (!this.channel) {
            return;
        }
        this.channel.close();
        this.channel = null;
    }

    /**
     * Called when a message is received
     * @param {object} data - The message data
     */
    onMessage (data) {
        try {
            const message = data;
            switch (message.type) {
            case 'SET_VALUE':
                this.values[message.key] = message.value;
                break;
            case 'EVENT':
                this.lastEvent = message.data;
                this.notifyBroadcastEventListeners(this.lastEvent);
                break;
            default:
                console.error(`Unknown message type:${message.type}`);
                break;
            }
        } catch (err) {
            console.error(err);
        }
    }

    /**
     * Called when an error occurs
     * @param {MessageEvent} err - The error
     */
    onError (err) {
        console.error(err);
    }

    /**
     * Adds a listener for broadcast events
     * @param {function} listener - The listener
     */
    addBroadcastEventListener (listener) {
        this.broadcastEventListeners.push(listener);
    }

    /**
     * Removes a listener for broadcast events
     * @param {function} listener - The listener
     */
    removeBroadcastEventListener (listener) {
        this.broadcastEventListeners = this.broadcastEventListeners.filter(l => l !== listener);
    }

    /**
     * Notifies all the listeners for broadcast events
     * @param {object} event - The event
     */
    notifyBroadcastEventListeners (event) {
        this.broadcastEventListeners.forEach(listener => {
            listener(event);
        });
    }

    /**
     * Sets a value for a key
     * @param {string} key - The key
     * @param {object} value - The value
     */
    setValue (key, value) {
        const message = {
            type: 'SET_VALUE',
            key: key,
            value: value
        };
        if (!this.channel) {
            return;
        }
        this.channel.postMessage(message);
        this.onMessage(message);
    }

    /**
     * Gets a value for a key
     * @param {string} key - The key
     * @returns {?object} The value
     */
    getValue (key) {
        return this.values[key];
    }

    /**
     * Broadcast an event that will be received by all the listeners
     * @param {string} type - The event type
     * @param {object} data - The event data
     * @returns {void}
     */
    broadcastEvent (type, data) {
        const message = {
            type: 'EVENT',
            data: {
                type: type,
                data: data
            }
        };
        if (!this.channel) {
            return;
        }
        this.channel.postMessage(message);
        this.onMessage(message);
    }
}
