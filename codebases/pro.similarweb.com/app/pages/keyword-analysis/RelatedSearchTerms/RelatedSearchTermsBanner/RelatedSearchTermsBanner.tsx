import React, { FC, useMemo } from "react";
import { Banner } from "@similarweb/ui-components/dist/banner";
import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";
import { noop } from "lodash";
import { AssetsService } from "services/AssetsService";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { Pill } from "components/Pill/Pill";
import { BannerTitleContainer } from "./RelatedSearchTermsBannerStyles";
import { SwNavigator } from "common/services/swNavigator";
import { Injector } from "common/ioc/Injector";
import { RelatedSearchTermsBannerContainer } from "pages/keyword-analysis/RelatedSearchTerms/RelatedSearchTermsBanner/RelatedSearchTermsBannerStyles";
import { i18nFilter } from "filters/ngFilters";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";

export interface IRelatedSearchTermsBannerProps {
    onButtonClick: () => void;
}

export const RelatedSearchTermsBanner: FC<IRelatedSearchTermsBannerProps> = (props) => {
    const { onButtonClick } = props;

    const services = useMemo(() => {
        return {
            translate: i18nFilter(),
            tracking: TrackWithGuidService,
        };
    }, []);

    const TitleComponent = useMemo(() => {
        return (
            <BannerTitleContainer>
                <p>{services.translate("related.search.terms.banner.title")}</p>
                <Pill
                    text={services.translate("new.label.pill")}
                    backgroundColor={colorsPalettes.orange[400]}
                />
            </BannerTitleContainer>
        );
    }, [services]);

    return (
        <RelatedSearchTermsBannerContainer
            title={TitleComponent}
            subtitle={services.translate("related.search.terms.banner.subtitle")}
            buttonText={services.translate("related.search.terms.banner.button")}
            buttonType={"primary"}
            onButtonClick={onButtonClick}
            iconImagePath={AssetsService.assetUrl("/images/keywords/related-search-terms.svg")}
            iconImageHeight={40}
            iconImageWidth={40}
            iconImageClassName={"bannerIcon"}
            onInitialRender={() => {
                services.tracking.trackWithGuid("related.search.terms.banner", "show");
            }}
        />
    );
};
