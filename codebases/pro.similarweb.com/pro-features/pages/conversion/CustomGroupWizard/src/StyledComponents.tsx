import React from "react";
import styled from "styled-components";

import { colorsPalettes } from "@similarweb/styles";
import { Button } from "@similarweb/ui-components/dist/button";
import { ICountryDropdownItem } from "@similarweb/ui-components/dist/dropdown";

export const RowElement = styled.div`
    margin: 12px 0;
`;
RowElement.displayName = "RowElement";

export const WizardLayout = styled.div`
    display: flex;
    flex-direction: column;

    min-width: 960px;
    margin: 24px;
`;
WizardLayout.displayName = "WizardLayout";

export const FiltersBox = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;

    height: auto;
    width: 100%;

    padding: 24px;

    box-sizing: border-box;

    .SearchInput {
        width: 286px; /* actual width 340px */

        margin-bottom: 0;

        background-color: ${colorsPalettes.carbon[0]};
    }
    .SearchInput-container {
        width: 340px;

        margin-bottom: 0;
        margin-right: 12px;
    }
`;
FiltersBox.displayName = "FiltersBox";

export const DropdownContainer = styled.div`
    width: 200px;

    margin: 0 12px;

    .DropdownButton {
        background-color: ${colorsPalettes.carbon[0]};
        color: ${colorsPalettes.black[0]};

        &--opened {
            color: ${colorsPalettes.black[0]};
        }
    }
`;
DropdownContainer.displayName = "DropdownContainer";

export const CheckboxContainer = styled.div`
    margin: 0 12px;
`;
CheckboxContainer.displayName = "CheckboxContainer";

export const WhiteButton = styled(Button)`
    background-color: ${colorsPalettes.carbon[0]};
`;
WhiteButton.displayName = "WhiteButton";

export const ConfirmationDialogWrapper = styled.div`
    display: flex;
    flex-direction: column;

    padding: 8px;
`;
ConfirmationDialogWrapper.displayName = "ConfirmationDialogWrapper";

export const ConfirmationButtons = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;

    padding: 0;

    .Button {
        margin-left: 8px;
    }
`;
ConfirmationButtons.displayName = "ConfirmationButtons";

export const ConfirmationTitle = styled.div`
    width: 100%;

    font-size: 16px;

    padding-bottom: 16px;

    border-bottom: 1px solid ${colorsPalettes.carbon[50]};
`;
ConfirmationTitle.displayName = "ConfirmationTitle";

export const ConfirmationContent = styled.div`
    padding: 16px 0;
`;
ConfirmationContent.displayName = "ConfirmationContent";

export interface ICountryItemWrapper extends ICountryDropdownItem {
    isAvailable: boolean;
}

export const CountryItemWrapper = styled.span.attrs(({ isAvailable }: ICountryItemWrapper) => ({
    isAvailable: isAvailable ?? true,
}))`
    ${({ isAvailable }) =>
        !isAvailable
            ? `
    .CountryDropdownItem {
        opacity: .5;
    }
    `
            : ""}
`;
CountryItemWrapper.displayName = "CountryItemWrapper";
