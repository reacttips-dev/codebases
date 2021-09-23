'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import createReactClass from 'create-react-class';
import shallowCompare from 'react-addons-shallow-compare';
import { AVATAR_SIZES, AVATAR_TYPES } from './Constants';
import { getAvatarResolver } from './AvatarResolver';
import { fetchImage, isFetched } from './lib/Image';
import LookupRecord from './Records/LookupRecord';
import defaultFetchAvatars from './api/defaultFetchAvatars';
import defaultPortalId from './lib/defaultPortalId';
import { computeSizeProp } from './lib/compat';
import UIAvatarDisplay from './UIAvatarDisplay/UIAvatarDisplay';
var default_no_avatar = [/hubfs\/defaults\/contact\.png/, /hubfs\/defaults\/company\.png/, /avatar\/hash\/4bd0df0db6227e87de4031baa4422b73/, /avatar\/hash\/cc7a027acb4f854bd9b1d3a511d1740c/, /avatar\/hash\/5be48140e95ae69927946a77d6c29d1a/, /avatars\.s3\.amazonaws\/default-100/, /hubspot-avatars\.s3\.amazonaws\.com\/default-100/];
var resolver = getAvatarResolver();
var DEFAULT_LOOKUP_RECORD = new LookupRecord();
export default createReactClass({
  displayName: "UIAvatarRequest",
  getDefaultProps: function getDefaultProps() {
    return {
      size: 'sm',
      portalId: defaultPortalId(),
      fetchAvatars: defaultFetchAvatars,
      isAuthed: true
    };
  },
  getInitialState: function getInitialState() {
    return {
      lookupRecord: DEFAULT_LOOKUP_RECORD,
      avatarURI: undefined,
      error: undefined,
      loaded: false
    };
  },
  UNSAFE_componentWillMount: function UNSAFE_componentWillMount() {
    this.updateAvatarUrl(this.props);
  },
  componentDidMount: function componentDidMount() {
    this._isMounted = true;
    this.startWatching();
    this.updateAvatarUrl(this.props);
  },
  shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  },
  componentDidUpdate: function componentDidUpdate() {
    this.updateAvatarUrl(this.props);
  },
  componentWillUnmount: function componentWillUnmount() {
    this._isMounted = false;
    this.stopWatching();
  },
  handleResolverUpdate: function handleResolverUpdate() {
    this.updateAvatarUrl(this.props);
  },
  startWatching: function startWatching() {
    resolver.watch(this.handleResolverUpdate);
  },
  stopWatching: function stopWatching() {
    resolver.unwatch(this.handleResolverUpdate);
  },
  updateAvatarUrl: function updateAvatarUrl(props) {
    var _this = this;

    var size = computeSizeProp(props.size);
    var lookupValues = Object.assign({}, this.makeLookupValues());

    if (!lookupValues.primaryIdentifier || lookupValues.primaryIdentifier.length < 1 || 'deal' === lookupValues.type.toLowerCase() || 'ticket' === lookupValues.type.toLowerCase()) {
      this.setState({
        loaded: true
      });
      return undefined;
    }

    var lookupRecordFromProps = new LookupRecord(Object.assign({}, lookupValues, {
      existsInPortal: props.existsInPortal,
      portalId: props.portalId,
      dimensions: AVATAR_SIZES[size] !== AVATAR_SIZES.responsive ? AVATAR_SIZES[size] : AVATAR_SIZES.xl
    }));
    var lookupRecord = this.state.lookupRecord.equals(lookupRecordFromProps) ? this.state.lookupRecord : lookupRecordFromProps;
    var avatarURI = resolver.getAvatarURI(lookupRecord, props.fetchAvatars, props.portalId);
    var fetched = isFetched(avatarURI);
    var isDefault = typeof avatarURI !== 'string';
    var loaded = isDefault || fetched;

    if (this.state.avatarURI === avatarURI) {
      return null;
    }

    this.setState({
      avatarURI: avatarURI,
      lookupRecord: lookupRecord,
      error: undefined,
      loaded: loaded
    });

    if (loaded) {
      return null;
    } // Forces the browser to load the image into the cache to avoid UI-jitters
    // as the image loads in.


    fetchImage(avatarURI).then(function () {
      if (_this._isMounted && _this.state.avatarURI === avatarURI) {
        _this.setState({
          loaded: true
        });
      }
    }).catch(function (error) {
      if (_this._isMounted && _this.state.avatarURI === avatarURI) {
        _this.setState({
          error: error
        });
      }
    }).done();
    return null;
  },
  getSrc: function getSrc() {
    var _this$state = this.state,
        avatarURI = _this$state.avatarURI,
        error = _this$state.error,
        loaded = _this$state.loaded;
    var src = this.props.src;

    if (src) {
      return src;
    }

    if (avatarURI) {
      if (avatarURI && loaded && !error && default_no_avatar.filter(function (regex) {
        return regex.test(avatarURI);
      }).length > 0) {
        return undefined;
      } else if (avatarURI && loaded && !error) {
        return avatarURI;
      }
    }

    return undefined;
  },
  makeLookupValues: function makeLookupValues() {
    var _this$props = this.props,
        _isHasMore = _this$props._isHasMore,
        companyId = _this$props.companyId,
        domain = _this$props.domain,
        email = _this$props.email,
        fileManagerKey = _this$props.fileManagerKey,
        hubSpotUserEmail = _this$props.hubSpotUserEmail,
        productId = _this$props.productId,
        type = _this$props.type,
        vid = _this$props.vid,
        primaryIdentifier = _this$props.primaryIdentifier,
        secondaryIdentifier = _this$props.secondaryIdentifier;
    var selfie = [{
      companyId: companyId
    }, {
      domain: domain
    }, {
      email: email
    }, {
      hubSpotUserEmail: hubSpotUserEmail
    }, {
      productId: productId
    }, {
      vid: vid
    }].filter(function (value) {
      return value[Object.keys(value)[0]];
    })[0];

    if (_isHasMore) {
      return {
        type: '_isHasMore'
      };
    }

    if (primaryIdentifier && secondaryIdentifier && type) {
      return {
        type: type,
        primaryIdentifier: primaryIdentifier,
        secondaryIdentifier: secondaryIdentifier
      };
    }

    if (type && primaryIdentifier) {
      return {
        type: type,
        primaryIdentifier: primaryIdentifier
      };
    } // quickest BE response…probably


    if (vid && email && fileManagerKey) {
      return {
        type: 'contact',
        primaryIdentifier: vid,
        secondaryIdentifier: email,
        fileManagerKey: fileManagerKey
      };
    }

    if (vid && email) {
      return {
        type: 'vid',
        primaryIdentifier: vid,
        secondaryIdentifier: email
      };
    } // quickest BE response…probably


    if (companyId && domain && fileManagerKey) {
      return {
        type: 'company',
        primaryIdentifier: companyId,
        secondaryIdentifier: domain,
        fileManagerKey: fileManagerKey
      };
    } // If we have type


    if (type === 'enrichmentDomain') {
      return (primaryIdentifier || domain) && {
        type: type,
        primaryIdentifier: primaryIdentifier || domain
      };
    }

    if (Object.keys(AVATAR_TYPES).filter(function (t) {
      return t === type;
    }).length > 0 && selfie) {
      return {
        type: type,
        primaryIdentifier: Object.keys(selfie).map(function (e) {
          return selfie[e];
        })[0]
      };
    }

    if (selfie) {
      return {
        type: Object.keys(selfie)[0],
        primaryIdentifier: Object.keys(selfie).map(function (e) {
          return selfie[e];
        })[0]
      };
    }

    return {};
  },
  render: function render() {
    var _this$props2 = this.props,
        _isHasMore = _this$props2._isHasMore,
        _isHasTooltip = _this$props2._isHasTooltip,
        _isHoverlayOpen = _this$props2._isHoverlayOpen,
        _isListReversed = _this$props2._isListReversed,
        _toolTipOverWrite = _this$props2._toolTipOverWrite,
        _noDefaultSrc = _this$props2._noDefaultSrc,
        children = _this$props2.children,
        className = _this$props2.className,
        displayName = _this$props2.displayName,
        href = _this$props2.href,
        isHoverlay = _this$props2.isHoverlay,
        onClick = _this$props2.onClick,
        size = _this$props2.size,
        socialNetwork = _this$props2.socialNetwork,
        style = _this$props2.style,
        textSpacing = _this$props2.textSpacing,
        truncateLength = _this$props2.truncateLength,
        type = _this$props2.type,
        toolTipPlacement = _this$props2.toolTipPlacement;
    var src = this.getSrc();

    if (_noDefaultSrc && !src) {
      return children ? /*#__PURE__*/_jsx("div", {
        onClick: onClick,
        children: children
      }) : /*#__PURE__*/_jsx("noscript", {});
    }

    return /*#__PURE__*/_jsx(UIAvatarDisplay, Object.assign({}, {
      _isHasMore: _isHasMore,
      _isHasTooltip: _isHasTooltip,
      _isHoverlayOpen: _isHoverlayOpen,
      _isListReversed: _isListReversed,
      _toolTipOverWrite: _toolTipOverWrite,
      children: children,
      className: className,
      displayName: displayName,
      href: href,
      isHoverlay: isHoverlay,
      onClick: onClick,
      size: size,
      socialNetwork: socialNetwork,
      src: src,
      style: style,
      textSpacing: textSpacing,
      truncateLength: truncateLength,
      type: type || this.makeLookupValues().type,
      toolTipPlacement: toolTipPlacement
    }));
  }
});