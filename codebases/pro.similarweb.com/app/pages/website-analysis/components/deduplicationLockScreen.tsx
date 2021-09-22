import { SWReactIcons } from "@similarweb/icons";
import { colorsPalettes } from "@similarweb/styles";
import { Button } from "@similarweb/ui-components/dist/button";
import { swSettings } from "common/services/swSettings";
import { PlainTooltip } from "components/React/Tooltip/PlainTooltip/PlainTooltip";
import { i18nFilter } from "filters/ngFilters";
import { dedupLock } from "pages/website-analysis/components/art/dedupLock";
import React, { FC, useCallback } from "react";
import { openUnlockModal, openUnlockModalV2 } from "services/ModalService";
import styled from "styled-components";

const ImgContainer = styled.div`
    align-self: flex-start;
    margin-left: 31px;
`;

const Wrapper = styled.div`
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-top: 24px;
`;
const HeaderContainer = styled.div`
    display: flex;
    justify-content: space-between;
`;
const TextContainer = styled.div`
    margin-bottom: 10px;
    margin-left: 50px;
`;
const HeaderAndIconContainer = styled.div`
    display: flex;
    margin-bottom: 8px;
`;
const Header = styled.span`
    font-size: 16px;
    line-height: 18px;
    color: ${colorsPalettes.carbon["500"]};
    margin-right: 5px;
`;
const IconContainer = styled.div`
    height: 18px;
`;
const Icon = styled(SWReactIcons)`
    display: inline-block;
    svg {
        path {
            fill: ${colorsPalettes.carbon["500"]};
            fill-opacity: 1;
        }
    }
`;
const ButtonContainer = styled.div``;
const Container = styled.div`
    display: flex;
    margin-left: 50px;
    justify-content: flex-start;
`;
const LegendContainer = styled.div`
    display: flex;
    align-items: center;
    margin-right: 25px;
`;
const Styledlegend = styled.div`
    border-radius: 50%;
    background-color: ${(props) => props.color};
    width: 10px;
    height: 10px;
    margin-right: 8px;
`;
const Value = styled.span`
    margin-right: 8px;
`;
const InfoIcon = styled(SWReactIcons)`
    width: 16px;
    height: 16px;
    line-height: 1.4;
`;

export const DeduplicationLockScreen: FC = () => {
    const openHook = useCallback(() => {
        if (swSettings.user.hasSolution2) {
            openUnlockModalV2("DeduplicatedAudience");
        } else {
            openUnlockModal({
                modal: "DeduplicationVisits",
                slide: "DeduplicationVisits",
            });
        }
    }, []);

    return (
        <Wrapper>
            <HeaderContainer>
                <TextContainer>
                    <HeaderAndIconContainer>
                        <Header>{i18nFilter()("tae.dedup.unlock.title")}</Header>
                        <IconContainer>
                            <Icon iconName="locked" size="xs" />
                        </IconContainer>
                    </HeaderAndIconContainer>
                    <div>{i18nFilter()("tae.dedup.unlock.body.part1")}</div>
                    <div>{i18nFilter()("tae.dedup.unlock.body.part2")}</div>
                </TextContainer>
                <ButtonContainer>
                    <Button onClick={openHook} type="upsell">
                        {i18nFilter()("tae.dedup.unlock.button_unlock.text")}
                    </Button>
                </ButtonContainer>
            </HeaderContainer>
            <Container>
                <LegendContainer>
                    <Styledlegend color={colorsPalettes.blue[400]} />
                    <Value>{i18nFilter()("tae.dedup.legend.desktop.text")}</Value>
                    <PlainTooltip
                        placement={"top"}
                        text={i18nFilter()("tae.dedup.legend.desktop.tooltip")}
                    >
                        <span>
                            <InfoIcon iconName="info" />
                        </span>
                    </PlainTooltip>
                </LegendContainer>
                <LegendContainer>
                    <Styledlegend color={colorsPalettes.blue[300]} />
                    <Value>{i18nFilter()("tae.dedup.legend.mobileweb.text")}</Value>
                    <PlainTooltip
                        placement={"top"}
                        text={i18nFilter()("tae.dedup.legend.mobileweb.tooltip")}
                    >
                        <span>
                            <InfoIcon iconName="info" />
                        </span>
                    </PlainTooltip>
                </LegendContainer>
                <LegendContainer>
                    <Styledlegend color={colorsPalettes.yellow[400]} />
                    <Value>{i18nFilter()("tae.dedup.legend.dedup.text")}</Value>
                    <PlainTooltip
                        placement={"top"}
                        text={i18nFilter()("tae.dedup.legend.dedup.tooltip")}
                    >
                        <span>
                            <InfoIcon iconName="info" />
                        </span>
                    </PlainTooltip>
                </LegendContainer>
            </Container>
            <ImgContainer>{dedupLock}</ImgContainer>
        </Wrapper>
    );
};
