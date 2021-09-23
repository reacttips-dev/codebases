'use es6';

import { BUTTON_DISABLED_TEXT, HEFFALUMP } from 'HubStyleTokens/colors';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import UIIcon from '../icon/UIIcon';
var UITextToolbarIcon = styled(UIIcon).attrs({
  size: 14
}).withConfig({
  displayName: "UITextToolbarIcon",
  componentId: "wz3eyj-0"
})(["color:", ";"], function (_ref) {
  var disabled = _ref.disabled;
  return disabled ? BUTTON_DISABLED_TEXT : HEFFALUMP;
});
UITextToolbarIcon.propTypes = {
  disabled: PropTypes.bool,
  name: UIIcon.propTypes.name
};
export default UITextToolbarIcon;