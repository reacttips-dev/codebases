import React from 'react';
import { Flex } from '@chakra-ui/react';
import TableLineIcon from 'remixicon-react/TableLineIcon';
import { Checkbox } from '../../../Checkbox';
import { Dropdown, DropdownIconButton, DropdownItem, DropdownList, } from '../../../Dropdown';
import { Text } from '../../../Text';
const ColumnsFilter = ({ columns, hiddenColumns }) => {
    return (React.createElement(Dropdown, { placement: "auto-start" },
        React.createElement(DropdownIconButton, { mb: "2", icon: TableLineIcon }),
        React.createElement(DropdownList, null, columns
            .filter(({ isFilterable }) => isFilterable !== false)
            .map(({ id, Header, toggleHidden }) => {
            const isVisible = !hiddenColumns.includes(id);
            return (React.createElement(DropdownItem, { key: id, onClick: () => toggleHidden(isVisible) },
                React.createElement(Flex, null,
                    React.createElement(Checkbox, { isChecked: isVisible }),
                    React.createElement(Text, { pl: "2" }, Header))));
        }))));
};
export default ColumnsFilter;
//# sourceMappingURL=index.js.map