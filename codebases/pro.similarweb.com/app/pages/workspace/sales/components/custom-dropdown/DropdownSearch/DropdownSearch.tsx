import React from "react";
import { Textfield } from "@similarweb/ui-components/dist/textfield";
import { StyledDropdownSearch, StyledSeparator } from "./styles";

type DropdownSearchProps = {
    value: string;
    open: boolean;
    placeholder: string;
    className?: string;
    onChange(v: string): void;
};

const DropdownSearch: React.FC<DropdownSearchProps> = ({
    open,
    value,
    placeholder,
    onChange,
    className = null,
}) => {
    const inputRef = React.useRef(null);

    React.useEffect(() => {
        if (open) {
            inputRef?.current?.inputRef?.focus?.();

            if (inputRef?.current?.inputRef?.value) {
                inputRef?.current?.setValue?.("");
                onChange("");
            }
        }
    }, [open, inputRef]);

    return (
        <StyledDropdownSearch className={className}>
            <StyledSeparator />
            <Textfield
                hideBorder
                ref={inputRef}
                iconName="search"
                onChange={onChange}
                defaultValue={value}
                placeholder={placeholder}
                dataAutomation="dropdown-search-input"
            />
        </StyledDropdownSearch>
    );
};

export default React.memo(DropdownSearch);
