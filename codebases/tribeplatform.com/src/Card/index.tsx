import React from 'react';
import { Box, useStyleConfig, } from '@chakra-ui/react';
import { Divider } from '../Divider';
export const Card = ({ children, size, ...rest }) => {
    const styles = useStyleConfig('Card', { size });
    return (React.createElement(Box, Object.assign({ sx: styles }, rest), children));
};
export const CardDivider = (props) => {
    return (React.createElement(Divider, Object.assign({ width: "auto", my: 6, mx: -6, borderColor: "border.lite" }, props)));
};
export default Card;
//# sourceMappingURL=index.js.map