import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import styles from './_iframe-evaluator.scss';

export default cssModule(
  createReactClass({
    displayName: 'atoms/quiz-atom/questions/_iframe-evaluator',

    propTypes: {
      nodeId: PropTypes.string.isRequired,
      externalIframeUri: PropTypes.string,
    },

    getInitialState() {
      return {
        evalTimestamp: 0,
      };
    },

    componentWillMount() {
      window.addEventListener('message', this.handleMessageFromIframe, false);
    },

    componentWillDismount() {
      window.removeEventListener('message', this.handleMessageFromIframe);
    },

    evaluate(operation, files) {
      function defer() {
        var resolve, reject;
        var promise = new Promise(function () {
          resolve = arguments[0];
          reject = arguments[1];
        });
        return {
          resolve: resolve,
          reject: reject,
          promise: promise,
        };
      }

      this.evalDeferred = defer();
      this.iframeReadyDeferred = defer();

      this.setState({
        evalTimestamp: Date.now(),
      });

      this.iframeReadyDeferred.promise.then(() => {
        var { contentWindow } = this.refs.iframe;

        contentWindow.postMessage(
          JSON.stringify({
            operation,
            parts: _.map(files, (content, marker) => ({ marker, content })),
            messageType: 'evaluate',
          }),
          '*'
        );
      });

      return this.evalDeferred.promise;
    },

    handleMessageFromIframe(event) {
      function _ensureJson(json) {
        try {
          return JSON.parse(json);
        } catch (exception) {
          return json;
        }
      }

      var eventData = _ensureJson(event.data);

      if (eventData.messageType === 'ready') {
        this.iframeReadyDeferred && this.iframeReadyDeferred.resolve();
      } else if (eventData.messageType === 'execution') {
        var {
          result: { execution },
        } = eventData;
        this.evalDeferred && this.evalDeferred.resolve(execution);
      }
    },

    render() {
      // The evalTimestamp forces the iframe to be recreated for each new evaluation
      var { evalTimestamp } = this.state;
      var { nodeId, externalIframeUri } = this.props;

      return (
        <iframe
          key={evalTimestamp}
          styleName="iframe"
          src={
            externalIframeUri || `${CONFIG.quizzesUrl}/quizzes/iframe/${nodeId}`
          }
          ref="iframe"
          title="Coding quiz result"
          style={{ width: '100%', height: '400px' }}
        />
      );
    },
  }),
  styles
);
