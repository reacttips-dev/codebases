const Paho = require('./mqttws31.js');

let _client; // Cache current session client.

const isSessionActive = function() {
  return _client && _client.isConnected();
};
const getSessionId = function() {
  return isSessionActive() ? _client.clientId : null;
};
const getSessionClient = function() {
  return isSessionActive() ? _client : null;
};

const stub_fn = function() {};

// Parameters:
//   url:                 (required, string)
//   client_id:           (required, string)
//   topic:               (optional, string) topic to subscribe upon connection
//   onConnectionSuccess: (optional, (client))
//   onConnectionFailure: (optional, (error))
//   onConnectionLost:    (optional, (client))
//   onMessageReceived:   (optional, (client, topic, msg))
//
// Callback: (error, client)
//   error:  on connection failure
//   client: MQTT client object, e.g.
//             client.subscribe(topic);
//             client.send(topic, msg, 1);
//
const connect = function(params) {
  _client = null;
  const client = new Paho.Client(params.url, params.client_id);
  const connect_params = {
    useSSL: true,
    timeout: 15,
    mqttVersion: 4,
    onSuccess() {
      if (params.topic) {
        client.subscribe(params.topic);
      }
      _client = client;
      (params.onConnectionSuccess || stub_fn)(client);
    },
    onFailure({ errorCode, errorMessage }) {
      console.warn(new Date().toISOString(), 'MQTT CONNECTION FAILURE');
      console.warn(new Date().toISOString(), { errorCode, errorMessage });
      (params.onConnectionFailure || stub_fn)('MQTT_CONNECTION_FAILURE');
    },
  };
  client.connect(connect_params);

  client.onConnectionLost = function() {
    console.warn(new Date().toISOString(), 'MQTT CONNECTION LOST');
    _client = null;
    if (params.onConnectionLost) params.onConnectionLost(client);
  };
  client.onMessageArrived = function(msg) {
    if (params.onMessageReceived) {
      params.onMessageReceived(client, msg.destinationName, msg.payloadString);
    }
  };
};

const MessageBroker = {
  connect,
  getSessionClient,
  getSessionId,
  isSessionActive,
};
// needed until powerup-command-runner.js is modularized
window.MessageBroker = MessageBroker;
module.exports = MessageBroker;
