import BlockType from '../../extension-support/block-type';
import ArgumentType from '../../extension-support/argument-type';
import Cast from '../../util/cast';
import log from '../../util/log';
import translations from './translations.json';
import blockIcon from './block-icon.png';

import {BrowserChannelSession} from './channel-connection';

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

const EXTENSION_ID = 'xcxDataSync';

/**
 * URL to get this extension as a module.
 * When it was loaded as a module, 'extensionURL' will be replaced a URL which is retrieved from.
 * @type {string}
 */
let extensionURL = 'https://yokobond.github.io/xcx-data-sync/dist/xcxDataSync.mjs';

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
            id: 'xcxDataSync.name',
            default: 'Data Sync',
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
     * Construct a set of blocks for Data Sync.
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
         * @type {BrowserChannelSession}
         */
        this.syncConnection = new BrowserChannelSession();
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
                    opcode: 'connect',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'xcxDataSync.connect',
                        default: 'connect to [URL]'
                    }),
                    func: 'connect',
                    arguments: {
                        URL: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: 'xcxDataSync.connect.defaultURL',
                                default: 'ws://localhost:8080'
                            })
                        }
                    }
                },
                {
                    opcode: 'server',
                    blockType: BlockType.REPORTER,
                    disableMonitor: true,
                    text: formatMessage({
                        id: 'xcxDataSync.server',
                        default: 'server'
                    }),
                    func: 'server',
                    arguments: {}
                },
                {
                    opcode: 'setChannel',
                    blockType: BlockType.COMMAND,
                    blockAllThreads: false,
                    text: formatMessage({
                        id: 'xcxDataSync.setChannel',
                        default: 'set channel to [CHANNEL]'
                    }),
                    func: 'setChannel',
                    arguments: {
                        CHANNEL: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: 'xcxDataSync.setChannel.defaultChannel',
                                default: ' '
                            })
                        }
                    }
                },
                {
                    opcode: 'channel',
                    blockType: BlockType.REPORTER,
                    disableMonitor: true,
                    text: formatMessage({
                        id: 'xcxDataSync.channel',
                        default: formatMessage({
                            id: 'xcxDataSync.channel',
                            default: 'channel'
                        })
                    }),
                    func: 'channel',
                    arguments: {}
                },
                {
                    opcode: 'valueOf',
                    blockType: BlockType.REPORTER,
                    blockAllThreads: false,
                    text: formatMessage({
                        id: 'xcxDataSync.valueOf',
                        default: 'value of [KEY]'
                    }),
                    func: 'valueOf',
                    arguments: {
                        KEY: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: 'xcxDataSync.valueOf.defaultKey',
                                default: 'key'
                            })
                        }
                    }
                },
                {
                    opcode: 'setValue',
                    blockType: BlockType.COMMAND,
                    blockAllThreads: false,
                    text: formatMessage({
                        id: 'xcxDataSync.setValue',
                        default: 'set value of [KEY] to [VALUE]',
                        description: 'set value of the key'
                    }),
                    func: 'setValue',
                    arguments: {
                        KEY: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: 'xcxDataSync.setValue.defaultKey',
                                default: 'key'
                            })
                        },
                        VALUE: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: 'xcxDataSync.setValue.defaultValue',
                                default: 'value'
                            })
                        }
                    }
                }
            ],
            menus: {
            }
        };
    }

    connect (args) {
        const serverURL = Cast.toString(args.URL);
        this.disconnect();
        try {
            return this.syncConnection.connect(serverURL)
                .then(connection => {
                    if (connection) {
                        connection.addListener(this.onMessage);
                        log.debug(`connected: ${serverURL}`);
                    } else {
                        log.error(`connect failed: ${serverURL}`);
                    }
                })
                .catch(err => {
                    log.error(err);
                });
        } catch (err) {
            log.error(err);
            return err.message;
        }
    }

    disconnect () {
        this.syncConnection.disconnect();
    }

    /**
     * Return the value of the key.
     * @param {object} args - arguments for the block.
     * @param {string} args.KEY - the key.
     * @return {string} - the value of the key.
     */
    valueOf (args) {
        const key = Cast.toString(args.KEY);
        const value = this.syncConnection.getValue(key);
        return value ? value : '';
    }

    setValue (args) {
        const key = Cast.toString(args.KEY);
        const value = Cast.toString(args.VALUE);
        log.debug(`setValue: ${key} = ${value}`);
        this.syncConnection.setValue(key, value);
    }
}

export {ExtensionBlocks as default, ExtensionBlocks as blockClass};
