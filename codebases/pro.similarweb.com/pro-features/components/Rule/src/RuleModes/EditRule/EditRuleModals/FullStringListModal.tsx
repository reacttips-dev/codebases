import React from "react";
import { SWReactIcons } from "@similarweb/icons";
import { Input } from "@similarweb/ui-components/dist/boolean-search";
import { ScrollArea } from "@similarweb/ui-components/dist/react-scrollbar";
import { Checkbox } from "@similarweb/ui-components/dist/checkbox";
import { i18nFilter } from "filters/ngFilters";
import { IProModalCustomStyles, ProModal } from "components/Modals/src/ProModal";
import {
    BulkOperationBar,
    ModalContentWrapper,
    ModalTitle,
    SearchFilterContainer,
    StringItem,
} from "./styledComponents";

const FILTER_CHANGE_DEBOUNCE_TIME = 250;

const proModalStyles: IProModalCustomStyles = {
    content: {
        width: "520px",
        height: "420px",
        padding: "24px",
    },
};

interface IFullStringListModal {
    isOpen?: boolean;
    stringsList: string[];
    typeName: string;
    onRemoveStrings: (customStrings: string[]) => void;
    onClose: () => void;
}

export const FullStringListModal: React.FC<IFullStringListModal> = (props) => {
    const { isOpen = false, stringsList, typeName, onRemoveStrings, onClose } = props;

    const services = React.useMemo(
        () => ({
            i18n: i18nFilter(),
        }),
        [],
    );

    const [filterValue, setFilterValue] = React.useState("");
    const [inputFilterValue, setInputFilterValue] = React.useState("");
    const [checkedStrings, setCheckedStrings] = React.useState(new Set<string>());

    const sortedStringsList = React.useMemo(
        () => [...stringsList].sort(new Intl.Collator().compare),
        [stringsList],
    );

    const filteredStringsList = React.useMemo(
        () => sortedStringsList.filter((str) => str.indexOf(filterValue) !== -1),
        [sortedStringsList, filterValue],
    );

    const isAllFilteredSelected = React.useMemo(
        () =>
            checkedStrings.size >= filteredStringsList.length &&
            filteredStringsList.every((str) => checkedStrings.has(str)),
        [checkedStrings, filteredStringsList],
    );

    const filterChangeTimeoutRef = React.useRef(null);
    const onFilterChange = React.useCallback((evt) => {
        setInputFilterValue(evt.target.value);
        clearTimeout(filterChangeTimeoutRef.current);
        filterChangeTimeoutRef.current = setTimeout(() => {
            setFilterValue(evt.target.value);
        }, FILTER_CHANGE_DEBOUNCE_TIME);
    }, []);

    const onRemoveStringHandler = React.useCallback(
        (evt) => {
            const str = evt.currentTarget.closest(".stringRow").dataset.strValue;
            onRemoveStrings([str]);
        },
        [onRemoveStrings],
    );

    const onToggleCheckString = React.useCallback((evt) => {
        const str = evt.currentTarget.closest(".stringRow").dataset.strValue;
        setCheckedStrings((prevChecked) => {
            const newChecked = new Set(prevChecked);
            if (newChecked.has(str)) {
                newChecked.delete(str);
            } else {
                newChecked.add(str);
            }
            return newChecked;
        });
    }, []);

    const onToggleCheckFilteredStrings = React.useCallback(() => {
        setCheckedStrings((prevChecked) => {
            const newChecked = new Set(prevChecked);
            filteredStringsList.forEach((str) =>
                isAllFilteredSelected ? newChecked.delete(str) : newChecked.add(str),
            );
            return newChecked;
        });
    }, [filteredStringsList, isAllFilteredSelected]);

    const onRemoveSelectedHandler = React.useCallback(() => {
        onRemoveStrings(Array.from(checkedStrings));
        setCheckedStrings(new Set());
    }, [checkedStrings]);

    React.useEffect(() => {
        if (isOpen) {
            setFilterValue("");
            setInputFilterValue("");
            setCheckedStrings(new Set());
        }
    }, [isOpen]);

    React.useEffect(() => {
        setCheckedStrings((prevChecked) => {
            const newChecked = new Set(prevChecked);
            let isCheckedChanged = false;
            prevChecked.forEach((checkedStr) => {
                if (!stringsList.includes(checkedStr)) {
                    newChecked.delete(checkedStr);
                    isCheckedChanged = true;
                }
            });
            return isCheckedChanged ? newChecked : prevChecked;
        });
    }, [stringsList]);

    return (
        <ProModal isOpen={isOpen} onCloseClick={onClose} customStyles={proModalStyles}>
            <ModalContentWrapper>
                <ModalTitle>
                    {services.i18n("segmentWizard.stringsModal.title", { typeName })}
                </ModalTitle>
                <div className="bodyList">
                    <SearchFilterContainer>
                        <Input
                            placeholder={services.i18n(
                                "segmentWizard.stringsModal.search.placeholder",
                            )}
                            value={inputFilterValue}
                            onChange={onFilterChange}
                            autoFocus={true}
                        />
                        <SWReactIcons size="sm" iconName="search" />
                    </SearchFilterContainer>
                    <ScrollArea style={{ flex: "auto" }}>
                        <StringItem className="stringRow" isControllerRow={true}>
                            <div className="checkboxCell">
                                <Checkbox
                                    label=""
                                    selected={isAllFilteredSelected}
                                    onClick={onToggleCheckFilteredStrings}
                                />
                            </div>
                            <span>
                                {services.i18n("segmentWizard.stringModal.bulk.checkAll.text")}
                            </span>
                        </StringItem>
                        {filteredStringsList.map((str) => (
                            <StringItem key={str} className="stringRow" data-str-value={str}>
                                <div className="checkboxCell">
                                    <Checkbox
                                        label=""
                                        selected={checkedStrings.has(str)}
                                        onClick={onToggleCheckString}
                                    />
                                </div>
                                <span>{str}</span>
                                <a onClick={onRemoveStringHandler}>
                                    <SWReactIcons size="sm" iconName="delete" />
                                </a>
                            </StringItem>
                        ))}
                    </ScrollArea>
                </div>
                {checkedStrings.size > 0 && (
                    <BulkOperationBar>
                        <span>
                            {services.i18n("segmentWizard.stringModal.bulk.countSelected", {
                                count: checkedStrings.size,
                            })}
                        </span>
                        <a onClick={onRemoveSelectedHandler}>
                            {services.i18n("segmentWizard.stringModal.bulk.btn.removeSelected")}
                        </a>
                    </BulkOperationBar>
                )}
            </ModalContentWrapper>
        </ProModal>
    );
};
