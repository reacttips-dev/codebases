import React from 'react';
import PropTypes from 'prop-types';
import { default as ReactConfetti } from 'react-confetti';
import { makeStyles } from '@material-ui/core';
var confettiColors = [
    '#00FF84',
    '#00FF84',
    '#00FF84',
    '#002333',
    '#FF4A4A',
    '#00B7FF',
    '#3722D3',
    '#FFE03D',
    '#DCDEE1',
];
function drawShape(context) {
    context.beginPath();
    context.arc(0, 0, this.radius, 0, 2 * Math.PI);
    context.fill();
}
var useStyles = makeStyles(function (_a) {
    var palette = _a.palette;
    return {
        canvas: function (props) {
            return {
                backgroundColor: props.backgroundColor || palette.common.black,
                width: props.width || '100%',
                height: props.height || '100%',
            };
        },
    };
});
export var Confetti = function (props) {
    var recycle = props.recycle, backgroundColor = props.backgroundColor, width = props.width, height = props.height;
    var classes = useStyles({ backgroundColor: backgroundColor, width: width, height: height });
    return (React.createElement(ReactConfetti, { className: classes.canvas, numberOfPieces: 300, initialVelocityX: 4.5, initialVelocityY: 9, gravity: 0.1, colors: confettiColors, drawShape: drawShape, recycle: recycle }));
};
Confetti.propTypes = {
    backgroundColor: PropTypes.string,
    recycle: PropTypes.bool,
    width: PropTypes.string,
    height: PropTypes.string,
};
//# sourceMappingURL=Confetti.js.map