import React, { useEffect, useRef, useState } from "react";
import { ChipDownContainer } from "@similarweb/ui-components/dist/dropdown";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { FooterButton } from "components/MultiCategoriesChipDown/src/MultiCategoryChipdownStyles";
import {
    SubDomainSelectionContainer,
    StyledTextContainer,
    StyledCheckboxContainer,
    StyledItemInnerWrapper,
    StyledEllipsisDropdownItem,
    StyledTrafficContainer,
} from "../styles";
import { FILTER_WIDTH, KEYS } from "../constants";
import { SubDomainFilterProps } from "../types";
import { Checkbox } from "@similarweb/ui-components/dist/checkbox";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { formatPercentageString } from "components/React/Table/cells/OrganicPaid";

const SELECT_ALL_BTN_ID = "allItemsSelectBtn";

export function SubDomainFilter({
    onSelect,
    data,
    onClear,
    disabled,
    appendTo,
    headerComponent,
}: SubDomainFilterProps) {
    const translate = useTranslation();

    const [showApply, setShowApply] = useState<boolean>(false);
    const [unselectedList, setUnselectedList] = useState<string[]>([]);
    const [unApplied, setUnApplied] = useState<string[]>([]);
    const [selectedIds, setSelectedIds] = useState<Record<string, boolean>[]>([]);
    const [numOfSelectedSubDomains, setNumOfSelectedSubDomains] = useState<number>(0);
    const [selectedName, setSelectedName] = useState<string>("");

    const chipDownRef = useRef(undefined);

    useEffect(() => {
        const optionsList = Object.keys(data);
        const numOfSelectedIds = optionsList.length - unselectedList.length;

        setNumOfSelectedSubDomains(numOfSelectedIds);

        const ids = optionsList.reduce((acc, item) => {
            if (unselectedList.includes(item)) {
                return acc;
            }
            acc.push({ [item]: true });
            return acc;
        }, []);

        setSelectedIds(ids);
    }, [unselectedList, data]);

    const clickHandler = (item: { id: string; text: string }) => {
        setShowApply(true);
        const internalUnselected = [...unselectedList];

        if (item.id === SELECT_ALL_BTN_ID) {
            unselectedList.length ? setUnselectedList([]) : setUnselectedList(Object.keys(data));
            return;
        }
        if (internalUnselected.includes(item?.id)) {
            const deleteIndex = internalUnselected.findIndex(
                (unselectedItem) => unselectedItem === item?.id,
            );
            internalUnselected.splice(deleteIndex, 1);
            setUnselectedList(internalUnselected);
            return;
        }

        internalUnselected.push(item?.id);
        setUnselectedList(internalUnselected);
        return;
    };

    const closeHandler = () => {
        onClear([]);
        setUnselectedList([]);
        setSelectedName("");
    };

    const toggleHandler = (_isOpen: boolean, isOutsideClick: boolean) => {
        if (showApply && isOutsideClick) {
            if (unselectedList.length !== unApplied.length) {
                setUnselectedList(unApplied);
            } else {
                setUnselectedList([]);
            }
        }
        setShowApply(false);
    };

    const applyHandler = () => {
        onSelect(selectedIds);
        setUnApplied(unselectedList);

        const firstSelected = selectedIds[0] ? Object.keys(selectedIds[0])[0] : "";
        const selectedText = firstSelected
            ? `${firstSelected} ${
                  numOfSelectedSubDomains > 1 ? `+${numOfSelectedSubDomains - 1}` : ""
              }`
            : ``;

        setSelectedName(selectedText);
        chipDownRef?.current?.closePopup();
    };

    const renderOptions = () => {
        const selectedAll = !unselectedList.length;
        const dataKeys = Object.keys(data);

        return [
            <StyledEllipsisDropdownItem
                selected={selectedAll}
                key={SELECT_ALL_BTN_ID}
                id={SELECT_ALL_BTN_ID}
                className="CustomCheckboxDropdownItem"
            >
                <StyledItemInnerWrapper>
                    <StyledTextContainer>{`All subdomains (${dataKeys.length})`}</StyledTextContainer>
                    <StyledCheckboxContainer>
                        <Checkbox label="" onClick={null} selected={selectedAll} />
                    </StyledCheckboxContainer>
                </StyledItemInnerWrapper>
            </StyledEllipsisDropdownItem>,
            ...dataKeys.map((name) => {
                const selected = unselectedList.includes(name);
                return (
                    <StyledEllipsisDropdownItem
                        selected={!selected}
                        key={name}
                        id={name}
                        text={name}
                        className="CustomCheckboxDropdownItem"
                    >
                        <StyledItemInnerWrapper>
                            <StyledTextContainer>
                                {name.length > 27 ? (
                                    <PlainTooltip
                                        maxWidth={260}
                                        placement="top"
                                        tooltipContent={name}
                                    >
                                        <span>{`${name}`}</span>
                                    </PlainTooltip>
                                ) : (
                                    name
                                )}
                            </StyledTextContainer>
                            {headerComponent && (
                                <StyledTrafficContainer>
                                    {formatPercentageString(data[name]?.share)}
                                </StyledTrafficContainer>
                            )}
                            <StyledCheckboxContainer>
                                <Checkbox label="" onClick={null} selected={!selected} />
                            </StyledCheckboxContainer>
                        </StyledItemInnerWrapper>
                    </StyledEllipsisDropdownItem>
                );
            }),
        ];
    };

    return (
        <SubDomainSelectionContainer>
            <ChipDownContainer
                appendTo={appendTo}
                onToggle={toggleHandler}
                disabled={disabled}
                ref={chipDownRef}
                onClick={clickHandler}
                selectedIds={selectedIds}
                selectedText={selectedName}
                closeOnItemClick={false}
                buttonText={`All subdomains (${numOfSelectedSubDomains})`}
                searchPlaceHolder={translate(KEYS.subdomainPlaceholder)}
                onCloseItem={closeHandler}
                hasSearch={false}
                width={FILTER_WIDTH}
                tooltipDisabled
                headerComponent={headerComponent}
                footerComponent={() =>
                    showApply && (
                        <FooterButton onClick={applyHandler} disabled={!selectedIds.length}>
                            {translate(KEYS.subdomainBtnApply)}
                        </FooterButton>
                    )
                }
            >
                {renderOptions()}
            </ChipDownContainer>
        </SubDomainSelectionContainer>
    );
}
