/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

const {
    API_URL
} = require('../env');
const ReconnectingWebSocket = require('../otfs/reconnecting-websocket');

// eslint-disable-next-line func-names
module.exports = function(I, self) {
    let socket = null;

    const websocketURL = API_URL.replace(/^http/, 'ws');

    // eslint-disable-next-line consistent-return, func-names
    const sendKeepAlive = function() {
        /* istanbul ignore next */
        if ((socket != null ? socket.readyState : undefined) === 1) {
            return socket.send('keep alive');
        }
    };

    // eslint-disable-next-line func-names
    const connect = function(project, token) {
        // this is for tests!
        const WS = self.ReconnectingWebSocket || ReconnectingWebSocket;

        // Note that the /logs endpoint on the proxy specifies that you should provide a domain, but it actually also accepts project ID
        // We use ID to make sure that if the project is renamed, this doesn't change the websocket connection that's needed.
        const url = `${websocketURL}/${project.id()}/logs?authorization=${token}`;
        self.clearLogs();

        socket = new WS(url, null, {
            timeoutInterval: 30000
        });
        // eslint-disable-next-line no-unused-vars
        socket.onopen = (evt) => self.logStatus('Connected');
        // eslint-disable-next-line no-unused-vars
        socket.onclose = (evt) => self.logStatus('Disconnected');
        socket.onmessage = ({
            data
        }) => {
            const parsedData = JSON.parse(data);

            // Disconnect without reconnecting if there's an error (e.g. the user exceeded
            // their uptime quota and the project cannot be placed).
            if (parsedData.type === 'error') {
                socket.close(3000);
                return;
            }

            self.appendLog(parsedData);
        };
        // eslint-disable-next-line no-return-assign
        return (socket.onerror = (evt) => self.logger().log('log socket error', evt));
    };
    // TODO: Maybe set up an application wide logger to log errors to

    self.extend({
        // eslint-disable-next-line consistent-return
        connectToLogs(project, token) {
            const status = self.logStatus();
            /* istanbul ignore else */
            if (status !== 'Connected' && status !== 'Connecting') {
                self.logStatus('Connecting');
                return connect(
                    project,
                    token,
                );
            }
        },
        // eslint-disable-next-line consistent-return
        disconnectFromLogs() {
            self.logStatus('Disconnecting');
            if (socket && socket.readyState !== 3) {
                return socket.close();
            }
        },

        sendLogSocketKeepAlive: sendKeepAlive,
    });

    return self;
};