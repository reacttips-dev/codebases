import { IconButton } from "@similarweb/ui-components/dist/button";
import {
    Dropdown,
    DropdownButton,
    SimpleDropdownItem,
} from "@similarweb/ui-components/dist/dropdown";
import { TablePager } from "@similarweb/ui-components/dist/table-pager";
import { Textfield } from "@similarweb/ui-components/dist/textfield";
import React from "react";
import { availableSearchTypes } from "./constants";
import { FiltersContainer, PagerContainer, SearchContainer } from "./styledComponents";

const DEBOUNCE_TIMEOUT_SET_PAGE = 500;

export const ProfilesFilters = (props) => {
    const { onFiltersChange, page, search, srType } = props;

    const [displayPage, setDisplayPage] = React.useState(1);
    const [displaySrTypeObj, setDisplaySrTypeObj] = React.useState(null);
    const searchValueRef = React.useRef(null);

    // update display filters according to params
    React.useEffect(() => {
        setDisplayPage(page);
        searchValueRef.current?.setValue(search);
        if (!displaySrTypeObj || search) {
            // change srType for display only if search value is not empty
            setDisplaySrTypeObj(availableSearchTypes.find((sr) => sr.id === srType));
        }
    }, [page, search, srType]);

    // function to set page
    const debounceSetPageTimeout = React.useRef(null);
    const setPage = React.useCallback(
        (toPage) => {
            setDisplayPage(toPage);
            clearTimeout(debounceSetPageTimeout.current);
            if (toPage !== page) {
                debounceSetPageTimeout.current = setTimeout(() => {
                    onFiltersChange({ page: toPage });
                }, DEBOUNCE_TIMEOUT_SET_PAGE);
            }
        },
        [onFiltersChange, page],
    );

    // function to handle search params update
    const updateSearch = React.useCallback(
        (searchValue, searchType) => {
            onFiltersChange({
                search: searchValue,
                srType: searchType,
                page: undefined,
                pageSize: undefined,
            });
        },
        [onFiltersChange],
    );

    // function to handle search key up
    const handleSearchKeyUp = React.useCallback(
        (evt) => {
            if (evt.key === "Enter" || evt.which === 13) {
                updateSearch(searchValueRef.current?.getValue(), displaySrTypeObj.id);
            }
        },
        [updateSearch, searchValueRef, displaySrTypeObj],
    );

    // function to handle search click
    const handleSearchClick = React.useCallback(
        (evt) => {
            updateSearch(searchValueRef.current?.getValue(), displaySrTypeObj.id);
        },
        [updateSearch, searchValueRef, displaySrTypeObj],
    );

    const handleSearchClear = React.useCallback(
        (evt) => {
            updateSearch(undefined, undefined);
        },
        [updateSearch],
    );

    return (
        <FiltersContainer>
            <SearchContainer>
                <Textfield
                    ref={searchValueRef}
                    iconName="search"
                    placeholder={`Search${displaySrTypeObj ? ` by ${displaySrTypeObj.title}` : ""}`}
                    onKeyUp={handleSearchKeyUp}
                    defaultValue={search || ""}
                />
                <Dropdown
                    selectedIds={{ [displaySrTypeObj?.id]: true }}
                    onClick={({ id }) =>
                        setDisplaySrTypeObj(availableSearchTypes.find((sr) => sr.id === id))
                    }
                    width={180}
                    buttonWidth={180}
                    appendTo="body"
                >
                    {[
                        <DropdownButton key="dropdownButton0" cssClass="srTypeDropdownButton">
                            {displaySrTypeObj ? `by ${displaySrTypeObj.title}` : "select type..."}
                        </DropdownButton>,
                        ...availableSearchTypes.map((sr) => (
                            <SimpleDropdownItem
                                key={sr.id}
                                id={sr.id}
                                className="srTypeDropdownItem"
                            >
                                {sr.title}
                            </SimpleDropdownItem>
                        )),
                    ]}
                </Dropdown>
                <IconButton
                    className="srIconButtonCircle"
                    type="outlined"
                    iconSize="xs"
                    iconName="arrow-right"
                    onClick={handleSearchClick}
                />
                {(!!search || page > 1) && (
                    <IconButton
                        className="srIconButtonReset"
                        type="flat"
                        placement="right"
                        iconSize="xs"
                        iconName="home"
                        onClick={handleSearchClear}
                    >
                        reset
                    </IconButton>
                )}
            </SearchContainer>
            <PagerContainer>
                <TablePager
                    page={displayPage}
                    pages={null}
                    gotoPage={setPage}
                    labels={{
                        prevPage: "Previous page",
                        nextPage: "Next page",
                        of: "",
                        page: "Page",
                    }}
                />
            </PagerContainer>
        </FiltersContainer>
    );
};
