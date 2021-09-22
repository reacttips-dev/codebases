import React from "react";
import { ChipContainer } from "@similarweb/ui-components/dist/chip";
import { Dropdown, DropdownButton } from "@similarweb/ui-components/dist/dropdown";
import ContactUsItemWrap from "components/React/ContactUs/ContactUsItemWrap";
import { i18nFilter } from "filters/ngFilters";
import { allTrackers } from "services/track/track";
import { LeadGeneratorChipsWrapper } from "./elements";

interface ILeadGeneratorChipsProps {
    value: any;
    onChange: (newItemList: any[], item?: any) => void;
    placeholder: string;
    placeholderKey?: string;
    type: string;
    ChipsComponent: any;
    items: string[];
    getDropDownProps: () => any;
    getDropDownButtonProps?: () => any;
}

const LeadGeneratorChips: React.FC<ILeadGeneratorChipsProps> = ({
    value,
    onChange,
    placeholder,
    type,
    placeholderKey,
    items,
    getDropDownProps,
    getDropDownButtonProps,
    ChipsComponent,
}) => {
    const onClickDropdownItem = (item) => {
        if (value.find((val) => val.id === item.id)) {
            onChange(
                value.filter((val) => val.id !== item.id),
                item,
            );
            allTrackers.trackEvent("Drop down", "click", `${type}/remove/${item.text}`);
        } else {
            onChange([...value, item], item);
            allTrackers.trackEvent("Drop down", "click", `${type}/add/${item.text}`);
        }
    };

    const selectedIds = value.reduce((all, item) => {
        return {
            ...all,
            [item.id]: true,
        };
    }, {});

    const onRemoveChip = (item) => {
        onChange(
            value.filter((val) => val !== item),
            item,
        );
        allTrackers.trackEvent("Drop down", "click", `${type}/remove/${item.text}`);
    };

    const chipsItems = value
        .filter(({ id }) => id)
        .map((item) => ({
            text: item.text,
            icon: item.isChild ? item.parentItem.icon : item.icon,
            id: item.id,
            key: `${item.id}CHIP`,
            onCloseItem: () => onRemoveChip(item),
        }));

    const onToggle = (isOpen) => {
        const state = isOpen ? "open" : "close";
        allTrackers.trackEvent("Drop down", state, `${type} list`);
    };

    const getFinalDropDownProps = () => ({
        selectedIds,
        hasSearch: true,
        onClick: onClickDropdownItem,
        closeOnItemClick: false,
        onToggle,
        itemWrapper: ContactUsItemWrap,
        searchPlaceHolder: i18nFilter()(
            `grow.lead_generator.chips.search_placeHolder.${placeholderKey}`,
        ),
        dropdownPopupMinScrollHeight: 48,
        dropdownPopupHeight: 432,
        ...getDropDownProps(),
    });

    return (
        <LeadGeneratorChipsWrapper showBorder={chipsItems.length > 0}>
            <ChipContainer itemsComponent={ChipsComponent}>{chipsItems}</ChipContainer>
            {chipsItems.length > 0 && <hr />}
            <Dropdown {...getFinalDropDownProps()}>
                {[
                    <DropdownButton key="DropdownButton1" {...getDropDownButtonProps()}>
                        {placeholder}
                    </DropdownButton>,
                    ...items,
                ]}
            </Dropdown>
        </LeadGeneratorChipsWrapper>
    );
};

LeadGeneratorChips.defaultProps = {
    items: [],
    getDropDownProps: () => ({}),
    getDropDownButtonProps: () => ({}),
};

export default LeadGeneratorChips;
