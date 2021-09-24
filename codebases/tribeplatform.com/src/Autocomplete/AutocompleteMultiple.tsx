import React, { useEffect, useState } from 'react';
import { Box, Flex } from '@chakra-ui/layout';
import { Image, useMultiStyleConfig, usePopper, HStack } from '@chakra-ui/react';
import { useCombobox, useMultipleSelection } from 'downshift';
import ArrowDownSLineIcon from 'remixicon-react/ArrowDownSLineIcon';
import { Trans } from 'tribe-translation';
import { useDebouncedCallback } from '../hooks/useDebounce';
import { Icon } from '../Icon';
import { Input, InputGroup, InputRightElement } from '../Input';
import { Spinner } from '../Spinner';
import { Tag, TagCloseButton, TagLabel } from '../Tag';
import { Text } from '../Text';
/**
 * The suggestions provided can come from a static array of options.
 * Alternatively, you can search for suggestions by providing onInputValueChange function.
 * If you provide both a static array of options and an onInputValueChange,
 * the component uses the static options until the user starts entering characters,
 * whereupon the callback function is used and the static options are ignored.
 */
export const AutocompleteMultiple = ({ clearOnAdd, isDisabled, isInvalid, loading, onBlur, onChange, onSearch, open, optionConverter, options, placeholder, size, value, }) => {
    const debouncedOnSearch = useDebouncedCallback(async (_inputValue) => {
        if (typeof onSearch !== 'function') {
            return;
        }
        const result = await onSearch(_inputValue);
        if (Array.isArray(result) && result.length > 0) {
            setSuggestions(result);
            setEmptySearchResult(false);
        }
        else {
            setSuggestions([]);
            setEmptySearchResult(true);
        }
    }, 100);
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [emptySearchResult, setEmptySearchResult] = useState(false);
    const valueIds = (value === null || value === void 0 ? void 0 : value.map(it => it === null || it === void 0 ? void 0 : it.id)) || [];
    const initialSelectedItems = optionConverter
        ? value === null || value === void 0 ? void 0 : value.map(optionConverter) // sometimes the values might not exists within the options so this is the safest way
        : options.filter(it => valueIds.includes(it.value.id));
    const { getSelectedItemProps, getDropdownProps, addSelectedItem, setSelectedItems, removeSelectedItem, selectedItems, } = useMultipleSelection({
        initialSelectedItems,
        onSelectedItemsChange: changes => {
            var _a;
            const newItemsLength = (_a = changes.selectedItems) === null || _a === void 0 ? void 0 : _a.length;
            if (typeof onChange === 'function' &&
                // Only if a tag was added or removed
                newItemsLength !== (value === null || value === void 0 ? void 0 : value.length)) {
                onChange(changes.selectedItems.map(it => it.value));
            }
            if (clearOnAdd && changes.selectedItems) {
                const lastItem = changes.selectedItems[newItemsLength - 1];
                if ((lastItem === null || lastItem === void 0 ? void 0 : lastItem.label) === inputValue) {
                    setInputValue('');
                }
            }
        },
    });
    useEffect(() => {
        setSuggestions(options);
        if ((value === null || value === void 0 ? void 0 : value.length) &&
            value.length !== selectedItems.length &&
            typeof optionConverter === 'function') {
            setSelectedItems(value.map(optionConverter));
        }
        // Disabling other dependencies for less updates
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [optionConverter, options]);
    useEffect(() => {
        debouncedOnSearch(inputValue);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inputValue]);
    const getFilteredItems = () => {
        const withoutSelected = suggestions.filter(item => selectedItems.find(it => it.value.id === item.value.id) === undefined);
        if (typeof onSearch === 'function') {
            return withoutSelected;
        }
        return withoutSelected.filter(item => item.label.toLowerCase().startsWith(inputValue.toLowerCase()));
    };
    const itemToString = (item) => (item ? item.label : '');
    const { isOpen, getToggleButtonProps, getMenuProps, highlightedIndex, getItemProps, getInputProps, getComboboxProps, } = useCombobox({
        inputValue,
        defaultHighlightedIndex: 0,
        isOpen: open,
        selectedItem: null,
        items: getFilteredItems(),
        itemToString,
        stateReducer: (_state, actionAndChanges) => {
            var _a, _b;
            const { changes, type } = actionAndChanges || {};
            switch (type) {
                case (_a = useCombobox === null || useCombobox === void 0 ? void 0 : useCombobox.stateChangeTypes) === null || _a === void 0 ? void 0 : _a.InputKeyDownEnter:
                case (_b = useCombobox === null || useCombobox === void 0 ? void 0 : useCombobox.stateChangeTypes) === null || _b === void 0 ? void 0 : _b.ItemClick:
                    return {
                        ...changes,
                        isOpen: typeof onSearch !== 'function', // keep the menu open after selection, but not in search mode
                    };
                default:
                    return changes;
            }
        },
        onStateChange: ({ inputValue, type, selectedItem }) => {
            switch (type) {
                case useCombobox.stateChangeTypes.InputChange:
                    setInputValue(inputValue);
                    break;
                case useCombobox.stateChangeTypes.InputKeyDownEnter:
                case useCombobox.stateChangeTypes.ItemClick:
                case useCombobox.stateChangeTypes.InputBlur:
                    if (selectedItem) {
                        setInputValue('');
                        addSelectedItem(selectedItem);
                    }
                    break;
                default:
                    break;
            }
        },
    });
    const { popperRef, referenceRef } = usePopper({
        placement: 'bottom',
        matchWidth: true,
    });
    const styles = useMultiStyleConfig('Select', { size });
    return (React.createElement(Box, { sx: { height: 'auto' } },
        React.createElement(Box, { borderRadius: "md", borderColor: "border.base", borderWidth: "1px", px: 3 },
            React.createElement(Flex, { alignItems: "center", flexWrap: "wrap", mx: -1, ref: referenceRef },
                selectedItems.map((selectedItem, index) => (React.createElement(Tag, Object.assign({ key: selectedItem.value.id }, getSelectedItemProps({ selectedItem, index }), { size: "lg", m: 1 }),
                    (selectedItem === null || selectedItem === void 0 ? void 0 : selectedItem.icon) && typeof (selectedItem === null || selectedItem === void 0 ? void 0 : selectedItem.icon) === 'string' && (React.createElement(Image, { src: selectedItem.icon, alt: selectedItem.label, marginLeft: -1, marginRight: 2 })),
                    (selectedItem === null || selectedItem === void 0 ? void 0 : selectedItem.icon) ? selectedItem.icon : null,
                    React.createElement(TagLabel, null, selectedItem.label),
                    React.createElement(TagCloseButton, { "data-testid": `tag-close-button-${selectedItem.value.id}`, onClick: e => {
                            e.stopPropagation();
                            removeSelectedItem(selectedItem);
                        } })))),
                React.createElement(Box, Object.assign({}, getComboboxProps(), { sx: {
                        flex: 1,
                        flexGrow: 1,
                        minWidth: 24,
                    } }),
                    React.createElement(InputGroup, { sx: styles.input },
                        React.createElement(Input, Object.assign({}, getInputProps(getToggleButtonProps(getDropdownProps({
                            preventKeyAction: isOpen,
                            placeholder: selectedItems.length === 0 ? placeholder : null,
                            disabled: isDisabled,
                            onBlur,
                        }))), { variant: "unstyled", size: size, isInvalid: isInvalid, isDisabled: isDisabled, "data-testid": "autofill" })),
                        suggestions.length > 0 && open && (React.createElement(InputRightElement, { pointerEvents: "none" },
                            React.createElement(Icon, { as: ArrowDownSLineIcon }))))))),
        React.createElement(Box, Object.assign({ ref: popperRef }, getMenuProps(), { zIndex: "dropdown" }), isOpen && (React.createElement(Box, { sx: styles.list },
            loading && (React.createElement(HStack, { justifyContent: "flex-start", mt: 4, mb: 4, spacing: 2, px: 4 },
                React.createElement(Spinner, { color: "label.secondary", size: "sm", thickness: "2px" }),
                React.createElement(Text, { textStyle: "regular/small", color: "label.secondary" },
                    React.createElement(Trans, { i18nKey: "common:autocomplete.searching", defaults: "Searching..." })))),
            getFilteredItems().map((item, index) => (React.createElement(Flex, Object.assign({ key: item.value.id }, getItemProps({ item, index }), { sx: styles.item }, (highlightedIndex === index && { 'data-active': true }), { "data-testid": `autocomplete-list-item-${index}` }),
                item.icon && typeof item.icon === 'string' && (React.createElement(Image, { src: item.icon, alt: item.label })),
                React.createElement("span", null, item.label)))),
            getFilteredItems().length === 0 && (React.createElement(Flex, { sx: styles.item },
                React.createElement(Trans, { i18nKey: "common:autocomplete.noresult", defaults: "No results found" }))))))));
};
//# sourceMappingURL=AutocompleteMultiple.js.map