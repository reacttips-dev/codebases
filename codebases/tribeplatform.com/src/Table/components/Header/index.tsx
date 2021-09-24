import React from 'react';
import { useStyles, HStack, Box, Text } from '@chakra-ui/react';
import { textStyles } from '../../../theme/foundations/typography';
const TableHeader = ({ headerGroups, headerProps }) => {
    const { header } = useStyles();
    return (React.createElement(Box, Object.assign({ sx: { ...header, ...headerProps } }, textStyles['semibold/small'], headerProps, { "data-testid": "table-header" }), headerGroups.map((headerGroup, index) => (
    // eslint-disable-next-line react/no-array-index-key
    React.createElement(HStack, Object.assign({ key: index }, headerGroup.getHeaderGroupProps()), headerGroup.headers.map((column, index) => {
        var _a, _b;
        return (React.createElement(Box
        // eslint-disable-next-line react/no-array-index-key
        , Object.assign({ 
            // eslint-disable-next-line react/no-array-index-key
            key: index, as: "span", flex: "1" }, column.getHeaderProps(), (_a = column.getColumnProps) === null || _a === void 0 ? void 0 : _a.call(column)),
            React.createElement(Text, Object.assign({ fontSize: "inherit", fontWeight: "inherit", lineHeight: "inherit", color: "inherit" }, (_b = column.getTitleProps) === null || _b === void 0 ? void 0 : _b.call(column)), column.render('Header'))));
    }))))));
};
export default TableHeader;
//# sourceMappingURL=index.js.map