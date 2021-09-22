import React, { useEffect, useRef, useState } from "react";
import { EllipsisDropdownItem, ChipDownContainer } from "@similarweb/ui-components/dist/dropdown";
import { ChipdownSelectPropsType } from "./types";
import { SWReactIcons } from "@similarweb/icons";
import {
    StyledRow,
    StyledItemWrapper,
    StyledCol,
    StyledIconWrapper,
    StyledTextWrapper,
    StyledOptionDescription,
    PlaceholderLoaderStyle,
    StyledChipDownWrapper,
} from "./styles";
import { getSelectedText } from "./utils";
import { useTranslation } from "components/WithTranslation/src/I18n";

/**
 * @date 2021-03-24
 * @param {function} {onClick} click function handler
 * @param {boolean} hasSearch default = false
 * @param {string} width string width value
 * @param {string} popupHeight string height value
 * @param {array} options array of objects with id and text required fields
 * @param {string} itemClassName css class name
 * @param {boolean} disabled disabled state
 * @param {string} selectedItemId selected INTERNAL id from options array
 * @param {string} wrapperClassName css class for wrapper
 * @param {string} IconComponent icon component for dropdown
 * @param {string, React.component} appendTo css class of item to append current ChipdownSelect
 * @param {{}} itemStyles inline styles for item
 * @returns {} React.ReactNode
 */
export const ChipdownSelect = ({
    onClick,
    hasSearch = false,
    width,
    options,
    itemClassName,
    disabled,
    selectedItemId,
    wrapperClassName = "",
    itemStyles,
    popupHeight = 320,
    loading,
    appendTo,
    IconComponent,
}: ChipdownSelectPropsType) => {
    const [selectedText, setSelectedText] = useState("");
    const translate = useTranslation();

    const renderOptions = options.map(({ icon, text, id, description }) => (
        <StyledItemWrapper key={id}>
            <EllipsisDropdownItem id={id} text={text} selected={Number(selectedItemId) === id}>
                <StyledRow style={itemStyles} className={itemClassName}>
                    {icon && (
                        <StyledIconWrapper>
                            <SWReactIcons size="sm" iconName={icon} />
                        </StyledIconWrapper>
                    )}
                    <StyledCol>
                        <StyledTextWrapper>{translate(text)}</StyledTextWrapper>
                        {description && (
                            <StyledOptionDescription>
                                {translate(description)}
                            </StyledOptionDescription>
                        )}
                    </StyledCol>
                </StyledRow>
            </EllipsisDropdownItem>
        </StyledItemWrapper>
    ));

    useEffect(() => {
        const textValue = getSelectedText(selectedItemId, options);
        setSelectedText(textValue);
    }, [selectedItemId]);

    return (
        <StyledChipDownWrapper className={wrapperClassName}>
            <ChipDownContainer
                appendTo={appendTo}
                width={width}
                hasSearch={hasSearch}
                selectedText={translate(selectedText)}
                buttonText={
                    loading ? <PlaceholderLoaderStyle width={45} height={17} /> : selectedText
                }
                onClick={onClick}
                onCloseItem={() => onClick(null)}
                disabled={disabled}
                tooltipDisabled
                dropdownPopupHeight={popupHeight}
                IconComponent={IconComponent}
            >
                {renderOptions}
            </ChipDownContainer>
        </StyledChipDownWrapper>
    );
};
