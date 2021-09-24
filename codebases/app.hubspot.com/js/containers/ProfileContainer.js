'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import I18n from 'I18n';
import { connect } from 'react-redux';
import { closeProfile, openProfile, fetchSocialItemActionsAsInteractions, openProfileById } from '../redux/actions/people';
import { requestFollow, requestUnfollow } from '../redux/actions/relationships';
import { favoriteStreamItem } from '../redux/actions/streams';
import UIModalPanel from 'UIComponents/dialog/UIModalPanel';
import UIDialogCloseButton from 'UIComponents/dialog/UIDialogCloseButton';
import UIDialogHeader from 'UIComponents/dialog/UIDialogHeader';
import UIDialogBody from 'UIComponents/dialog/UIDialogBody';
import UILoadingSpinner from 'UIComponents/loading/UILoadingSpinner';
import ContactCard from '../components/profile/ContactCard';
import Interactions from '../components/profile/Interactions';
import TwitterDetails from '../components/profile/TwitterDetails';
import FacebookDetails from '../components/profile/FacebookDetails';
import LinkedinDetails from '../components/profile/LinkedinDetails';
import { passPropsFor } from '../lib/utils';
import { ACCOUNT_TYPES } from '../lib/constants';
import { trackInteraction, trackNetwork, removeEventKeyOverride } from '../redux/actions/usage';
import { currentLocation } from '../redux/selectors';
import { getNonRetweetInteractions, getProfileDetailed, getRetweets } from '../redux/selectors/monitoring';
import { interactingAsChannel, getPublishableChannels, getCurrentTwitterChannels } from '../redux/selectors/channels';
import { feedUserProp, listProp, logicalChannelProp, logicalChannelsProp } from '../lib/propTypes';
import Retweets from '../components/profile/Retweets';
import H2 from 'UIComponents/elements/headings/H2';

var mapStateToProps = function mapStateToProps(state) {
  return {
    profile: getProfileDetailed(state),
    retweets: getRetweets(state),
    interactions: getNonRetweetInteractions(state),
    relationships: state.relationships,
    channels: getPublishableChannels(state),
    twitterChannels: getCurrentTwitterChannels(state),
    portalId: state.portal.portal_id,
    currentLocation: currentLocation(state),
    interactingAsChannel: interactingAsChannel(state)
  };
};

var mapDispatchToProps = {
  closeProfile: closeProfile,
  openProfile: openProfile,
  openProfileById: openProfileById,
  requestFollow: requestFollow,
  requestUnfollow: requestUnfollow,
  favoriteStreamItem: favoriteStreamItem,
  fetchSocialItemActionsAsInteractions: fetchSocialItemActionsAsInteractions,
  trackInteraction: trackInteraction,
  trackNetwork: trackNetwork,
  removeEventKeyOverride: removeEventKeyOverride
};

