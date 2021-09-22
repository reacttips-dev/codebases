import React, { useMemo, useRef, useState } from "react";
import classNames from "classnames";
import { FooterButton } from "components/MultiCategoriesChipDown/src/MultiCategoryChipdownStyles";
import {
    Dropdown,
    DropdownButton,
    SimpleDropdownItem,
} from "@similarweb/ui-components/dist/dropdown";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { findElement, isAllItemsSelected } from "./helpers";
import {
    StyledDropdownContainer,
    StyledTitle,
    StyledPrefix,
    PlaceholderLoaderStyle,
} from "./styles";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { SELECTED_ALL_ID } from "../../constants/constants";
import DropdownHeaderItem from "./DropdownHeaderItem/DropdownHeaderItem";
import { isUpdateSelection, extractValidItems, newStateWithStatusForAllItems } from "../helpers";
import { SelectedIdsState, MultiSelectDropdownProps, Item } from "./types";
import { TOOLBAR_FOOTER_BUTTON_TITTLE } from "../../sub-modules/benchmarks/constants";

/**
 * @date 2021-03-26
 * @param {any[]} items options items array
 * @param {boolean} hasSearch=true show search
 * @param {function} onHandleApply function on apply
 * @param {any} selected={} selected item
 * @param {string} dropdownPopupPlacement placement of popup
 * @param {string} prefix
 * @param {ReactElement} DropdownButtonItem
 * @param {ComponentType} DropdownItem
 * @param {number} widthDropdown dropdown width
 * @param {number} heightDropdown dropdown height
 * @param {number} dropdownPopupHeight dropdown popup height
 * @param {string} btnLabelAllItems
 * @param {string} btnTitleSeveralItems
 * @param {string} titleSelectedAllItems
 * @param {string} tooltipContent tooltip text
 * @param {string} leftTitleColumn left column text
 * @param {string} rightTitleColumn right column text
 * @param {boolean} loading load state
 * @param {string} searchPlaceholder placeholder text
 * @param {boolean} isSingleMode component in single mode
 * @param {boolean} isShowFirstItem show first item
 * @param {boolean} isTooltipDisabled disable tooltip
 * @returns {any} ReactNode
 */

