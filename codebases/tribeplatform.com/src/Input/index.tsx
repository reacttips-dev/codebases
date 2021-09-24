import React from 'react';
import { Box, Circle, Flex, Grid, GridItem, Input as ChakraInput, InputAddon as ChakraInputAddon, InputGroup as ChakraInputGroup, InputLeftAddon as ChakraInputLeftAddon, InputLeftElement as ChakraInputLeftElement, InputRightAddon as ChakraInputRightAddon, InputRightElement as ChakraInputRightElement, Text, useMultiStyleConfig, useStyles, forwardRef, } from '@chakra-ui/react';
import hexRgb from 'hex-rgb';
import { HexColorPicker } from 'react-colorful';
import rgbHex from 'rgb-hex';
import { Trans } from 'tribe-translation';
export const Input = forwardRef(({ withLeftAddon, withRightAddon, sx, ...props }, ref) => {
    const styles = useMultiStyleConfig('Input', {
        withLeftAddon,
        withRightAddon,
        ...props,
    });
    return (React.createElement(ChakraInput, Object.assign({ ref: ref, sx: {
            ...styles.field,
            ...sx,
        } }, props)));
});
export const InputGroup = (props) => (React.createElement(ChakraInputGroup, Object.assign({}, props)));
export const InputAddon = ({ isDisabled, ...props }) => {
    const styles = useMultiStyleConfig('Input', { isDisabled });
    return React.createElement(ChakraInputAddon, Object.assign({ sx: styles.addon }, props));
};
export const InputRightAddon = ({ isDisabled, ...props }) => {
    const styles = useMultiStyleConfig('Input', { isDisabled });
    return React.createElement(ChakraInputRightAddon, Object.assign({ sx: styles.addon }, props));
};
export const InputLeftAddon = ({ isDisabled, ...props }) => {
    const styles = useMultiStyleConfig('Input', { isDisabled });
    return React.createElement(ChakraInputLeftAddon, Object.assign({ sx: styles.addon }, props));
};
export const InputLeftElement = forwardRef((props, ref) => {
    const styles = useStyles();
    const input = styles.field;
    const elementStyles = {
        color: input === null || input === void 0 ? void 0 : input.color,
    };
    return React.createElement(ChakraInputLeftElement, Object.assign({ ref: ref, sx: elementStyles }, props));
});
export const InputRightElement = forwardRef((props, ref) => {
    const styles = useStyles();
    const input = styles.field;
    const elementStyles = {
        color: input === null || input === void 0 ? void 0 : input.color,
    };
    return React.createElement(ChakraInputRightElement, Object.assign({ ref: ref, sx: elementStyles }, props));
});
const ColorPicker = (props) => {
    const { visible, colorHex, onClickOutside, onChangeColor } = props;
    let rgb;
    // Catch invalid hex values
    try {
        rgb = hexRgb(colorHex);
    }
    catch {
        rgb = {};
    }
    const onChangeRGB = (newRed, newGreen, newBlue) => {
        try {
            const newHex = rgbHex(newRed, newGreen, newBlue);
            return onChangeColor(`#${newHex}`);
        }
        catch {
            return null;
        }
    };
    if (!visible)
        return null;
    return (React.createElement(React.Fragment, null,
        React.createElement(Box, { pos: "fixed", top: "0", left: "0", height: "full", width: "full", onClick: onClickOutside }),
        React.createElement(Box, { pos: "absolute", p: "3", top: "12", zIndex: "docked", bg: "bg.base", shadow: "md", w: "310px", borderRadius: "lg" },
            React.createElement(HexColorPicker, { color: colorHex, onChange: onChangeColor }),
            React.createElement(Grid, { mt: "2", templateColumns: "repeat(5, 1fr)", gap: 2 },
                React.createElement(GridItem, { colSpan: 2 },
                    React.createElement(Text, { textStyle: "regular/small", color: "label.primary" },
                        React.createElement(Trans, { i18nKey: "admin:sidebar.theme.picker.hex", defaults: "Hex" })),
                    React.createElement(Input, { mt: "1", color: "label.primary", placeholder: "Hex", value: colorHex, onChange: event => onChangeColor(event.target.value) })),
                React.createElement(GridItem, null,
                    React.createElement(Text, { textStyle: "regular/small", color: "label.primary" }, "R"),
                    React.createElement(Input, { mt: "1", color: "label.primary", type: "tel", placeholder: "R", value: rgb.red, onChange: event => onChangeRGB(parseInt(event.target.value, 10), rgb.green, rgb.blue) })),
                React.createElement(GridItem, null,
                    React.createElement(Text, { textStyle: "regular/small", color: "label.primary" }, "G"),
                    React.createElement(Input, { mt: "1", color: "label.primary", type: "tel", placeholder: "G", value: rgb.green, onChange: event => onChangeRGB(rgb.red, parseInt(event.target.value, 10), rgb.blue) })),
                React.createElement(GridItem, null,
                    React.createElement(Text, { textStyle: "regular/small", color: "label.primary" }, "B"),
                    React.createElement(Input, { mt: "1", color: "label.primary", type: "tel", placeholder: "B", value: rgb.blue, onChange: event => onChangeRGB(rgb.red, rgb.green, parseInt(event.target.value, 10)) }))))));
};
export const ColorInput = (props) => {
    const { colorPicker, isColorPickerVisible, onClickColorPicker, onChangeColor, onClickOutside, label, } = props;
    return (React.createElement(Flex, { align: "center", justify: "space-between", pos: "relative" },
        React.createElement(Text, { cursor: "pointer", onClick: onClickColorPicker, textStyle: "medium/medium" }, label),
        React.createElement(Circle, { bg: colorPicker.value, h: "24px", w: "24px", cursor: "pointer", border: "1px", borderColor: "border.base", onClick: onClickColorPicker }),
        React.createElement(ColorPicker, { visible: isColorPickerVisible, colorHex: colorPicker.value, onClickOutside: onClickOutside, onChangeColor: hex => onChangeColor(hex) })));
};
export default Input;
//# sourceMappingURL=index.js.map