var ProfileContainer = /*#__PURE__*/function (_PureComponent) {
  _inherits(ProfileContainer, _PureComponent);

  function ProfileContainer() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, ProfileContainer);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(ProfileContainer)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.onClose = function () {
      _this.props.closeProfile();

      _this.props.removeEventKeyOverride();

      _this.props.trackNetwork(null);
    };

    _this.onOpenComplete = function () {
      _this.props.trackNetwork(_this.props.profile.network);

      _this.props.trackInteraction('open');
    };

    _this.onCloseComplete = function () {
      _this.props.trackInteraction('close');

      _this.props.removeEventKeyOverride();

      _this.props.trackNetwork(null);
    };

    return _this;
  }

  _createClass(ProfileContainer, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.props.channels) {
        this.loadProfileFromUrl();
      }
    }
  }, {
    key: "UNSAFE_componentWillUpdate",
    value: function UNSAFE_componentWillUpdate(nextProps) {
      if (nextProps.channels && !this.props.channels) {
        this.loadProfileFromUrl();
      }
    }
  }, {
    key: "loadProfileFromUrl",
    value: function loadProfileFromUrl() {
      if (this.props.currentLocation.query.profile) {
        var profile = this.props.currentLocation.query.profile.replace('Page:', '');

        var _profile$split = profile.split(':'),
            _profile$split2 = _slicedToArray(_profile$split, 2),
            network = _profile$split2[0],
            userId = _profile$split2[1];

        if (!userId || userId === 'undefined') {
          return;
        }

        this.props.openProfileById(network, userId);
      }
    }
  }, {
    key: "renderBody",
    value: function renderBody() {
      // so much info is based on the call to twitter profile looking that rendering without is not worth it
      if (this.props.profile.network === ACCOUNT_TYPES.twitter && !this.props.profile.twitterProfile) {
        return /*#__PURE__*/_jsx(UILoadingSpinner, {
          grow: true
        });
      }

      return /*#__PURE__*/_jsxs(UIDialogBody, {
        className: "body",
        children: [/*#__PURE__*/_jsx(ContactCard, Object.assign({}, passPropsFor(this.props, ContactCard))), /*#__PURE__*/_jsx(TwitterDetails, Object.assign({}, passPropsFor(this.props, TwitterDetails))), /*#__PURE__*/_jsx(FacebookDetails, Object.assign({}, passPropsFor(this.props, FacebookDetails))), /*#__PURE__*/_jsx(LinkedinDetails, Object.assign({}, passPropsFor(this.props, LinkedinDetails))), [ACCOUNT_TYPES.twitter, ACCOUNT_TYPES.facebook].includes(this.props.profile.network) && /*#__PURE__*/_jsx(Interactions, Object.assign({}, passPropsFor(this.props, Interactions))), this.props.profile.network === ACCOUNT_TYPES.twitter && /*#__PURE__*/_jsx(Retweets, Object.assign({}, passPropsFor(this.props, Retweets), {
          streamGuid: this.props.params.streamGuid
        }))]
      });
    }
  }, {
    key: "renderPanel",
    value: function renderPanel() {
      if (!this.props.profile) {
        return null;
      }

      return /*#__PURE__*/_jsxs(UIModalPanel, {
        className: "profile-panel",
        onEsc: this.onClose,
        onOpenComplete: this.onOpenComplete,
        onCloseComplete: this.onCloseComplete,
        children: [/*#__PURE__*/_jsxs(UIDialogHeader, {
          children: [/*#__PURE__*/_jsx(UIDialogCloseButton, {
            onClick: this.onClose
          }), /*#__PURE__*/_jsx(H2, {
            children: I18n.text('sui.profile.header', {
              name: this.props.profile.getName()
            })
          })]
        }), this.renderBody()]
      });
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_jsx("div", {
        className: "profile-container",
        children: this.renderPanel()
      });
    }
  }]);

  return ProfileContainer;
}(PureComponent);

ProfileContainer.propTypes = {
  profile: feedUserProp,
  interactions: listProp,
  retweets: listProp,
  channels: logicalChannelsProp,
  // todo: find a way to share a prop with twitterChannels
  twitterChannels: logicalChannelsProp,
  interactingAsChannel: logicalChannelProp,
  params: PropTypes.object,
  portalId: PropTypes.number.isRequired,
  currentLocation: PropTypes.object,
  openProfile: PropTypes.func.isRequired,
  openProfileById: PropTypes.func.isRequired,
  closeProfile: PropTypes.func.isRequired,
  favoriteStreamItem: PropTypes.func.isRequired,
  fetchSocialItemActionsAsInteractions: PropTypes.func.isRequired,
  requestFollow: PropTypes.func,
  requestUnfollow: PropTypes.func,
  trackNetwork: PropTypes.func,
  trackInteraction: PropTypes.func,
  removeEventKeyOverride: PropTypes.func
};
export default connect(mapStateToProps, mapDispatchToProps)(ProfileContainer);