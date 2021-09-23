import { useCallback, useEffect, useState } from 'react';
export const useSelectedItem = ({ options, value, onChange, }) => {
    const [selectedItem, setSelectedItem] = useState(null);
    const selectByValue = useCallback((value) => {
        setSelectedItem((options === null || options === void 0 ? void 0 : options.find(it => { var _a; return ((_a = it === null || it === void 0 ? void 0 : it.value) === null || _a === void 0 ? void 0 : _a.id) === (value === null || value === void 0 ? void 0 : value.id); })) || null);
    }, [options]);
    const selectItem = useCallback((item) => {
        selectByValue === null || selectByValue === void 0 ? void 0 : selectByValue(item === null || item === void 0 ? void 0 : item.value);
        onChange === null || onChange === void 0 ? void 0 : onChange((item === null || item === void 0 ? void 0 : item.value) || null);
    }, [onChange, selectByValue]);
    useEffect(() => {
        selectByValue === null || selectByValue === void 0 ? void 0 : selectByValue(value);
    }, [selectByValue, value]);
    return {
        selectedItem,
        selectItem,
    };
};
//# sourceMappingURL=useSelectedItem.js.map