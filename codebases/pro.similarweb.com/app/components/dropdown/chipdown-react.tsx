import { colorsPalettes } from "@similarweb/styles";
import { ChipDownContainer, EllipsisDropdownItem } from "@similarweb/ui-components/dist/dropdown";
import { Pill } from "components/Pill/Pill";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { numberFilter, i18nFilter } from "filters/ngFilters";
import * as _ from "lodash";
import React, { ReactElement, useState } from "react";
import { SwTrack } from "services/SwTrack";
import styled from "styled-components";

const StyledPill = styled(Pill)`
    margin-left: 10px;
    font-size: 10px !important;
`;

interface IProps {
    items: Array<{ text?: string; title?: string; id: string; count: number; disabled?: boolean }>;
    selected?: string;
    placeholder?: string;
    contactFormIsVisible?: boolean;
    onChange: (item) => void;
    className?: string;
    swTrackName?: string;
    swTrackValue?: number;
    maxWidth?: string | number;
    minWidth?: string | number;
    showSearch?: boolean;
    emptySelect?: boolean;
    disabled?: boolean;
    appendToBody?: boolean;
    width?: string | number;
    textAlign?: string;
    showBetaLabel?: boolean;
    renderItem: (item, isSelected, index) => ReactElement;
    isNew?: boolean;
}

function searchFilter(term, item) {
    return item?.props?.text?.toLowerCase().includes(term.toLowerCase());
}

function nestedFilter(items, query, showSearch) {
    function contains(item, query) {
        return item?.text?.toLowerCase().indexOf(query.toLowerCase()) > -1;
    }

    if (!items) {
        return;
    }
    if (!showSearch || !items.length) {
        return items;
    }
    return items.filter(function (item) {
        if (item.children && item.children.length) {
            let validCount = item.children.length;
            item.children.forEach(function (childItem) {
                // Hide child elements that don't pass the test
                // and decrement validCount
                if (!contains(item, query) && !contains(childItem, query)) {
                    childItem.hidden = true;
                    validCount--;
                } else {
                    childItem.hidden = false;
                }
            });
            if (validCount) {
                // If there are some valid children show the parent
                item.disabled = !contains(item, query);
                return true;
            } else {
                return contains(item, query);
            }
        } else {
            return contains(item, query);
        }
    });
}

function findNestedItem(items, itemId) {
    let childResult = null;
    const returnedValue = _.find(items, function (item) {
        if (item.id == itemId) {
            return true;
        } else if (item.children && item.children.length) {
            childResult = findNestedItem(item.children, itemId);
            return !_.isEmpty(childResult);
        } else {
            return false;
        }
    });
    return childResult || returnedValue;
}

function getSelectedText(trackName, item) {
    let text;
    switch (trackName) {
        //SIM-5748 special case for widget metrics
        case "Metric":
            text = item.id;
            break;
        //SIM-5748 special case for subdomains
        case "Domain level":
            text = item.text.substring("wwwselector.".length);
            break;
        default:
            text = item.text;
    }
    return text;
}

function getSelectedItem(items, selectedId) {
    let selectedItem;
    items.forEach((item) => {
        if (item.id === selectedId) {
            selectedItem = item;
            return;
        }
        if (item.children) {
            item.children.forEach((child) => {
                if (child.id === selectedId) {
                    selectedItem = child;
                    return;
                }
            });
        }
    });
    return selectedItem;
}

