import { colorsPalettes, mixins, rgba } from "@similarweb/styles";
import { IconButton } from "@similarweb/ui-components/dist/button";
import {
    IPopupWrapperProps,
    PopupClickContainer,
} from "@similarweb/ui-components/dist/popup-click-container";
import { FunctionComponent, ReactNode } from "react";
import * as React from "react";
import styled from "styled-components";
import { FlexColumn, FlexRow } from "../../../styled components/StyledFlex/src/StyledFlex";

interface IActionableTooltipProps {
    title: string;
    text: string;
    button?: any;
    onClose?: VoidFunction;
    children: ReactNode;
    initialIsOpen?: boolean;
    placement?: string;
    width?: number;
}

export const ActionableTooltip: FunctionComponent<IActionableTooltipProps> = ({
    children,
    initialIsOpen,
    title,
    button,
    onClose,
    width,
    text,
}) => {
    const [isOpen, setIsOpen] = React.useState(initialIsOpen);
    const popupConfig = {
        placement: "bottom",
        width,
        defaultOpen: true,
        cssClassContainer: "Popup-element-wrapper-triangle",
        cssClassContent: "Popup-content--pro",
        enabled: isOpen,
    };
    const onCloseClick = () => {
        setIsOpen(false);
        onClose();
    };
    return (
        <PopupClickContainer
            content={() => (
                <ActionableTooltipContent
                    title={title}
                    button={button}
                    onClose={onCloseClick}
                    text={text}
                />
            )}
            config={popupConfig}
        >
            {children}
        </PopupClickContainer>
    );
};

ActionableTooltip.defaultProps = {
    initialIsOpen: true,
    placement: "bottom",
    width: 412,
    onClose: () => null,
};

const Container = styled.div``;
const Content = styled.div`
    padding: 24px 17px 32px 24px;
`;
const Footer = styled(FlexRow)`
    flex-direction: row-reverse;
    border-top: 1px solid ${colorsPalettes.midnight[50]};
    height: 48px;
    align-items: center;
    padding: 0 8px;
`;
const TitleContainer = styled(FlexRow)`
    margin-bottom: 20px;
    justify-content: space-between;
    svg {
        width: 100%;
        height: 100%;
    }
    > button {
        flex-shrink: 0;
        margin-left: 20px;
    }
`;
const Title = styled.div`
    ${mixins.setFont({ $size: 16, $weight: 500, $color: colorsPalettes.carbon[500] })};
    line-height: 24px;
`;
const Text = styled.div`
    ${mixins.setFont({ $size: 14, $color: rgba(colorsPalettes.carbon[500], 0.8) })};
    line-height: 23px;
`;

const ActionableTooltipContent: FunctionComponent<any> = ({ button, title, onClose, text }) => {
    return (
        <Container>
            <Content>
                <TitleContainer>
                    <Title>{title}</Title>
                    <IconButton onClick={onClose} type="flat" iconName="close" iconSize="xs" />
                </TitleContainer>
                <Text>{text}</Text>
            </Content>
            {button && <Footer>{button}</Footer>}
        </Container>
    );
};
