import React from 'react';
import { EmptyHeartIcon, HeartIcon } from '../../Icons';
export var LikeButton = function (props) {
    var type = props.isMini ? 'mini' : 'oval';
    var width = props.isMini ? 16 : props.width || 24;
    var height = props.isMini ? 16 : props.height || 24;
    return (React.createElement("div", { className: (props.isMini ? '' : 'like-button') + "\n                " + (props.isFilled ? 'heart-icon-filled' : ''), onClick: props.onClick }, props.isFilled ? (React.createElement(HeartIcon, { width: width, height: height, className: type + " heart-icon-filled" })) : (React.createElement(EmptyHeartIcon, { width: width, height: height, className: type + " heart-icon" }))));
};
//# sourceMappingURL=button-like.js.map