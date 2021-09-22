import * as React from "react";
import * as PropTypes from "prop-types";
import {
    Dropdown,
    SimpleNoSelectionDropdownItem,
    EllipsisDropdownButton,
} from "@similarweb/ui-components/dist/dropdown";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { i18nFilter } from "filters/ngFilters";

const EllipsisUtilityContainer: React.StatelessComponent<any> = ({
    onClick,
    onToggle,
    items,
    options,
}) => {
    const ellipsisItems = {
        pdf: {
            id: "pdf",
            iconClass: "icon sw-icon-download-pdf",
            disabled: false,
            text: i18nFilter()("directives.csv.downloadPDF"),
        },
        excel: {
            id: "excel",
            iconClass: "icon sw-icon-download-excel",
            disabled: options.isHaveBanner() || !options.isExcelAllowed,
            text: i18nFilter()("directives.csv.downloadCSV"),
        },
        png: {
            id: "png",
            iconClass: "icon sw-icon-download-png",
            disabled: options.isHaveBanner(),
            text: i18nFilter()("directives.csv.downloadPNG"),
        },
        dashboard: {
            id: "dashboard",
            iconClass: "icon sw-icon-plus-new",
            disabled: false,
            text: i18nFilter()("directives.csv.addDashoboard"),
        },
    };

    const onItemClick = (newItem) => {
        onClick(newItem);
    };

    const onEllipsisToggle = (isOpen) => {
        onToggle(isOpen);
    };

    const dropdownItems = [
        <EllipsisDropdownButton key="EllipsisDropdownButton" />,
        ...items.map((item) => {
            return {
                ...ellipsisItems[item.id],
                ...item,
            };
        }),
    ];
    return (
        <Dropdown
            onClick={onItemClick}
            onToggle={onEllipsisToggle}
            itemsComponent={SimpleNoSelectionDropdownItem}
            width={180}
            cssClassContainer="DropdownContent-container bottom"
        >
            {dropdownItems}
        </Dropdown>
    );
};

EllipsisUtilityContainer.propTypes = {
    items: PropTypes.arrayOf(PropTypes.object),
    onClick: PropTypes.func.isRequired,
    trackName: PropTypes.string,
};

EllipsisUtilityContainer.defaultProps = {
    items: [],
};

SWReactRootComponent(EllipsisUtilityContainer, "EllipsisUtilityContainer");
export default EllipsisUtilityContainer;
