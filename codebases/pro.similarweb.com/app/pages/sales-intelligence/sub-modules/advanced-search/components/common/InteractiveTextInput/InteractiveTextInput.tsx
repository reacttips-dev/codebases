import React from "react";
import { SWReactIcons } from "@similarweb/icons";
import { StyledInput, StyledFieldContainer, StyledIconContainer } from "./styles";

type InteractiveTextInputProps = {
    iconName?: string;
    className?: string;
    placeholder?: string;
    dataAutomation?: string;
    onAdd(code: string): void;
};

const InteractiveTextInput = (props: InteractiveTextInputProps) => {
    const {
        onAdd,
        placeholder,
        dataAutomation,
        className = null,
        iconName = "country-usage-rank",
    } = props;
    const inputRef = React.useRef(null);
    const [value, setValue] = React.useState("");

    const isValueValid = () => {
        return value.trim().length > 0;
    };

    const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && isValueValid()) {
            onAdd(value);
            setValue("");
        }

        if (e.key === "Escape") {
            setValue("");
            inputRef?.current?.blur();
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };

    return (
        <StyledFieldContainer className={className}>
            <StyledIconContainer>
                <SWReactIcons iconName={iconName} size="sm" />
            </StyledIconContainer>
            <StyledInput
                type="text"
                value={value}
                ref={inputRef}
                maxLength={20}
                onKeyUp={handleKeyUp}
                onChange={handleChange}
                placeholder={placeholder}
                data-automation={dataAutomation}
            />
        </StyledFieldContainer>
    );
};

export default InteractiveTextInput;
