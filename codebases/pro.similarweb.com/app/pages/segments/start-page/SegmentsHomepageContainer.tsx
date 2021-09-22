import { Injector } from "common/ioc/Injector";
import SegmentsStartPage from "pages/segments/start-page/SegmentsStartPage";
import {
    ButtonContainer,
    Container,
    GifContainer,
    Header,
    InnerContainer,
    PageContainer,
    StyledButton,
    Text,
    OptInBanner,
    OptInBannerInner,
    OptInBannerInnerBlock,
    OptInBannerMainText,
    OptInBannerSecondaryText,
} from "pages/segments/start-page/StyledComponents";
import * as React from "react";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import I18n from "../../../components/React/Filters/I18n";
import SWReactRootComponent from "../../../decorators/SWReactRootComponent";
import { i18nFilter } from "../../../filters/ngFilters";
import { ENABLE_FIREBOLT, SegmentsUtils } from "services/segments/SegmentsUtils";
import { SwNavigator } from "common/services/swNavigator";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { OnOffSwitch } from "@similarweb/ui-components/dist/on-off-switch";
import { BetaLabel } from "components/BetaLabel/BetaLabel";
import { IWithUseAdvancedPref, withUseAdvancedPref } from "pages/segments/withUseAdvancedPref";
import { SwTrack } from "services/SwTrack";

const NoSegmentsView = () => {
    const { swNavigator } = React.useMemo(
        () => ({
            swNavigator: Injector.get<SwNavigator>("swNavigator"),
        }),
        [],
    );

    const createSegment = React.useCallback(() => {
        SwTrack.all.trackEvent("Internal Link", "click", `segmentAnalysis/create new segment`);
        swNavigator.go("segments-wizard");
    }, []);

    return (
        <Container>
            <InnerContainer fadeOut={true}>
                <GifContainer />
                <Header>
                    <I18n>custom.segments.home.page.title</I18n>
                </Header>
                <Text>
                    <I18n>custom.segments.home.page.subtitle</I18n>
                </Text>
                <ButtonContainer>
                    <StyledButton onClick={createSegment} type="primary">
                        {i18nFilter()("segments.analysis.create.button.text")}
                    </StyledButton>
                </ButtonContainer>
            </InnerContainer>
        </Container>
    );
};

const SegmentsOptInBannerComponent: React.FC<IWithUseAdvancedPref> = ({ useAdvancedPref }) => {
    const onOffSwitch = (
        <OnOffSwitch
            isSelected={useAdvancedPref.value}
            onClick={() => useAdvancedPref.togglePref("Homepage")}
        />
    );
    return (
        <OptInBanner>
            <OptInBannerInner>
                <OptInBannerInnerBlock>
                    <BetaLabel />
                    <OptInBannerMainText>
                        <I18n>
                            {useAdvancedPref.value
                                ? "custom.segments.banner.optout.main"
                                : "custom.segments.banner.optin.main"}
                        </I18n>
                    </OptInBannerMainText>
                    <OptInBannerSecondaryText>
                        <I18n>
                            {useAdvancedPref.value
                                ? "custom.segments.banner.optout.secondary"
                                : "custom.segments.banner.optin.secondary"}
                        </I18n>
                    </OptInBannerSecondaryText>
                </OptInBannerInnerBlock>
                <OptInBannerInnerBlock>
                    {useAdvancedPref.value ? (
                        onOffSwitch
                    ) : (
                        <PlainTooltip
                            placement="bottom"
                            tooltipContent={i18nFilter()("custom.segments.banner.optin.tooltip")}
                        >
                            <span>{onOffSwitch}</span>
                        </PlainTooltip>
                    )}
                </OptInBannerInnerBlock>
            </OptInBannerInner>
        </OptInBanner>
    );
};
export const SegmentsOptInBanner = withUseAdvancedPref(SegmentsOptInBannerComponent);

const SegmentsHomepageContainer: React.FC = (props: any) => {
    const [hasSegments, setHasSegments] = useState(false);

    const isMidTierUser = React.useMemo(() => SegmentsUtils.isMidTierUser(), []);

    useEffect(() => {
        if (props.organizationSegments && props.organizationSegments.length > 0) {
            setHasSegments(true);
        }
    }, [props.organizationSegments]);

    const render = () => {
        return (
            <>
                {/* {ENABLE_FIREBOLT && <SegmentsOptInBanner />}  // sets the user to always use firebolt (remove this line after old version is completely removed) */}
                <PageContainer>
                    {hasSegments ? (
                        <SegmentsStartPage isMidTierUser={isMidTierUser} />
                    ) : (
                        <NoSegmentsView />
                    )}
                </PageContainer>
            </>
        );
    };
    return render();
};
function mapStateToProps(store) {
    const {
        routing: { params },
        segmentsModule: { customSegmentsMeta, segmentsLoading },
    } = store;
    return {
        params,
        segments: customSegmentsMeta?.Segments,
        organizationSegments: customSegmentsMeta?.AccountSegments,
        isLoading: segmentsLoading,
    };
}

function mapDispatchToProps(dispatch) {
    return {};
}

export default SWReactRootComponent(
    connect(mapStateToProps, mapDispatchToProps)(SegmentsHomepageContainer),
    "SegmentsHomepageContainer",
);
