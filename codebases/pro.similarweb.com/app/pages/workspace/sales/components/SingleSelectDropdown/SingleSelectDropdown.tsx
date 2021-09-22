import React from "react";
import classNames from "classnames";
import { DropdownButton } from "@similarweb/ui-components/dist/dropdown";
import { PixelPlaceholderLoader } from "@similarweb/ui-components/dist/placeholder-loaders";
import {
    StyledOptionDescription,
    StyledDropdownItem,
    StyledButton,
    StyledSingleDropdown,
    StyledDropdownButton,
} from "./styles";
import { SingleSelectDropdownPropsType } from "./types";

/**
 * @param {function} onClick
 * @param {string} width
 * @param {string} selectedIcon selected icon
 * @param {string} selectedText selected text from options
 * @param {{ text: string; description?: string; icon?: string }[]} options provide prepared options like given
 * @param {string} dropdownPopupPlacement default="bottom-right"
 * @param {string} btnType default="primary"
 * @param {boolean} isLoading loading state
 * @param {boolean} noHover disable default hovering state
 * @param {string} buttonWidth button width
 * @param {boolean} renderDropdownBtn use dropdownButton component or not for button
 * @param {boolean} withLoader show loader when loading
 * @param {string} itemClassName option item css class
 * @param {string} dropdownClassName dropdown container css class
 * @returns {SingleSelectDropdown} JSX.Element || React.Node
 */

export const SingleSelectDropdown = ({
    onClick,
    disabled,
    width,
    minWidth,
    options,
    dropdownPopupPlacement,
    btnType = "primary",
    itemClassName,
    dropdownClassName,
    selectedText,
    isLoading,
    noHover,
    buttonWidth,
    renderDropdownBtn,
    withLoader,
    appendTo,
}: SingleSelectDropdownPropsType): JSX.Element => {
    const handleClick = (selectedOption: { children: { props: { selected: boolean } } }) => {
        if (!selectedOption?.children?.props?.selected) {
            return onClick(selectedOption);
        }
    };

    const renderBtn = (): JSX.Element => {
        if (withLoader && isLoading) {
            return <PixelPlaceholderLoader width={buttonWidth} height={10} />;
        }
        return renderDropdownBtn ? (
            <StyledDropdownButton className="single-select-btn">
                <DropdownButton minWidth={minWidth} width={buttonWidth} disabled={isLoading}>
                    {selectedText}
                </DropdownButton>
            </StyledDropdownButton>
        ) : (
            <StyledButton
                className={classNames({ noHover, "single-select-btn": true })}
                key="main-benchmark-type-select-btn"
                type={btnType}
            >
                {selectedText}
            </StyledButton>
        );
    };

    const renderOptions = [renderBtn()].concat(
        ...options.map(({ id, text, description, icon }) => (
            <span key={id}>
                <StyledDropdownItem
                    selected={text === selectedText}
                    id={id}
                    iconName={icon}
                    className={itemClassName}
                    key={id}
                >
                    <div>{text}</div>
                    {description && (
                        <StyledOptionDescription>{description}</StyledOptionDescription>
                    )}
                </StyledDropdownItem>
            </span>
        )),
    );

    return (
        <StyledSingleDropdown
            appendTo={appendTo}
            width={width}
            buttonWidth={buttonWidth}
            disabled={isLoading || disabled}
            className={classNames(dropdownClassName)}
            onClick={handleClick}
            dropdownPopupPlacement={dropdownPopupPlacement}
        >
            {renderOptions}
        </StyledSingleDropdown>
    );
};
