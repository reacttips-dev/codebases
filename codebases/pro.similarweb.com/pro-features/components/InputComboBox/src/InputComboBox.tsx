import { colorsPalettes } from "@similarweb/styles";
import { SearchInput } from "@similarweb/ui-components/dist/search-input";
import { ChipContainer, SimpleChipItem } from "@similarweb/ui-components/dist/chip";
import React, { Component } from "react";
import styled from "styled-components";

interface IInputComboBoxWrapperProps {
    chipsExist: boolean;
    disabled: boolean;
    isError: boolean;
}

export const InputComboBoxWrapper = styled.div<IInputComboBoxWrapperProps>`
    background-color: ${({ disabled }) =>
        disabled ? colorsPalettes.carbon[25] : colorsPalettes.carbon[0]};
    border: ${({ isError }) => (isError ? "solid 1px #ee6350" : "solid 1px #eceef0")};
    border-radius: 3px;

    .SearchInput-container {
        display: flex;
        margin-bottom: 0;

        input,
        input:disabled {
            width: 100%;
            margin-bottom: ${({ chipsExist }) => (chipsExist ? "8px" : "0")};
            border: none;
            box-shadow: none !important;
            background-color: transparent;
            transition: none;
        }

        input:focus {
            box-shadow: none !important;
            border: ${({ isError }) => (isError ? "solid 1px #ee6350" : "solid 1px #eceef0")};
            margin: -10px -10px -2px;
            padding: 14px 0px 14px 59px;
        }

        .SearchInput--error {
            box-shadow: none !important;
            border: none;
        }
    }

    > div,
    hr {
        margin: ${({ chipsExist }) => (chipsExist ? "8px" : "0")};
    }
`;
InputComboBoxWrapper.displayName = "InputComboBoxWrapper";

interface IInputComboBoxProps {
    values: string[];
    onAddItem: (any) => void;
    OnRemoveItem: (any) => void;
    placeholder: string;
    disabled?: boolean;
    searchIcon?: string;
    isError?: (any) => boolean;
    errorMsg?: string;
    additionalChipParams?: any;
    itemsComponent?: React.StatelessComponent;
    searchIconTooltipText?: string;
}

interface IInputComboBoxState {
    crrValue: string;
    shouldClearValue: boolean;
}

class InputComboBox extends Component<IInputComboBoxProps, IInputComboBoxState> {
    public static defaultProps = {
        isError: () => false,
        additionalChipParams: {},
        itemsComponent: SimpleChipItem,
    };

    constructor(props) {
        super(props);

        this.state = {
            crrValue: "",
            shouldClearValue: false,
        };
    }

    private onKeyUp = (event) => {
        switch (event.key) {
            case "Enter":
                if (!this.props.isError(this.state.crrValue)) {
                    this.props.onAddItem(this.state.crrValue);
                    this.clearValue();
                }
                break;
            case "Escape":
                this.clearValue();
                break;
        }
    };

    private clearValue() {
        this.setState({ crrValue: "", shouldClearValue: true });

        setTimeout(() => {
            this.setState({ shouldClearValue: false });
        });
    }

    public render() {
        const { crrValue, shouldClearValue } = this.state;
        const {
            values,
            isError,
            disabled,
            errorMsg,
            searchIcon,
            placeholder,
            OnRemoveItem,
            itemsComponent,
            additionalChipParams,
            searchIconTooltipText,
        } = this.props;

        const chipsItems = values.map((item) => ({
            text: item,
            key: `${item}CHIP`,
            onCloseItem: () => OnRemoveItem(item),
            ...additionalChipParams,
        }));

        const hasError = isError(crrValue);

        return (
            <InputComboBoxWrapper
                isError={hasError}
                disabled={disabled}
                chipsExist={chipsItems.length > 0}
            >
                <ChipContainer itemsComponent={itemsComponent}>{chipsItems}</ChipContainer>
                {chipsItems.length > 0 && <hr />}
                <SearchInput
                    isError={hasError}
                    disabled={disabled}
                    errorMsg={errorMsg}
                    onKeyUp={this.onKeyUp}
                    searchIcon={searchIcon}
                    placeholder={placeholder}
                    clearValue={shouldClearValue}
                    searchIconTooltipText={searchIconTooltipText}
                    onChange={(crrValue) => this.setState({ crrValue })}
                />
            </InputComboBoxWrapper>
        );
    }
}

export default InputComboBox;
