'use es6';

import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { createPlugin } from 'draft-extend';
var ALLOWED_COMMANDS = ['up-arrow', 'down-arrow', 'backspace', 'backspace-word', 'backspace-to-start-of-line', 'delete', 'delete-word', 'delete-to-start-of-line'];
export default createPlugin({
  buttons: createReactClass({
    displayName: "buttons",
    propTypes: {
      addKeyCommandListener: PropTypes.func.isRequired,
      removeKeyCommandListener: PropTypes.func.isRequired,
      handleTab: PropTypes.func.isRequired
    },
    componentDidMount: function componentDidMount() {
      this.props.addKeyCommandListener(this.handleKey);
    },
    componentWillUnmount: function componentWillUnmount() {
      this.props.removeKeyCommandListener(this.handleKey);
    },
    handleKey: function handleKey(editorState, command, event) {
      if (ALLOWED_COMMANDS.indexOf(command) === -1) {
        if (event && event.preventDefault) {
          event.preventDefault();
          event.stopPropagation();
        }

        if (command === 'tab') {
          this.props.handleTab();
        }

        return true;
      }

      return null;
    },
    render: function render() {
      return null;
    }
  })
});