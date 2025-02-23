/**
 * This is an extension for Xcratch.
 */

import iconURL from './entry-icon.png';
import insetIconURL from './inset-icon.svg';
import translations from './translations.json';

/**
 * Formatter to translate the messages in this extension.
 * This will be replaced which is used in the React component.
 * @param {object} messageData - data for format-message
 * @returns {string} - translated message for the current locale
 */
let formatMessage = messageData => messageData.defaultMessage;

const entry = {
    get name () {
        return formatMessage({
            id: 'xcxBrowserChannel.entry.name',
            defaultMessage: 'Browser Channel',
            description: 'name of the extension'
        });
    },
    extensionId: 'xcxBrowserChannel',
    extensionURL: 'https://yokobond.github.io/xcx-browser-channel/dist/xcxBrowserChannel.mjs',
    collaborator: 'yokobond',
    iconURL: iconURL,
    insetIconURL: insetIconURL,
    get description () {
        return formatMessage({
            defaultMessage: 'Connect projects through browser-based channels to share data and events',
            description: 'Communicate between browser screens on the same PC',
            id: 'xcxBrowserChannel.entry.description'
        });
    },
    tags: ['network', 'communication', 'web'],
    featured: true,
    disabled: false,
    bluetoothRequired: false,
    internetConnectionRequired: false,
    helpLink: 'https://yokobond.github.io/xcx-browser-channel/',
    setFormatMessage: formatter => {
        formatMessage = formatter;
    },
    translationMap: translations
};

export {entry}; // loadable-extension needs this line.
export default entry;
