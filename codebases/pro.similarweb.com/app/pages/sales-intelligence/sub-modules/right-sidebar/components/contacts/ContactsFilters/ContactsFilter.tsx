import React from "react";
import MultiChipDown from "components/MultiChipDown/src/MultiChipDown";
import { EllipsisDropdownItem } from "@similarweb/ui-components/dist/dropdown/src/items/EllipsisDropdownItem";
import { DEFAULT_FILTERS } from "pages/sales-intelligence/sub-modules/right-sidebar/constants/contacts";
import { StyledContactsFilterItem } from "./styles";
import { IChipItem } from "components/MultiChipDown/src/MultiChipDownTypes";
import { FilterOption } from "../../../types/contacts";
import {
    ContactsFilterBase,
    ContactsFiltersType,
} from "pages/sales-intelligence/sub-modules/contacts/store/types";

type ContactsFilterProps = {
    options: IChipItem[];
    buttonLabel: string;
    filterOptions: Record<string, unknown>;
    name: ContactsFiltersType;
    renderDropDownItem?: (option: FilterOption) => JSX.Element;
    onApply: (name: ContactsFiltersType, selected: ContactsFilterBase[]) => void;
    selectedItems: ContactsFilterBase[];
};

const ContactsFilter = (props: ContactsFilterProps) => {
    const {
        options,
        buttonLabel,
        filterOptions,
        name,
        renderDropDownItem,
        selectedItems,
        onApply,
    } = props;

    const [selectedIds, setSelectedIds] = React.useState(DEFAULT_FILTERS);

    React.useEffect(() => {
        const preparedSelectedIds = selectedItems.reduce((acc, item) => {
            acc[item.id] = true;
            return acc;
        }, {});

        setSelectedIds(preparedSelectedIds);
    }, [selectedItems]);

    const onDone = (selected: ContactsFilterBase[]) => {
        onApply(name, selected);
    };

    const getDropDownItem = (option: FilterOption) => {
        if (typeof renderDropDownItem === "function") {
            return renderDropDownItem(option);
        }
        return (
            <EllipsisDropdownItem key={option.id} id={option.id}>
                {option.text}
            </EllipsisDropdownItem>
        );
    };

    return (
        <StyledContactsFilterItem className={`contacts-filter-${name}`}>
            <MultiChipDown
                dropdownWidth={240}
                initialSelectedItems={selectedIds}
                buttonText={buttonLabel}
                options={options}
                getDropdownItem={getDropDownItem}
                onDone={onDone}
                clearSelectionWhenOneOption={false}
                {...filterOptions}
            />
        </StyledContactsFilterItem>
    );
};

export default ContactsFilter;
