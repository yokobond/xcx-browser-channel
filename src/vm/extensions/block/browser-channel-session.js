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
         * messages received
         * @type {Array}
         */
        this.messages = [];

        /**
         * key and values received
         * @type {object}
         */
        this.values = {};

        /**
         * listeners for receiving messages
         * @type {Array}
         */
        this.listeners = [];

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
            this.messages.push(message);
            this.values[message.key] = message.value;
            switch (message.type) {
            case 'SET_VALUE':
                this.notifyListeners(message);
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
     * Adds a listener for receiving messages
     * @param {function} listener - The listener
     */
    addListener (listener) {
        this.listeners.push(listener);
    }

    /**
     * Removes a listener for receiving messages
     * @param {function} listener - The listener
     */
    removeListener (listener) {
        this.listeners = this.listeners.filter(l => l !== listener);
    }

    /**
     * Notifies all listeners of a message
     * @param {object} message - The message
     */
    notifyListeners (message) {
        this.listeners.forEach(listener => {
            listener(message);
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
}
