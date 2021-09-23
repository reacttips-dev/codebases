import React from 'react';
import { Dropdown, DropdownBox, DropdownItem, DropdownList, } from '../Dropdown';
import { useSelectedItem } from '../hooks/useSelectedItem';
import { SelectTriggerBox } from './SelectTriggerBox';
const SelectItem = ({ item, setSelectedItem, isActive, }) => {
    const onClick = () => {
        if (!item.disabled) {
            setSelectedItem(item);
        }
    };
    return (React.createElement(DropdownItem, { onClick: onClick, isActive: isActive, isDisabled: (item === null || item === void 0 ? void 0 : item.disabled) || false, icon: item === null || item === void 0 ? void 0 : item.icon }, item === null || item === void 0 ? void 0 : item.label));
};
export const Select = ({ value, options, onChange, open, isLazy, placement, listProps, autoSelect, ...rest }) => {
    const { selectedItem, selectItem } = useSelectedItem({
        options,
        value,
        onChange,
    });
    return (React.createElement(Dropdown, { defaultIsOpen: open, isLazy: isLazy, placement: placement, autoSelect: autoSelect },
        React.createElement(DropdownBox, { w: "100%" },
            React.createElement(SelectTriggerBox, Object.assign({ selectedItem: selectedItem }, rest))),
        React.createElement(DropdownList, Object.assign({ zIndex: "dropdown" }, listProps), options.map((item, index) => (React.createElement(SelectItem, { key: item.value.id || index, item: item, setSelectedItem: selectItem, isActive: (selectedItem === null || selectedItem === void 0 ? void 0 : selectedItem.value.id) === item.value.id }))))));
};
//# sourceMappingURL=Select.js.map