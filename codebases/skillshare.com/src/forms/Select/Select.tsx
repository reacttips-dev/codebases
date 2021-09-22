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
import { border, padding } from 'polished';
import PropTypes from 'prop-types';
import { makeStyles, MenuItem, Select as MuiSelect, SvgIcon } from '@material-ui/core';
var useStyles = makeStyles(function (_a) {
    var palette = _a.palette, shape = _a.shape;
    return ({
        root: {
            '&:focus': {
                borderRadius: shape.borderRadius,
            },
            '& ~ fieldset': {
                display: 'none',
            },
        },
        icon: {
            marginLeft: 8,
        },
        outlined: __assign(__assign(__assign(__assign({}, border(1, 'solid', palette.border.main)), { backgroundColor: palette.common.white + " !important" }), padding(8, 20)), { '&[aria-expanded=true], &:focus': {
                borderColor: palette.tertiary.main,
                boxShadow: palette.tertiary.main + " 0 0 0 1.5px",
                outline: 'none',
            } }),
    });
});
var mStyles = makeStyles(function (_a) {
    var palette = _a.palette;
    return ({
        root: {
            '& .Mui-selected, & .Mui-selected:hover': {
                backgroundColor: palette.secondary.main,
                color: palette.common.white,
            },
        },
    });
});
var propTypes = {
    options: PropTypes.array,
    onChange: PropTypes.func,
};
var ArrowDownIcon = function (props) {
    return (React.createElement(SvgIcon, __assign({}, props),
        React.createElement("path", { d: "M12.71533 15.68522C12.70988 15.69105 12.70437 15.69681 12.69879 15.70251C12.30372 16.105800000000002 11.6706 16.098100000000002 11.28467 15.68522L3.159216 6.992738C2.9469279 6.765635 2.9469279 6.397429 3.159216 6.170327C3.371504 5.9432244 3.7156919999999998 5.9432244 3.92798 6.170327L12 14.80564L20.072 6.170327C20.2843 5.9432244 20.6285 5.9432244 20.8408 6.170327C21.0531 6.397429 21.0531 6.765635 20.8408 6.992738L12.71533 15.68522z" })));
};
export var Select = forwardRef(function (props, ref) {
    var options = props.options, onChange = props.onChange, selectedValue = props.selectedValue;
    var classes = useStyles();
    var menuStyles = mStyles();
    return (React.createElement(MuiSelect, { classes: classes, className: "select", IconComponent: ArrowDownIcon, inputRef: ref, MenuProps: {
            classes: {
                list: menuStyles.root,
            },
        }, onChange: onChange, value: (selectedValue === null || selectedValue === void 0 ? void 0 : selectedValue.value) || '', variant: "outlined" }, options.map(function (option, index) { return (React.createElement(MenuItem, { key: index, value: option.value }, option.label)); })));
});
Select.displayName = 'Select';
Select.propTypes = propTypes;
//# sourceMappingURL=Select.js.map