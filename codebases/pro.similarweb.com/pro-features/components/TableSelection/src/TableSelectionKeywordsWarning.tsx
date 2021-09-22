import { SWReactIcons } from "@similarweb/icons";
import { colorsPalettes, rgba } from "@similarweb/styles";
import { setFont } from "@similarweb/styles/src/mixins";
import { Button, ButtonLabel } from "@similarweb/ui-components/dist/button";
import * as React from "react";
import { StatelessComponent } from "react";
import styled from "styled-components";
import { ButtonGroup } from "../../ButtonsGroup/src/ButtonsGroup";
import I18n from "../../WithTranslation/src/I18n";
import { TableSelectionContainer } from "./StyledComponents";

interface ITableSelectionKeywordsWarningProps {
    message: string;
    onCancel: () => void;
}

const Message = styled.div`
    display: flex;
    align-items: center;
    ${setFont({ $size: 14, $color: rgba(colorsPalettes.carbon[500], 0.8) })};
    margin-bottom: 57px;
`;
const ErrorIcon = styled(SWReactIcons).attrs({
    iconName: "alert-circle",
    size: "sm",
})`
    flex-grow: 0;
    flex-shrink: 0;
    margin-right: 5px;
    svg {
        path {
            fill: ${colorsPalettes.red["s100"]};
        }
    }
`;

const MessageText = styled.div`
    flex-grow: 1;
`;

export const TableSelectionKeywordsWarning: StatelessComponent<ITableSelectionKeywordsWarningProps> = ({
    message,
    onCancel,
}) => {
    return (
        <TableSelectionContainer>
            <Message>
                <ErrorIcon />
                <MessageText>{message}</MessageText>
            </Message>
            <ButtonGroup>
                <Button type="flat" onClick={onCancel}>
                    <ButtonLabel>
                        <I18n>table.selection.newgroup.cancel</I18n>
                    </ButtonLabel>
                </Button>
            </ButtonGroup>
        </TableSelectionContainer>
    );
};

TableSelectionKeywordsWarning.displayName = "TableSelectionKeywordsWarning";
TableSelectionKeywordsWarning.defaultProps = {
    message: "",
    onCancel: () => null,
};
