import React from "react";
import { useOnOutsideClick } from "../../../../../hooks/useOnOutsideClick";
import { OpportunityListType } from "../../../../../sub-modules/opportunities/types";
import ListsDropdownButton from "../ListsDropdownButton/ListsDropdownButton";
import ListsDropdownContent from "../ListsDropdownContent/ListsDropdownContent";
import OpportunityListPageContext from "../../../context/OpportunityListPageContext";

export type OpportunityListsDropdownProps = {
    className: string;
    lists: OpportunityListType[];
    onSelect(list: OpportunityListType): void;
};

const OpportunityListsDropdown = (props: OpportunityListsDropdownProps) => {
    const { lists, onSelect, className } = props;

    const { list: selected } = React.useContext(OpportunityListPageContext);

    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState("");
    const dropdownScrollAreaRef = React.useRef(null);

    const openDropdown = React.useCallback(() => setOpen(true), []);
    const closeDropdown = React.useCallback(() => setOpen(false), []);
    const setDropdownScrollAreaRef = React.useCallback(
        (scrollArea) => {
            if (dropdownScrollAreaRef) {
                dropdownScrollAreaRef.current = scrollArea;
            }
        },
        [dropdownScrollAreaRef],
    );
    const handleSearch = React.useCallback(
        (search: string) => {
            if (dropdownScrollAreaRef.current) {
                dropdownScrollAreaRef.current.scrollYTo(0);
            }

            setSearch(search);
        },
        [setSearch],
    );

    useOnOutsideClick(className, () => {
        if (open) {
            closeDropdown();
        }
    });

    return (
        <div className={className}>
            <ListsDropdownButton list={selected} onClick={openDropdown} />
            <ListsDropdownContent
                open={open}
                lists={lists}
                search={search}
                onSelect={onSelect}
                onSearch={handleSearch}
                selectedList={selected}
                setDropdownScrollAreaRef={setDropdownScrollAreaRef}
            />
        </div>
    );
};

export default OpportunityListsDropdown;
