import { Button, IButtonProps } from "@similarweb/ui-components/dist/button";
import * as React from "react";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { StatelessComponent } from "react";
import { i18nFilter } from "../../../../app/filters/ngFilters";
import styled from "styled-components";

export const ButtonGroup = styled.div`
    display: flex;
    justify-content: flex-end;
    button:first-child {
        margin-right: 8px;
    }
`;

export interface IButtonWithTextProps extends IButtonProps {
    //We need text prop for 2 reasons:
    //1. When passing multiple buttons props - we need to define the label.
    //2. Enable to easily pass i18nKey from AngularJS template.
    text?: string;
}

interface IButtonsGroupProps {
    buttonsProps?: IButtonWithTextProps[];
}

export const ButtonsGroup: StatelessComponent<IButtonsGroupProps> = ({ buttonsProps }) => {
    const buttonsToRender = buttonsProps.map((buttonProps) => (
        //UpingDataComponentsing <I18n> adds <span> and breaks <Button> styles.
        <Button {...buttonProps}>{i18nFilter()(buttonProps.text)}</Button>
    ));
    return <ButtonGroup>{buttonsToRender}</ButtonGroup>;
};
export default SWReactRootComponent(ButtonsGroup, "ButtonsGroup");
