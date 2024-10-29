import BlockType from '../../extension-support/block-type';
import ArgumentType from '../../extension-support/argument-type';
import Cast from '../../util/cast';
import log from '../../util/log';
import translations from './translations.json';
import blockIcon from './block-icon.png';
import {BrowserChannelSession} from './browser-channel-session';

/**
 * Formatter which is used for translation.
 * This will be replaced which is used in the runtime.
 * @param {object} messageData - format-message object
 * @returns {string} - message for the locale
 */
let formatMessage = messageData => messageData.default;

/**
 * Setup format-message for this extension.
 */
const setupTranslations = () => {
    const localeSetup = formatMessage.setup();
    if (localeSetup && localeSetup.translations[localeSetup.locale]) {
        Object.assign(
            localeSetup.translations[localeSetup.locale],
            translations[localeSetup.locale]
        );
    }
};

const EXTENSION_ID = 'xcxBrowserChannel';

/**
 * URL to get this extension as a module.
 * When it was loaded as a module, 'extensionURL' will be replaced a URL which is retrieved from.
 * @type {string}
 */
let extensionURL = 'https://yokobond.github.io/xcx-browser-channel/dist/xcxBrowserChannel.mjs';

/**
 * Scratch 3.0 blocks for example of Xcratch.
 */
class ExtensionBlocks {
    /**
     * A translation object which is used in this class.
     * @param {FormatObject} formatter - translation object
     */
    static set formatMessage (formatter) {
        formatMessage = formatter;
        if (formatMessage) setupTranslations();
    }

    /**
     * @return {string} - the name of this extension.
     */
    static get EXTENSION_NAME () {
        return formatMessage({
            id: 'xcxBrowserChannel.name',
            default: 'Browser Channel',
            description: 'name of the extension'
        });
    }

    /**
     * @return {string} - the ID of this extension.
     */
    static get EXTENSION_ID () {
        return EXTENSION_ID;
    }

    /**
     * URL to get this extension.
     * @type {string}
     */
    static get extensionURL () {
        return extensionURL;
    }

    /**
     * Set URL to get this extension.
     * The extensionURL will be changed to the URL of the loading server.
     * @param {string} url - URL
     */
    static set extensionURL (url) {
        extensionURL = url;
    }

