import * as React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ProModal } from "components/Modals/src/ProModal";
import { Injector } from "common/ioc/Injector";
import styled from "styled-components";
import { fonts, colorsPalettes, rgba } from "@similarweb/styles";
import { FlexColumn, FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { AssetsService } from "services/AssetsService";
import { swSettings } from "common/services/swSettings";
import { HOME_PAGE_ROUTE } from "pages/sales-intelligence/constants/routes";
import swLog from "@similarweb/sw-log";
import { i18nFilter } from "filters/ngFilters";
import { SwNavigator } from "common/services/swNavigator";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { PreferencesService } from "services/preferences/preferencesService";

const ModalContent = styled(FlexColumn)`
    font-family: ${fonts.$robotoFontFamily};
    color: ${colorsPalettes.carbon["300"]};
`;
const Title = styled.div`
    color: ${colorsPalettes.carbon["500"]};
    font-size: 20px;
    line-height: 24px;
    font-weight: 500;
`;
const Subtitle = styled.div`
    font-size: 13px;
    line-height: 16px;
    margin-top: 8px;
`;
const CardsWrapper = styled(FlexRow)`
    justify-content: space-between;
    margin-top: 24px;
    width: 498px;
`;
const UnderCardText = styled.div`
    opacity: 0;
    display: flex;
    justify-content: center;
    margin-top: 16px;
    font-size: 13px;
    line-height: 16px;
    color: ${colorsPalettes.carbon["200"]};
`;
const CardAndTextWrapper = styled(FlexColumn)`
    justify-content: center;
`;
const HomePageCard = styled.div`
    width: 233px;
    height: 338px;
    border: 1px solid ${rgba(colorsPalettes.carbon[100], 0.8)};
    border-radius: 6px;
    &:hover {
        cursor: pointer;
        box-shadow: 0px 8px 24px rgba(9, 37, 64, 0.08), 0px 16px 32px rgba(9, 37, 64, 0.08);
        transition: box-shadow 0.25s ease-out;
        & + ${UnderCardText} {
            opacity: 1;
        }
    }
`;
const Image = styled.img`
    display: block;
    width: 100%;
    border-radius: 6px 6px 0 0;
`;
const CardTitle = styled.div`
    color: ${colorsPalettes.carbon["500"]};
    font-size: 14px;
    line-height: 18px;
    font-weight: 500;
    margin: 14px 0 0 16px;
`;
const CardDescription = styled.div`
    font-size: 14px;
    line-height: 18px;
    font-weight: 400;
    margin: 8px 0 0 16px;
    width: 172px;
`;
const ModalFooter = styled.div`
    display: flex;
    margin-top: 62px;
    font-size: 13px;
    line-height: 16px;
    font-weight: 400;
    width: 100%;
    justify-content: center;
`;

export enum DEFAULT_HOMEPAGES {
    DMI = "marketing",
    MRI = "research",
    SI = "sales",
}
export const DEFAULT_HOMEPAGE_PREFERENCE_KEY = "defaultHomepage";

interface IDefaultHomePageModalProps {
    hasDefaultHomepage: string | undefined;
}

export const DefaultHomePageModal: React.FunctionComponent<IDefaultHomePageModalProps> = ({
    hasDefaultHomepage,
}) => {
    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    const [isOpen, setIsOpen] = useState(false);
    const i18n = useMemo(() => i18nFilter(), []);
    useEffect(() => {
        if (swSettings.user.hasMR && swSettings.user.hasDM && !hasDefaultHomepage) {
            setIsOpen(true);
        }
    }, [swSettings.user.hasMR, swSettings.user.hasDM, hasDefaultHomepage]);

    const onCardClick = useCallback(
        (key) => async () => {
            try {
                await PreferencesService.add({ [DEFAULT_HOMEPAGE_PREFERENCE_KEY]: key });
                setIsOpen(false);
                switch (key) {
                    case DEFAULT_HOMEPAGES.DMI:
                        TrackWithGuidService.trackWithGuid(
                            "default.homepage.modal.set_default_homepage",
                            "click",
                            { packageName: "digital marketing" },
                        );
                        swNavigator.go("digitalmarketing-home");
                        break;
                    case DEFAULT_HOMEPAGES.SI:
                        TrackWithGuidService.trackWithGuid(
                            "default.homepage.modal.set_default_homepage",
                            "click",
                            { packageName: "sales" },
                        );
                        swNavigator.go(HOME_PAGE_ROUTE);
                        break;
                    case DEFAULT_HOMEPAGES.MRI:
                        TrackWithGuidService.trackWithGuid(
                            "default.homepage.modal.set_default_homepage",
                            "click",
                            { packageName: "research" },
                        );
                        break;
                    default:
                        swNavigator.go("marketresearch-home");
                }
            } catch (e) {
                swLog.error(e);
            }
        },
        [],
    );

    return (
        <ProModal
            isOpen={isOpen}
            shouldCloseOnOverlayClick={false}
            className="modal sw-user-modal"
            showCloseIcon={false}
            customStyles={{
                content: {
                    top: "100px",
                    marginTop: "0",
                    width: "562px",
                    height: "572px",
                },
            }}
        >
            <ModalContent>
                <Title>{i18n("modal.default.homepage.title")}</Title>
                <Subtitle>{i18n("modal.default.homepage.subtitle")}</Subtitle>
                <CardsWrapper>
                    <CardAndTextWrapper>
                        <HomePageCard onClick={onCardClick(DEFAULT_HOMEPAGES.DMI)}>
                            <Image src={AssetsService.assetUrl("/images/homepage/DMI-Cover.png")} />
                            <CardTitle>
                                {i18n("modal.default.homepage.card.title.digital.marketing")}
                            </CardTitle>
                            <CardDescription>
                                {i18n("modal.default.homepage.card.description.digital.marketing")}
                            </CardDescription>
                        </HomePageCard>
                        <UnderCardText>
                            {i18n("modal.default.homepage.card.hover.text")}
                        </UnderCardText>
                    </CardAndTextWrapper>
                    <CardAndTextWrapper>
                        <HomePageCard onClick={onCardClick(DEFAULT_HOMEPAGES.MRI)}>
                            <Image src={AssetsService.assetUrl("/images/homepage/RI-Cover.png")} />
                            <CardTitle>
                                {i18n("modal.default.homepage.card.title.market.research")}
                            </CardTitle>
                            <CardDescription>
                                {i18n("modal.default.homepage.card.description.market.research")}
                            </CardDescription>
                        </HomePageCard>
                        <UnderCardText>
                            {i18n("modal.default.homepage.card.hover.text")}
                        </UnderCardText>
                    </CardAndTextWrapper>
                </CardsWrapper>
                <ModalFooter>{i18n("modal.default.homepage.footer")}</ModalFooter>
            </ModalContent>
        </ProModal>
    );
};
