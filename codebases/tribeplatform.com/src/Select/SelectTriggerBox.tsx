import React from 'react';
import { Image } from '@chakra-ui/react';
import { useMultiStyleConfig } from '@chakra-ui/system';
import ArrowDownSLineIcon from 'remixicon-react/ArrowDownSLineIcon';
import { Icon } from '../Icon';
import { Input, InputGroup, InputLeftElement, InputRightElement, } from '../Input';
export const SelectTriggerBox = ({ selectedItem, size, ...rest }) => {
    const styles = useMultiStyleConfig('Select', { size });
    return (React.createElement(InputGroup, null,
        (selectedItem === null || selectedItem === void 0 ? void 0 : selectedItem.icon) && typeof (selectedItem === null || selectedItem === void 0 ? void 0 : selectedItem.icon) === 'string' && (React.createElement(InputLeftElement, { pointerEvents: "none" },
            React.createElement(Image, { src: selectedItem.icon, alt: selectedItem.label }))),
        React.createElement(Input, Object.assign({ size: size, value: (selectedItem === null || selectedItem === void 0 ? void 0 : selectedItem.label) || '', isReadOnly: true }, rest, { sx: {
                caretColor: 'transparent',
                ...styles.input,
            } })),
        React.createElement(InputRightElement, { pointerEvents: "none" },
            React.createElement(Icon, { as: ArrowDownSLineIcon }))));
};
//# sourceMappingURL=SelectTriggerBox.js.map