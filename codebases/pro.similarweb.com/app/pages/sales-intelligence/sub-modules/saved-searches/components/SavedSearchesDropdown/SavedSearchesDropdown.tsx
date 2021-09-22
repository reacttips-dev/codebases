import React from "react";
import { SavedSearchType } from "../../types";
import { useOnOutsideClick } from "../../../../hooks/useOnOutsideClick";
import SavedSearchesDropdownButton from "./SavedSearchesDropdownButton";
import SavedSearchesDropdownContent from "./SavedSearchesDropdownContent";

type SavedSearchesDropdownProps = {
    className?: string;
    savedSearch: SavedSearchType;
    savedSearches: SavedSearchType[];
    onSelect(savedSearch: SavedSearchType): void;
};

const SavedSearchesDropdown = (props: SavedSearchesDropdownProps) => {
    const { savedSearch, savedSearches, onSelect, className = null } = props;
    // State
    const [isOpen, setIsOpen] = React.useState(false);
    const [search, setSearch] = React.useState("");
    // Ref
    const dropdownScrollAreaRef = React.useRef(null);
    // Callbacks
    const openDropdown = React.useCallback(() => setIsOpen(true), []);
    const closeDropdown = React.useCallback(() => setIsOpen(false), []);
    const handleOutsideClick = React.useCallback(() => {
        if (isOpen) {
            closeDropdown();
        }
    }, [isOpen]);
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

    useOnOutsideClick(className, handleOutsideClick);

    return (
        <div className={className}>
            <SavedSearchesDropdownButton savedSearch={savedSearch} onClick={openDropdown} />
            <SavedSearchesDropdownContent
                isOpen={isOpen}
                search={search}
                onSelect={onSelect}
                onSearch={handleSearch}
                selectedSearch={savedSearch}
                savedSearches={savedSearches}
                setDropdownScrollAreaRef={setDropdownScrollAreaRef}
            />
        </div>
    );
};

export default SavedSearchesDropdown;
