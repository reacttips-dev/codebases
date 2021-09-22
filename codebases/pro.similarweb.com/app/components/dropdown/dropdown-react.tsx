import { SWReactIcons } from "@similarweb/icons";
import { colorsPalettes, mixins } from "@similarweb/styles";
import {
    Dropdown,
    EllipsisDropdownItem,
    NoBorderButton,
} from "@similarweb/ui-components/dist/dropdown";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { numberFilter, i18nFilter } from "filters/ngFilters";
import React, { ReactElement } from "react";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import styled from "styled-components";

const DropdownWrapper = styled.div<{ size?: number; weight?: number; color?: string }>`
    margin-top: -6px;

    // selects the dropdown placeholder text.
    .dropdown-borderless.no-border-button > div:first-child {
        ${({ size = 20, weight = 500, color = colorsPalettes.blue["400"] }) =>
            mixins.setFont({ $size: size, $color: color, $weight: weight })};
        margin-left: 4px;
        transition: color ease-in-out 200ms;
    }
    // selects the dropdown placeholder icon (arrow).
    ${SWReactIcons} {
        transition: color ease-in-out 200ms;
        path {
            fill: ${(color) => (color ? color : colorsPalettes.blue["400"])};
        }
    }
    &:hover {
        .dropdown-borderless.no-border-button > div:first-child {
            color: ${(color) => (color ? color : colorsPalettes.blue["500"])};
        }
        ${SWReactIcons} {
            path {
                fill: ${(color) => (color ? color : colorsPalettes.blue["500"])};
            }
        }
    }
`;

interface IProps {
    items: Array<{
        text?: string;
        title?: string;
        id: string | number;
        count?: number;
        disabled?: boolean;
    }>;
    selected?: string | number;
    placeholder?: string;
    contactFormIsVisible?: boolean;
    onChange: (item) => void;
    className?: string;
    swTrackName?: string;
    swTrackValue?: number;
    maxWidth?: string | number;
    minWidth?: string | number;
    emptySelect?: boolean;
    disabled?: boolean;
    appendToBody?: boolean;
    width?: string | number;
    textAlign?: string;
    renderItem?: (item, isSelected, index) => ReactElement;
    isNew?: boolean;
    titleColor?: string;
    titleSize?: number;
    titleWeight?: number;
}

function getSelectedText(trackName, item) {
    let text;
    switch (trackName) {
        // SIM-5748 special case for widget metrics
        case "Metric":
            text = item.id;
            break;
        // SIM-5748 special case for subdomains
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

export const DropdownReact: React.FunctionComponent<IProps> = ({
    swTrackName,
    selected,
    items,
    onChange,
    placeholder,
    disabled,
    titleColor,
    titleSize,
    titleWeight,
    renderItem,
    swTrackValue,
    width,
    isNew,
    className,
}) => {
    const selectedItem = getSelectedItem(items, selected);

    const onSelectItem = (item) => {
        if (item.inactive || item.disabled) {
            return;
        }
        // if upgrade link is clicked - don't select - redirect
        if (item.id === -2) {
            return;
        } else {
            // scope.selected = item.id;
            onChange(item);
        }

        // tracking
        const selectedText = getSelectedText(swTrackName, item);
        const valueChanged = item.id != selectedItem?.id;
        const trackName = swTrackName ? swTrackName : "";
        if (valueChanged) {
            let addSlash = false;
            if (swTrackName.length > 0 && selectedText.length > 0) {
                addSlash = true;
            }
            TrackWithGuidService.trackWithGuid(
                "websiteAnalysis.overview.websitePerformance.topSearchTerms.dropdown",
                "click",
                { trackName: trackName + (addSlash === true ? "/" : "") + selectedText },
            );
        }
    };
    const selectedIds = selectedItem ? { [selectedItem.id]: true } : {};
    const selectedText = selectedItem?.title || selectedItem?.text || (placeholder && placeholder);

    const buildItems = () => {
        return items.reduce((result, item, index) => {
            result.push(renderItem(item, item.id === selectedItem?.id, index));

            return result;
        }, []);
    };

    const onToggle = (isOpen) => {
        if (isOpen) {
            TrackWithGuidService.trackWithGuid(
                "websiteAnalysis.overview.websitePerformance.topSearchTerms.dropdown",
                "open",
                { trackName: swTrackName },
            );
        }
    };

    return (
        <DropdownWrapper
            size={titleSize}
            weight={titleWeight}
            color={titleColor}
            className={"dropdown-borderless--wrapper"}
        >
            <Dropdown
                onClick={onSelectItem}
                onToggle={onToggle}
                selectedIds={selectedIds}
                disabled={disabled}
                buttonWidth={"auto"}
                width={width}
                dropdownPopupPlacement={"ontop-left"}
                cssClassContainer={`DropdownContent-container dropdown-borderless--container ${className}`}
            >
                {[
                    <NoBorderButton
                        key={"dropdown-borderless--no-border-button"}
                        isPlaceholder={false}
                        disabled={disabled}
                        className={"dropdown-borderless no-border-button"}
                    >
                        {i18nFilter()(selectedText)}
                    </NoBorderButton>,
                    ...buildItems(),
                ]}
            </Dropdown>
        </DropdownWrapper>
    );
};

DropdownReact.defaultProps = {
    items: [],
    appendToBody: false,
    emptySelect: false,
    maxWidth: "450px",
    minWidth: "200px",
    width: "auto",
    textAlign: "left",
    placeholder: "",
    onChange: void 0,
    swTrackName: "",
    swTrackValue: null,
    // default item to render
    renderItem: (item, isSelected) => {
        const label = item.text || item.title;
        const count = item.count ? <span>({numberFilter()(item.count)})</span> : null;
        return (
            <EllipsisDropdownItem
                key={item.id}
                id={item.id}
                text={label}
                selected={isSelected}
                iconName={item.icon}
                tooltipText={item.tooltipText}
                disabled={item.disabled}
                iconSize="sm"
            >
                {i18nFilter()(label)} {count}
            </EllipsisDropdownItem>
        );
    },
    isNew: false,
};

export default SWReactRootComponent(DropdownReact, "DropdownBorderless");