const MultiSelectDropdownItem = ({
    items,
    hasSearch = true,
    onHandleApply,
    selected = {},
    dropdownPopupPlacement = "ontop-left",
    prefix,
    DropdownButtonItem = DropdownButton,
    DropdownItem = SimpleDropdownItem,
    widthDropdown,
    heightDropdown,
    dropdownPopupHeight,
    btnLabelAllItems,
    btnLabelSeveralItems,
    titleSelectedAllItems,
    tooltipContent = "",
    leftTitleColumn,
    rightTitleColumn,
    loading,
    searchPlaceholder = "",
    isSingleMode = false,
    isShowFirstItem = true,
    isTooltipDisabled = false,
    disabled = false,
    disabledTooltipText,
}: MultiSelectDropdownProps) => {
    const unSelectedItem = { id: 0, text: "" };
    const translate = useTranslation();
    const ref = useRef(null);
    const [selectedIds, setSelectedIds] = useState<SelectedIdsState>({});

    /**
     * Disabled in case all items are unselected;
     */
    const isUnSelectedAllItems = useMemo(() => Object.keys(selectedIds).length === 0, [
        selectedIds,
    ]);

    const setUpSelectedItems = () => {
        if (isAllItemsSelected(items, selected) && !isSingleMode) {
            setSelectedIds({ ...selected, [SELECTED_ALL_ID]: true });
        } else {
            setSelectedIds({ ...selected });
        }
    };

    React.useEffect(() => {
        setUpSelectedItems();
    }, [selected, items]);

    const onClickApply = () => {
        if (!isUnSelectedAllItems) {
            onHandleApply(extractValidItems(selectedIds));
            ref.current.popupClickRef.closePopup();
        }
    };

    const onClickItem = ({ id }) => {
        let newStateSelectedIds = {};
        if (isSingleMode) {
            onHandleApply({ [id]: true });
            ref.current.popupClickRef.closePopup();
        } else {
            if (id === SELECTED_ALL_ID) {
                if (!selectedIds[id]) {
                    newStateSelectedIds = newStateWithStatusForAllItems(items, true);
                    newStateSelectedIds[SELECTED_ALL_ID] = true;
                }
            } else {
                newStateSelectedIds = { ...selectedIds };
                delete newStateSelectedIds[SELECTED_ALL_ID];

                if (selectedIds[id]) {
                    delete newStateSelectedIds[id];
                } else {
                    newStateSelectedIds[id] = true;
                }

                if (isAllItemsSelected(items, newStateSelectedIds)) {
                    newStateSelectedIds[SELECTED_ALL_ID] = true;
                }
            }
            setSelectedIds(newStateSelectedIds);
        }
    };

    const displayButtonTitle = () => {
        if (loading) {
            return <PlaceholderLoaderStyle width={45} height={17} />;
        }

        const countOfSelected = Object.keys(selectedIds).length;

        if (selectedIds[SELECTED_ALL_ID]) {
            return <StyledTitle>{btnLabelAllItems(countOfSelected - 1)}</StyledTitle>;
        } else if (countOfSelected > 1) {
            return <StyledTitle>{btnLabelSeveralItems(countOfSelected)}</StyledTitle>;
        } else {
            const foundItem = findElement(items, selectedIds, unSelectedItem);
            return <DropdownButtonItem id={foundItem.id} text={foundItem.text} />;
        }
    };

    const footerComponent = () => {
        if (isUpdateSelection(selectedIds, selected) && !isSingleMode) {
            return (
                <FooterButton disabled={isUnSelectedAllItems} onClick={onClickApply}>
                    {translate(TOOLBAR_FOOTER_BUTTON_TITTLE)}
                </FooterButton>
            );
        }
        return null;
    };

    const onTogglePopUp = (open: boolean, clickOutside: boolean) => {
        if (clickOutside && isUnSelectedAllItems) {
            setUpSelectedItems();
            return;
        }

        if (clickOutside && isUpdateSelection(selectedIds, selected)) {
            onHandleApply(extractValidItems(selectedIds));
        }
    };

    const headerComponent = leftTitleColumn && rightTitleColumn && (
        <DropdownHeaderItem key={"header"} isNested>
            <div>{leftTitleColumn}</div>
            <div>{rightTitleColumn}</div>
        </DropdownHeaderItem>
    );

    return (
        <PlainTooltip
            key="tooltip"
            placement="top"
            tooltipContent={disabledTooltipText}
            maxWidth={200}
            enabled={disabled}
        >
            <StyledDropdownContainer className={classNames({ disabled })}>
                <Dropdown
                    disabled={disabled}
                    ref={ref}
                    width={widthDropdown}
                    height={heightDropdown}
                    dropdownPopupPlacement={dropdownPopupPlacement}
                    dropdownPopupHeight={dropdownPopupHeight}
                    selectedIds={selectedIds}
                    onClick={onClickItem}
                    closeOnItemClick={false}
                    hasSearch={hasSearch}
                    searchPlaceHolder={searchPlaceholder}
                    footerComponent={footerComponent}
                    appendTo=".MultiSelection-Button"
                    onToggle={onTogglePopUp}
                    headerComponent={headerComponent}
                >
                    {[
                        <PlainTooltip
                            key="tooltip"
                            placement="top"
                            tooltipContent={tooltipContent}
                            maxWidth={200}
                            enabled={!isTooltipDisabled}
                        >
                            <div>
                                <DropdownButton cssClass="MultiSelection-Button">
                                    {prefix && <StyledPrefix>{prefix}</StyledPrefix>}
                                    {displayButtonTitle()}
                                </DropdownButton>
                            </div>
                        </PlainTooltip>,
                        isShowFirstItem && (
                            <DropdownItem
                                key={SELECTED_ALL_ID}
                                id={SELECTED_ALL_ID}
                                text={titleSelectedAllItems(`(${items.length})`)}
                                showIcon={false}
                                halfSelected={!isUnSelectedAllItems}
                            />
                        ),
                        ...items.map((item) => <DropdownItem key={item.id} {...item} />),
                    ].filter((x) => x)}
                </Dropdown>
            </StyledDropdownContainer>
        </PlainTooltip>
    );
};

export default MultiSelectDropdownItem;
