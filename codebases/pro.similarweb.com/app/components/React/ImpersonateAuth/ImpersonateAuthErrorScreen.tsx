import React from "react";
import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";
import { Box } from "@similarweb/ui-components/dist/box";
import { Button } from "@similarweb/ui-components/dist/button";
import { SWReactIcons } from "@similarweb/icons";
import { AssetsService } from "services/AssetsService";
import { i18nFilter } from "filters/ngFilters";

const i18n = i18nFilter();
const StyledBox = styled(Box)`
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    width: 378px;
    height: 425px;
    box-shadow: 0 10px 16px 0 rgba(14, 30, 62, 0.3);
`;

const Container = styled.div`
    margin: 4px;
    height: 100%;
`;

const ArrowIconContainer = styled.span`
    margin-right: 5px;

    .SWReactIcons {
        float: right;
        margin-left: 5px;
    }
`;

const BackButton = styled(Button)`
    margin-top: 15px;
    font-size: 14px;
    font-weight: bolder;
    color: ${colorsPalettes.blue[400]};
`;

const CloseButton = styled(Button)`
    position: absolute;
    right: 10px;
    bottom: 20px;
    font-size: 14px;
    font-weight: bolder;
    color: ${colorsPalettes.blue[400]};
`;

const ContentDiv = styled.div`
    height: 70%;
`;

const Title = styled.span`
    display: table;
    margin: auto;
    font-size: 16px;
    font-weight: 500;
    color: ${colorsPalettes.carbon[500]};
`;

const Subtitle = styled.p`
    width: 70%;
    margin: auto;
    font-size: 12px;
    font-weight: 400;
    text-align: center;
    color: ${colorsPalettes.carbon[300]};
`;

interface IImpersonateAuthErrorScreen {
    onBack: Function;
    onClose: Function;
}

const ImpersonateAuthErrorScreen: React.FunctionComponent<IImpersonateAuthErrorScreen> = (
    props,
) => {
    return (
        <StyledBox>
            <Container>
                {props.onBack ? (
                    <BackButton
                        className="clickable unselectable"
                        type="flat"
                        onClick={() => props.onBack()}
                    >
                        <ArrowIconContainer>
                            <SWReactIcons iconName="arrow-left" size="xs" />
                        </ArrowIconContainer>
                        {i18n("impersonate.auth.back")}
                    </BackButton>
                ) : null}
                <ContentDiv>
                    <img
                        src={AssetsService.assetUrl(`/images/ImpersonateAuth/error.svg`)}
                        style={{
                            margin: "auto auto auto 75px",
                            pointerEvents: "none",
                        }}
                    />
                    <Title>{i18n("impersonate.auth.errorOccuredTitle")}</Title>
                    <Subtitle>{i18n("impersonate.auth.errorOccuredSubtitle")}</Subtitle>
                </ContentDiv>
                <CloseButton
                    className="clickable unselectable"
                    type="flat"
                    onClick={() => props.onClose()}
                >
                    {i18n("impersonate.auth.close")}
                </CloseButton>
            </Container>
        </StyledBox>
    );
};

export default ImpersonateAuthErrorScreen;
