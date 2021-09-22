import * as React from "react";
import styled, { css } from "styled-components";
import { FunctionComponent } from "react";
import { colorsPalettes, mixins, rgba } from "@similarweb/styles";
import * as propTypes from "prop-types";
import { IProModal, ProModal } from "../../../Modals/src/ProModal";
import { ScrollArea } from "@similarweb/ui-components/dist/react-scrollbar";
type props = "isOpen" | "onCloseClick";

interface IBenchmarkToArenaModalProps extends Pick<IProModal, props> {
    title: string;
    subTitle: string;
}

const Header = styled.div`
    display: flex;
    flex-direction: column;
    padding: 24px;
    border-bottom: 1px solid ${colorsPalettes.carbon[50]};
`;

const Title = styled.div`
    ${mixins.setFont({ $size: 16, $color: colorsPalettes.carbon[500] })};
    margin-bottom: 6px;
`;

const Subtitle = styled.div`
    ${mixins.setFont({ $size: 14, $color: rgba(colorsPalettes.carbon[500], 0.8) })};
`;

const Content = styled.div`
    background-color: ${colorsPalettes.carbon[25]};
    display: flex;
    flex-direction: column;
    padding: 8px 23px 0;
`;

const customStyles = {
    content: {
        padding: 0,
    },
    overlay: {
        zIndex: 1051,
    },
};

export const BenchmarkToArenaModal: FunctionComponent<IBenchmarkToArenaModalProps> = (
    { title, subTitle, isOpen, onCloseClick, children },
    { translate },
) => {
    return (
        <ProModal
            customStyles={customStyles}
            isOpen={isOpen}
            showCloseIcon={true}
            onCloseClick={onCloseClick}
        >
            <Header>
                <Title>{title}</Title>
                <Subtitle>{subTitle}</Subtitle>
            </Header>
            <Content>
                <ScrollArea
                    horizontal={false}
                    smoothScrolling={true}
                    style={{ maxHeight: 392 }}
                    verticalScrollbarStyle={{ borderRadius: 5 }}
                >
                    {children}
                </ScrollArea>
            </Content>
        </ProModal>
    );
};

BenchmarkToArenaModal.contextTypes = {
    translate: propTypes.func,
};