const ChipdownReact: React.FunctionComponent<IProps> = ({
    swTrackName,
    selected,
    items,
    onChange,
    placeholder,
    disabled,
    showSearch,
    width,
    renderItem,
    swTrackValue,
    isNew,
    className,
}) => {
    const [search, setSearch] = useState({ string: "" });
    const selectedItem = getSelectedItem(items, selected);

    const getGroupText = (item) => {
        const label = item.text || item.title || (item.getText && item.getText());
        if (!label) {
            return "";
        }
        return i18nFilter()(label) + (item.count ? " (" + numberFilter()(item.count) + ")" : "");
    };
    const removeSelection = () => {
        let text = getSelectedText(swTrackName, selectedItem);
        let trackName = "";
        if (text === "formforms.category.all") {
            trackName = "All Categories";
            text = "";
        }
        let addSlash = false;
        if (trackName.length > 0 && text.length > 0) {
            addSlash = true;
        }
        SwTrack.all.trackEvent(
            "Drop down",
            "remove",
            trackName + (addSlash === true ? "/" : "") + text,
            swTrackValue,
        );
        onChange(null);
    };
    const onSelectItem = (item) => {
        if (item.inactive || item.disabled) {
            return;
        }
        //if upgrade link is clicked - don't select - redirect
        if (item.id === -2) {
            return;
        } else {
            // scope.selected = item.id;
            setSearch({ string: "" });
            onChange(item);
        }

        // tracking
        let selectedText = getSelectedText(swTrackName, item);
        const valueChanged = item.id != selectedItem?.id;
        let trackName = "";
        if (valueChanged) {
            if (selectedText === "forms.category.all") {
                trackName = "All Categories";
                selectedText = "";
            }
            let addSlash = false;
            if (trackName.length > 0 && selectedText.length > 0) {
                addSlash = true;
            }
            SwTrack.all.trackEvent(
                "Drop down",
                "click",
                trackName + (addSlash === true ? "/" : "") + selectedText,
                swTrackValue,
            );
        }
    };
    const selectedIds = selectedItem ? { [selectedItem.id]: true } : {};
    const selectedText = selectedItem?.title || selectedItem?.text;

    const buildItems = () => {
        return nestedFilter(items, search.string, showSearch).reduce((result, item, index) => {
            result.push(renderItem(item, item.id === selectedItem?.id, index));
            // child items
            item.children &&
                item.children.forEach((child, childIndex) => {
                    result.push(renderItem(child, child.id === selectedItem?.id, childIndex));
                });

            return result;
        }, []);
    };

    const onToggle = (isOpen) => {
        if (isOpen) {
            SwTrack.all.trackEvent("Drop down", "open", swTrackName, swTrackValue);
        }
    };

    // const buttonText = <> {showBetaLabel ? }</>
    return (
        <ChipDownContainer
            onCloseItem={removeSelection}
            buttonText={
                <span>
                    {i18nFilter()(placeholder)}
                    {isNew && (
                        <StyledPill backgroundColor={colorsPalettes.orange[400]} text="NEW" />
                    )}
                </span>
            }
            selectedText={i18nFilter()(selectedText)}
            disabled={disabled}
            selectedIds={selectedIds}
            onClick={onSelectItem}
            hasSearch={showSearch}
            searchFilter={searchFilter}
            searchPlaceHolder={""}
            width={width}
            onToggle={onToggle}
        >
            {buildItems()}
        </ChipDownContainer>
    );
};

ChipdownReact.defaultProps = {
    items: [],
    showSearch: false,
    appendToBody: false,
    emptySelect: false,
    maxWidth: "450px",
    minWidth: "200px",
    textAlign: "left",
    placeholder: "",
    onChange: void 0,
    swTrackName: "",
    swTrackValue: null,
    // default item to render
    renderItem: (item, isSelected, index) => {
        const label = item.text || item.title;
        const count = item.count ? <span>({numberFilter()(item.count)})</span> : null;
        return (
            <EllipsisDropdownItem
                key={index}
                id={item.id}
                text={label}
                selected={isSelected}
                disabled={item.disabled}
                iconName={item.icon}
                tooltipText={item.tooltipText}
                iconSize="sm"
            >
                {i18nFilter()(label)} {count}
            </EllipsisDropdownItem>
        );
    },
    isNew: false,
};

export default SWReactRootComponent(ChipdownReact, "DropdownReact");