    /**
     * Construct a set of blocks for Browser Channel.
     * @param {Runtime} runtime - the Scratch 3.0 runtime.
     */
    constructor (runtime) {
        /**
         * The Scratch 3.0 runtime.
         * @type {Runtime}
         */
        this.runtime = runtime;

        if (runtime.formatMessage) {
            // Replace 'formatMessage' to a formatter which is used in the runtime.
            formatMessage = runtime.formatMessage;
        }

        /**
         * The connection to the sync server
         * @type {?BrowserChannelSession}
         */
        this.channelSession = null;
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        setupTranslations();
        return {
            id: ExtensionBlocks.EXTENSION_ID,
            name: ExtensionBlocks.EXTENSION_NAME,
            extensionURL: ExtensionBlocks.extensionURL,
            blockIconURI: blockIcon,
            showStatusButton: false,
            blocks: [
                {
                    opcode: 'joinChannel',
                    blockType: BlockType.COMMAND,
                    blockAllThreads: false,
                    text: formatMessage({
                        id: 'xcxBrowserChannel.joinChannel',
                        default: 'join channel [CHANNEL]'
                    }),
                    func: 'joinChannel',
                    arguments: {
                        CHANNEL: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: 'xcxBrowserChannel.joinChannel.defaultChannel',
                                default: ' '
                            })
                        }
                    }
                },
                {
                    opcode: 'getChannelName',
                    blockType: BlockType.REPORTER,
                    disableMonitor: true,
                    text: formatMessage({
                        id: 'xcxBrowserChannel.getChannelName',
                        default: formatMessage({
                            id: 'xcxBrowserChannel.getChannelName',
                            default: 'channel name'
                        })
                    }),
                    func: 'getChannelName',
                    arguments: {}
                },
                {
                    opcode: 'leaveChannel',
                    blockType: BlockType.COMMAND,
                    blockAllThreads: false,
                    text: formatMessage({
                        id: 'xcxBrowserChannel.leaveChannel',
                        default: 'leave channel'
                    }),
                    func: 'leaveChannel',
                    arguments: {}
                },
                '---',
                {
                    opcode: 'setValue',
                    blockType: BlockType.COMMAND,
                    blockAllThreads: false,
                    text: formatMessage({
                        id: 'xcxBrowserChannel.setValue',
                        default: 'set value of [KEY] to [VALUE]',
                        description: 'set value of the key'
                    }),
                    func: 'setValue',
                    arguments: {
                        KEY: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: 'xcxBrowserChannel.setValue.defaultKey',
                                default: 'key'
                            })
                        },
                        VALUE: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: 'xcxBrowserChannel.setValue.defaultValue',
                                default: 'value'
                            })
                        }
                    }
                },
                {
                    opcode: 'valueOf',
                    blockType: BlockType.REPORTER,
                    blockAllThreads: false,
                    text: formatMessage({
                        id: 'xcxBrowserChannel.valueOf',
                        default: 'value of [KEY]'
                    }),
                    func: 'valueOf',
                    arguments: {
                        KEY: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: 'xcxBrowserChannel.valueOf.defaultKey',
                                default: 'key'
                            })
                        }
                    }
                },
                '---',
                {
                    opcode: 'sendEvent',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'xcxBrowserChannel.sendEvent',
                        default: 'send event [TYPE] with value [DATA]'
                    }),
                    arguments: {
                        TYPE: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: 'xcxBrowserChannel.sendEvent.defaultEvent',
                                default: 'event'
                            })
                        },
                        DATA: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: 'xcxBrowserChannel.sendEvent.defaultData',
                                default: 'data'
                            })
                        }
                    }
                },
                {
                    opcode: 'whenEventReceived',
                    blockType: BlockType.EVENT,
                    text: formatMessage({
                        id: 'xcxBrowserChannel.whenEventReceived',
                        default: 'when event received'
                    }),
                    isEdgeActivated: false,
                    shouldRestartExistingThreads: false
                },
                {
                    opcode: 'lastEventType',
                    blockType: BlockType.REPORTER,
                    disableMonitor: true,
                    text: formatMessage({
                        id: 'xcxBrowserChannel.lastEventType',
                        default: 'event'
                    })
                },
                {
                    opcode: 'lastEventData',
                    blockType: BlockType.REPORTER,
                    disableMonitor: true,
                    text: formatMessage({
                        id: 'xcxBrowserChannel.lastEventData',
                        default: 'data of event'
                    }),
                    arguments: {
                    }
                }
            ],
            menus: {
            }
        };
    }

    /**
     * Join the channel.
     * @param {object} args - arguments for the block.
     * @param {string} args.CHANNEL - the channel name.
     * @return {string} - the result of joining the channel.
     */
    joinChannel (args) {
        const channel = Cast.toString(args.CHANNEL).trim();
        if (this.channelSession && (this.channelSession.channelName === channel)) {
            // Already joined.
            return 'already joined';
        }
        if (this.channelSession) {
            this.leaveChannel();
        }
        this.channelSession = new BrowserChannelSession(channel);
        this.channelSession.addBroadcastEventListener(this.onEvent.bind(this));
        return `${channel} joined`;
    }

    /**
     * Leave the current channel.
     * @return {string} - the result of leaving the channel.
     */
    leaveChannel () {
        if (!this.channelSession) {
            return 'no channel joined';
        }
        const channelName = this.channelSession.channelName;
        this.channelSession.close();
        this.channelSession = null;
        return `left from ${channelName}`;
    }

    /**
     * Return the channel name.
     * @return {string} - the channel name.
     */
    getChannelName () {
        return this.channelSession ? this.channelSession.channelName : 'no channel joined';
    }

    /**
     * Return the value of the key.
     * @param {object} args - arguments for the block.
     * @param {string} args.KEY - the key.
     * @return {string} - the value of the key.
     */
    valueOf (args) {
        const key = Cast.toString(args.KEY);
        if (!this.channelSession) {
            return '';
        }
        const value = this.channelSession.getValue(key);
        return value ? value : '';
    }

    /**
     * Set the value of the key.
     * @param {object} args - arguments for the block.
     * @param {string} args.KEY - the key.
     * @param {string} args.VALUE - the value.
     * @return {string} - the result of setting the value.
     */
    setValue (args) {
        const key = Cast.toString(args.KEY);
        const value = Cast.toString(args.VALUE);
        log.debug(`setValue: ${key} = ${value}`);
        if (!this.channelSession) {
            return 'no channel joined';
        }
        this.channelSession.setValue(key, value);
        return `${key} = ${value}`;
    }

    /**
     * Handle the event.
     * @param {object} event - the event.
     */
    onEvent () {
        this.runtime.startHats('xcxBrowserChannel_whenEventReceived');
    }

    /**
     * Return the last event type.
     * @return {string} - the last event type.
     */
    lastEventType () {
        if (!this.channelSession) {
            return '';
        }
        const event = this.channelSession.lastEvent;
        return event ? event.type : '';
    }

    /**
     * Return the last event data.
     * @return {string} - the last event data.
     */
    lastEventData () {
        const event = this.channelSession ? this.channelSession.lastEvent : null;
        if (!event) {
            return '';
        }
        const data = event.data;
        return data ? data : '';
    }

    /**
     * Send the event.
     * @param {object} args - arguments for the block.
     * @param {string} args.TYPE - the event type.
     * @param {string} args.DATA - the event data.
     * @return {Promise<string>} - resolve with the result of sending the event.
     */
    sendEvent (args) {
        const type = Cast.toString(args.TYPE).trim();
        const data = Cast.toString(args.DATA);
        if (!this.channelSession) {
            return Promise.resolve('no channel joined');
        }
        this.channelSession.broadcastEvent(type, data);
        // resolve after a delay for the broadcast event to be received.
        return Promise.resolve(`sent event: ${type} data: ${data}`);
    }
}

export {ExtensionBlocks as default, ExtensionBlocks as blockClass};
