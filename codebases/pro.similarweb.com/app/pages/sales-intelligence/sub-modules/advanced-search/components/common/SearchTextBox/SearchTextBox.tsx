import React from "react";
import { debounce } from "lodash";
import { SWReactIcons } from "@similarweb/icons";
import { removeProtocolFromUrl } from "pages/sales-intelligence/helpers/helpers";
import {
    StyledSearchBox,
    StyledSearchInputContainer,
    StyledInput,
    StyledClearIconContainer,
} from "./styles";

type SearchTextBoxProps = {
    searchText: string;
    placeholder: string;
    isDisabled?: boolean;
    onChange(searchText: string): void;
};

const SearchTextBox = (props: SearchTextBoxProps) => {
    const { searchText, placeholder, isDisabled = false, onChange } = props;
    const [currentValue, setCurrentValue] = React.useState(searchText);
    const [isFocused, setIsFocused] = React.useState(false);

    const debouncedChangeHandler = React.useMemo(() => {
        return debounce(onChange, 400);
    }, [onChange]);

    const handleClearSearch = () => {
        onChange("");
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {
            target: { value },
        } = event;

        setCurrentValue(value);
        debouncedChangeHandler(value);
    };

    const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
        event.preventDefault();

        const pastedText = event.clipboardData.getData("text");
        const normalisedText = removeProtocolFromUrl(pastedText.trim());

        setCurrentValue(normalisedText);
        onChange(normalisedText);
    };

    React.useEffect(() => {
        if (searchText !== currentValue) {
            setCurrentValue(searchText);
        }
    }, [searchText]);

    return (
        <StyledSearchBox>
            <StyledSearchInputContainer isDisabled={isDisabled} isFocused={isFocused}>
                <SWReactIcons iconName="search" size="sm" />
                <StyledInput
                    type="text"
                    value={currentValue}
                    onPaste={handlePaste}
                    disabled={isDisabled}
                    onChange={handleChange}
                    placeholder={placeholder}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    data-automation="results-search-field"
                />
                {currentValue.length > 0 && (
                    <StyledClearIconContainer onClick={handleClearSearch}>
                        <SWReactIcons iconName="clear" size="xs" />
                    </StyledClearIconContainer>
                )}
            </StyledSearchInputContainer>
        </StyledSearchBox>
    );
};

export default SearchTextBox;
