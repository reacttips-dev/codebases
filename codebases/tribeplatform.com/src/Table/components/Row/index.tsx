import React from 'react';
import { Box, HStack, useStyles } from '@chakra-ui/react';
const TableRow = ({ row, getRowProps, showHeaders, index, itemSize, }) => {
    var _a;
    const { row: rowStyle } = useStyles();
    const customStyles = {};
    // If table header is hidden, hide top border on first row
    if (!showHeaders && index === 0) {
        customStyles.borderTop = 0;
    }
    return (React.createElement(HStack, Object.assign({ "data-testid": `table-row-${(_a = row.original) === null || _a === void 0 ? void 0 : _a.id}` }, (itemSize && { h: `${itemSize}px` }), { sx: {
            ...rowStyle,
            ...customStyles,
        } }, row.getRowProps(), getRowProps === null || getRowProps === void 0 ? void 0 : getRowProps(row)), row.cells.map((cell, index) => {
        var _a, _b;
        return (React.createElement(Box
        // eslint-disable-next-line react/no-array-index-key
        , Object.assign({ 
            // eslint-disable-next-line react/no-array-index-key
            key: index, flex: "1" }, cell.getCellProps(), (_b = (_a = cell.column).getColumnProps) === null || _b === void 0 ? void 0 : _b.call(_a)), cell.render('Cell')));
    })));
};
export default TableRow;
//# sourceMappingURL=index.js.map