import { useTranslation } from "components/WithTranslation/src/I18n";
import { FC, useCallback } from "react";
import { openUnlockModalV2 } from "services/ModalService";
import styled from "styled-components";
import { Button } from "@similarweb/ui-components/dist/button";
import { colorsPalettes } from "@similarweb/styles";
import calendarImg from "./svg/calendar.svg";

interface ICouldBeLarge {
    large?: boolean;
}

const MoreDataBannerContainer = styled.span<ICouldBeLarge>`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 12px 16px 16px;
    background: rgba(79, 141, 249, 0.1);
    border: 0;
    margin: 0;
    cursor: ${(p) => (p.large ? "default" : "pointer")};
`;

const PresentationSection = styled.span<ICouldBeLarge>`
    display: flex;
    max-width: ${(p) => (p.large ? "100%" : "270px")};
`;

const TextSection = styled.span`
    display: block;
    color: ${colorsPalettes.indigo[300]};
    text-align: left;
    margin-left: 8px;
`;
const Title = styled.span<ICouldBeLarge>`
    display: block;
    margin: ${(p) => (p.large ? "0px" : "2px")} 0 6px;
    font-size: 14px;
    line-height: 16px;
`;
const Subtitle = styled.span`
    display: block;
    font-size: 12px;
    line-height: 16px;
`;

const ImgSection = styled.span`
    display: block;
    flex-shrink: 0;
`;

interface IMoreDataBanner extends ICouldBeLarge {
    onClick: VoidFunction;
}

export const MoreDataBanner: FC<IMoreDataBanner> = ({ onClick, large = false }) => {
    const translate = useTranslation();
    const handleClick = useCallback(() => {
        openUnlockModalV2("WebAllowedDuration");
        onClick();
    }, [onClick]);

    return (
        <MoreDataBannerContainer
            large={large}
            as={large ? "div" : "button"}
            onClick={large ? undefined : handleClick}
        >
            <PresentationSection large={large}>
                <ImgSection>
                    <img src={calendarImg} alt="" />
                </ImgSection>
                <TextSection>
                    <Title large={large}>{translate("duration_selector.more_data.title")}</Title>
                    <Subtitle>{translate("duration_selector.more_data.subtitle")}</Subtitle>
                </TextSection>
            </PresentationSection>
            {large && (
                <div>
                    <Button type="trial" onClick={handleClick}>
                        {translate("duration_selector.more_data.contact_us")}
                    </Button>
                </div>
            )}
        </MoreDataBannerContainer>
    );
};
