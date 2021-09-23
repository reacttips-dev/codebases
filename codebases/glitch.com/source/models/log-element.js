/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

import Observable from 'o_0';
import takeRight from 'lodash/takeRight';
import uuid from 'uuid/v4';
import randomEmoji from '../utils/randomEmoji';

export const ENTRY = 'ENTRY';
export const DIVIDER = 'DIVIDER';

const MAX_LOGS = 1000;

function stripControlCharacters(message) {
    // eslint-disable-next-line no-control-regex
    return message.replace(/\x1B\[[0-9;]*[a-zA-Z]/g, '');
}

function makeEntry(process, stream, timestamp, message) {
    return {
        id: uuid(),
        type: ENTRY,
        message: stripControlCharacters(message),
        process,
        stream,
        timestamp,
        emoji: randomEmoji(2),
    };
}

function makeDivider(timestamp) {
    return {
        id: uuid(),
        type: DIVIDER,
        timestamp,
    };
}

export default function(I, self) {
    const logsData = Observable([]);

    // We insert a divider when messages are coming from different processes, or when we see
    // a message from the signal log, indicating a restart/reinstall
    let lastProcess = null;
    let needsDivider = false;

    const updateAppStatuses = ({
        process,
        message
    }) => {
        if (!['signal', 'install'].includes(process)) {
            return;
        }

        // eslint-disable-next-line default-case
        switch (false) {
            case message !== 'listening':
                self.projectContainerStatus('ok');
                self.updatePreview();

                self.readDebuggerSetting().then(() => self.debuggerReady(typeof self.debuggerEnabled === 'function' ? self.debuggerEnabled() : undefined));
                break;
            case message !== 'restart':
                self.debuggerReady(false);
                self.projectRuntimeInfo('');
                self.projectContainerStatus('building');
                break;
            case !message.match(/^saved/):
                self.updatePreview();
                break;
            case !message.match(/^error/):
                self.projectContainerStatus('error');
                break;
            case !message.match(/^app-type/):
                {
                    const oldAppType = self.projectAppType();
                    const newAppType = message.substring(message.indexOf(' ') + 1);
                    self.projectAppType(newAppType);

                    // If this is not the first app-type message we've gotten, and the app type
                    // has switched from something else to static, notify the user.
                    // Do not show this if the user has generated static sites enabled.
                    const generatedStaticSiteUIEnabled = self.isFeatureEnabled('generated_static_site_ui');
                    if (!generatedStaticSiteUIEnabled && oldAppType !== null) {
                        if (oldAppType !== newAppType) {
                            self.analytics.track('App Type Changed');
                        }
                        if (oldAppType !== 'static' && newAppType === 'static' && !self.getUserPref('hasFirstSwitchToStatic')) {
                            self.notifyFirstSwitchToStatic(true);
                            self.updateUserPrefs('hasFirstSwitchToStatic', true);
                        } else if (oldAppType === 'static' && newAppType !== 'static' && !self.getUserPref('hasFirstSwitchToNonStatic')) {
                            self.notifyFirstSwitchToNonStatic(true);
                            self.updateUserPrefs('hasFirstSwitchToNonStatic', true);
                        }
                    }
                    break;
                }
            case !message.match(/^app-info/):
                if (self.projectRuntimeInfo() === '') {
                    self.projectRuntimeInfo(message.substring(message.indexOf(' ') + 1));
                }
                break;
            case process !== 'install':
                self.projectContainerStatus('building');
                break;
        }
    };

    const appendAndCycle = (...items) => {
        const appended = logsData().concat(items);
        const cycled = takeRight(appended, MAX_LOGS);
        logsData(cycled);
    };

    self.extend({
        logsData,
        logStatus: Observable(),

        appendLog(data) {
            const entry = makeEntry(data.process, data.stream, data.timestamp, data.text);

            updateAppStatuses(entry);

            if (entry.process === 'signal') {
                needsDivider = true;
                return;
            }

            if (needsDivider || (lastProcess && lastProcess !== entry.process)) {
                appendAndCycle(makeDivider(entry.timestamp), entry);
            } else {
                appendAndCycle(entry);
            }

            needsDivider = false;
            lastProcess = entry.process;
        },

        clearLogs() {
            logsData([]);
        },
    });

    return self;
}