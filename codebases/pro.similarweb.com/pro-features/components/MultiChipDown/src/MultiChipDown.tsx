import React, { useEffect, useRef, useState } from "react";
import { ChipDownContainer, EllipsisDropdownItem } from "@similarweb/ui-components/dist/dropdown";
import { FooterButton } from "../../MultiCategoriesChipDown/src/MultiCategoryChipdownStyles";
import { IMultiChipDownProps, IChipItem } from "./MultiChipDownTypes";
import I18n, { useTranslation } from "components/WithTranslation/src/I18n";
import { abbrNumberVisitsFilter } from "filters/ngFilters";

const MultiChipDown: React.FC<IMultiChipDownProps> = ({
    options = [],
    initialSelectedItems,
    buttonText,
    onDone,
    appendTo = null,
    hasSearch = false,
    searchPlaceHolder = "",
    dropdownWidth = 320,
    isDisabled = false,
    getDropdownItem,
    virtualize,
    maxVirtualItemsToRender,
    clearSelectionWhenOneOption = true,
    labelFooterButton,
    renderChipTitleText,
    onToggleDropdown,
}) => {
    const translate = useTranslation();
    const chipDownRef = useRef(undefined);
    const [selectedItems, setSelectedItems] = useState<IChipItem[]>([]);
    const [prevSelectedItems, setPrevSelectedItems] = useState<IChipItem[]>([]);
    const [showApplyButton, setShowApplyButton] = useState(false);
    const [chipTitle, setChipTitle] = useState<string>("");
    const [chipTooltipText, setChipTooltipText] = useState<string>("");
    const [selectedItemsIds, setSelectedItemsIds] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        if (options.length > 0) {
            const items = options.filter((option) =>
                Object.keys(initialSelectedItems).includes(option.id),
            );
            setPrevSelectedItems(items);
            setSelectedItems(items);
        }
    }, [options]);

    useEffect(() => {
        setChipTooltipText(selectedItems.map(({ text }) => text).join(", "));
        setSelectedItemsIds(Object.fromEntries(selectedItems.map((item) => [item.id, true])));
        setChipTitleText();
    }, [selectedItems]);

    const setChipTitleText = () => {
        const itemsTitles = selectedItems.map((item) => item?.text);

        if (typeof renderChipTitleText === "function") {
            renderChipTitleText(itemsTitles, setChipTitle);
            return;
        }
        switch (itemsTitles.length) {
            case 0:
                setChipTitle("");
                break;
            case 1:
                setChipTitle(itemsTitles[0]);
                break;
            case 2:
                setChipTitle(
                    translate("multiselect.chipdown.filters.two.items", {
                        item1: itemsTitles[0],
                        item2: itemsTitles[1],
                    }),
                );
                break;
            case 3:
                setChipTitle(
                    translate("multiselect.chipdown.filters.two.items.plus.extra.one", {
                        item1: itemsTitles[0],
                        item2: itemsTitles[1],
                    }),
                );
                break;
            default:
                setChipTitle(
                    translate("multiselect.chipdown.filters.two.items.plus.extra.items", {
                        item1: itemsTitles[0],
                        item2: itemsTitles[1],
                        amount: itemsTitles.length - 2,
                    }),
                );
                break;
        }
    };

    const onApply = () => {
        onDone(selectedItems);
        setChipTitleText();
        setPrevSelectedItems(selectedItems);
        chipDownRef.current?.closePopup();
    };

    const onClick = (selectedItem) => {
        const selectedItemIndex = selectedItems.findIndex((item) => item.id === selectedItem.id);

        if (selectedItemIndex !== -1) {
            setSelectedItems((state) => [
                ...state.slice(0, selectedItemIndex),
                ...state.slice(selectedItemIndex + 1),
            ]);
        } else {
            setSelectedItems((state) => [
                ...state,
                options.find((option) => option.id === selectedItem.id),
            ]);
        }
        setShowApplyButton(true);
    };

    const onToggle = (isOpen: boolean, isOutsideClick: boolean) => {
        if (typeof onToggleDropdown === "function") {
            onToggleDropdown(isOpen);
        }

        if (!isOpen) {
            setShowApplyButton(false);

            if (isOutsideClick) {
                setSelectedItems(prevSelectedItems);
            }
            if (clearSelectionWhenOneOption && selectedItems.length === options.length) {
                // If user closed the dropdown and selected all options - clear selection
                clearSelection();
            }
        }
    };

    const clearSelection = () => {
        setSelectedItems([]);
        setPrevSelectedItems([]);
        onDone([]);
        setChipTitle("");
    };

    return (
        <ChipDownContainer
            ref={chipDownRef}
            tooltipDisabled={selectedItems.length === 1}
            selectedText={chipTitle}
            tooltipText={chipTooltipText}
            closeOnItemClick={false}
            onToggle={onToggle}
            onCloseItem={clearSelection}
            selectedIds={selectedItemsIds}
            width={dropdownWidth}
            buttonText={buttonText}
            hasSearch={hasSearch}
            searchPlaceHolder={searchPlaceHolder}
            footerComponent={() =>
                showApplyButton && (
                    <FooterButton onClick={onApply}>
                        {labelFooterButton || <I18n>common.apply</I18n>}
                    </FooterButton>
                )
            }
            cssClassContainer="DropdownContent-container"
            disabled={isDisabled}
            onClick={onClick}
            virtualize={virtualize}
            maxVirtualItemsToRender={maxVirtualItemsToRender}
            appendTo={appendTo}
        >
            {options.map((option) =>
                getDropdownItem ? (
                    getDropdownItem(option)
                ) : (
                    <EllipsisDropdownItem
                        showCheckBox
                        key={option.id}
                        id={option.id}
                        infoText={abbrNumberVisitsFilter()(option?.count || 0)}
                        imageUrl={option?.imageUrl}
                        disabled={option?.count == 0}
                    >
                        {translate(option.text)}
                    </EllipsisDropdownItem>
                ),
            )}
        </ChipDownContainer>
    );
};

export default MultiChipDown;
