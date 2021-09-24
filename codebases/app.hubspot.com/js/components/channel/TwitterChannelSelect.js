'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import I18n from 'I18n';
import UISelect from 'UIComponents/input/UISelect';
import { logicalChannelsProp } from '../../lib/propTypes';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import UITooltipContent from 'UIComponents/tooltip/UITooltipContent';
import FormattedJSXMessage from 'I18n/components/FormattedJSXMessage';
import UILink from 'UIComponents/link/UILink';
import { getAppRoot } from '../../lib/constants';
import { OrderedMap } from 'immutable';

var TwitterChannelSelect = function TwitterChannelSelect(props) {
  var _onChange = props.onChange,
      twitterChannels = props.twitterChannels,
      buttonUse = props.buttonUse,
      placement = props.placement,
      value = props.value,
      portalId = props.portalId,
      currentTwitterChannelCount = props.currentTwitterChannelCount,
      trackInteraction = props.trackInteraction;

  var renderTooltipContent = function renderTooltipContent() {
    var channelsDifference = currentTwitterChannelCount - twitterChannels.size;
    var message = "sui.monitoring.publishAnywhereWarning." + (channelsDifference > 1 ? 'other' : 'one') + ".detail_jsx";
    return /*#__PURE__*/_jsx(UITooltipContent, {
      children: /*#__PURE__*/_jsx(FormattedJSXMessage, {
        message: message,
        elements: {
          UILink: UILink
        },
        options: {
          onClick: function onClick(e) {
            e.stopPropagation();
            trackInteraction('click publishanywhere warning');
          },
          channelsDifference: currentTwitterChannelCount - twitterChannels.size,
          settingsUrl: "/" + getAppRoot() + "/" + portalId + "/settings"
        }
      })
    });
  };

  var renderTwitterPublishAnywhereMessage = function renderTwitterPublishAnywhereMessage() {
    if (!currentTwitterChannelCount || currentTwitterChannelCount === twitterChannels.size) {
      return null;
    }

    return /*#__PURE__*/_jsx(UITooltip, {
      Content: renderTooltipContent,
      use: "longform",
      placement: "right",
      children: /*#__PURE__*/_jsx("small", {
        children: I18n.text("sui.monitoring.publishAnywhereWarning.overview." + (twitterChannels.size === 0 ? 'noChannels' : 'someChannels'))
      })
    });
  };

  var options = twitterChannels.map(function (c) {
    return {
      value: c.channelKey,
      text: c.name + " " + c.username,
      // dropdownText is rendered, text is used for searching
      dropdownText: /*#__PURE__*/_jsxs("span", {
        children: [c.name, " ", /*#__PURE__*/_jsxs("span", {
          className: "username",
          children: ["@", c.username]
        })]
      }),
      imageUrl: c.avatarUrl
    };
  }).toArray();

  if (!twitterChannels) {
    return null;
  }

  return /*#__PURE__*/_jsxs("span", {
    className: "twitter-channel-select-wrapper",
    children: [/*#__PURE__*/_jsx(UISelect, {
      buttonUse: buttonUse,
      className: "twitter-channel-select",
      dropdownClassName: "interacting-as-dropdown",
      placement: placement,
      options: options,
      value: value,
      valueRenderer: function valueRenderer() {
        return value && twitterChannels.get(value) && "@" + twitterChannels.get(value).username;
      },
      onChange: function onChange(e) {
        return _onChange(twitterChannels.get(e.target.value));
      }
    }), renderTwitterPublishAnywhereMessage()]
  });
};

TwitterChannelSelect.propTypes = {
  buttonUse: UISelect.propTypes.buttonUse,
  twitterChannels: logicalChannelsProp,
  onChange: PropTypes.func.isRequired,
  placement: PropTypes.string,
  value: PropTypes.string,
  currentTwitterChannelCount: PropTypes.number,
  portalId: PropTypes.number,
  trackInteraction: PropTypes.func
};
TwitterChannelSelect.defaultProps = {
  buttonUse: 'link',
  hasPublishAnywhereChannels: false,
  twitterChannels: OrderedMap()
};
export default TwitterChannelSelect;