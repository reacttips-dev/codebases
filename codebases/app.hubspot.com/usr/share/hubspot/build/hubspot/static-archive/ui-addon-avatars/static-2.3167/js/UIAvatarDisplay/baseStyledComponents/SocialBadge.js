'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { OLAF } from 'HubStyleTokens/colors';
import { SOCIAL_MAP } from '../../Constants';
import AvatarContentHolder from './AvatarContentHolder';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import SVGIcon from './SVGIcon';
var SocialBadgeWrapper = styled('div').withConfig({
  displayName: "SocialBadge__SocialBadgeWrapper",
  componentId: "l0j9jg-0"
})(["align-items:center;border-radius:50%;bottom:-1%;color:", ";display:flex;font-family:sans-serif;font-size:600%;justify-content:center;position:absolute;right:-16%;user-select:none;width:64%;"], OLAF);

var SocialBadge = function SocialBadge(props) {
  var socialNetwork = props.socialNetwork;
  return /*#__PURE__*/_jsx(SocialBadgeWrapper, {
    children: /*#__PURE__*/_jsx(AvatarContentHolder, {
      children: /*#__PURE__*/_jsx(SVGIcon, {
        wrapperProps: {
          style: {
            backgroundColor: SOCIAL_MAP[socialNetwork].color
          }
        },
        y: "70",
        icon: SOCIAL_MAP[socialNetwork].icon
      })
    })
  });
};

SocialBadge.propTypes = {
  socialNetwork: PropTypes.oneOf(Object.keys(SOCIAL_MAP))
};
export default SocialBadge;