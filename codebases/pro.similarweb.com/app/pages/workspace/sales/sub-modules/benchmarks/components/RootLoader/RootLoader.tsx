import React from "react";
import { colorsPalettes } from "@similarweb/styles";
import { CircularLoader } from "@similarweb/ui-components/dist/circular-loader";
import { StyledRootLoader, StyledBottomSection } from "./styles";
import { AssetsService } from "services/AssetsService";
import { useTranslation } from "components/WithTranslation/src/I18n";
import {
    StyledDescriptionContainer,
    StyledImageContainer,
    StyledTopSection,
} from "pages/sales-intelligence/sub-modules/right-sidebar/components/NoCompetitorsFound/styles";

const RootLoader = () => {
    const translate = useTranslation();
    const options = {
        svg: {
            stroke: colorsPalettes.midnight["50"],
            strokeWidth: "4",
            r: 21,
            cx: "50%",
            cy: "50%",
        },
        style: {
            width: 46,
            height: 46,
        },
    };

    return (
        <StyledRootLoader>
            <StyledTopSection>
                <StyledImageContainer>
                    <img
                        alt="insights-generator"
                        src={AssetsService.assetUrl(
                            "/images/sales-intelligence/insights-generator-illustration.svg",
                        )}
                    />
                </StyledImageContainer>
                <StyledDescriptionContainer>
                    <p
                        dangerouslySetInnerHTML={{
                            __html: translate("si.insights.empty.sentence.0"),
                        }}
                    />
                    <p
                        dangerouslySetInnerHTML={{
                            __html: translate("si.insights.empty.sentence.1"),
                        }}
                    />
                </StyledDescriptionContainer>
            </StyledTopSection>
            <StyledBottomSection>
                <CircularLoader options={options} />
            </StyledBottomSection>
        </StyledRootLoader>
    );
};

export default RootLoader;
