var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import React, { forwardRef } from 'react';
import { border } from 'polished';
import PropTypes from 'prop-types';
import { Checkbox as BaseCheckbox, FormControl, FormControlLabel, makeStyles, SvgIcon, } from '@material-ui/core';
var useStyles = makeStyles(function (_a) {
    var palette = _a.palette, shape = _a.shape;
    return ({
        root: {
            '& .control .icon': __assign(__assign({ fill: palette.background.paper, borderRadius: shape.borderRadius }, border(1, 'solid', palette.border.main)), { '&.checked': {
                    backgroundColor: palette.tertiary.main,
                } }),
            '&:hover': {
                color: palette.tertiary.main,
                '& .control .icon': __assign({}, border(1, 'solid', palette.tertiary.main)),
            },
        },
        disabled: {
            '& .control .icon': __assign({}, border(1, 'solid', palette.border.disabled)),
            '&:hover': {
                '& .control .icon': __assign({}, border(1, 'solid', palette.border.disabled)),
            },
        },
    });
});
var propTypes = {
    name: PropTypes.string,
    label: PropTypes.string,
    checked: PropTypes.bool,
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
    defaultChecked: PropTypes.bool,
};
var CheckedIcon = function (props) { return (React.createElement(SvgIcon, __assign({}, props, { viewBox: "0 0 24 24" }),
    React.createElement("path", { d: "M8.47 18.357L20.142 4.192a.454.454 0 0 1 .684-.067c.206.19.233.53.06.757L8.643 19.817a.494.494 0 0 1-.773-.007L3.12 13.805a.578.578 0 0 1 .046-.758.454.454 0 0 1 .685.05l4.155 5.255a.296.296 0 0 0 .464.005z" }))); };
var UncheckedIcon = function (props) { return (React.createElement(SvgIcon, __assign({}, props, { viewBox: "0 0 24 24" }),
    React.createElement("rect", { width: "100%", height: "100%" }))); };
export var Checkbox = forwardRef(function (props, ref) {
    var name = props.name, disabled = props.disabled, label = props.label, checked = props.checked, defaultChecked = props.defaultChecked, onChange = props.onChange;
    var checkClasses = useStyles();
    var control = (React.createElement(BaseCheckbox, { id: name, name: name, className: "control", checked: props.checked, defaultChecked: defaultChecked, icon: React.createElement(UncheckedIcon, { className: "icon" }), checkedIcon: React.createElement(CheckedIcon, { className: "icon checked" }), inputRef: ref }));
    return (React.createElement(FormControl, { className: "check-box" },
        React.createElement(FormControlLabel, { label: label, checked: checked, control: control, disabled: disabled, onChange: onChange, classes: checkClasses, defaultChecked: defaultChecked })));
});
Checkbox.displayName = 'Checkbox';
Checkbox.propTypes = propTypes;
//# sourceMappingURL=Checkbox.js.map