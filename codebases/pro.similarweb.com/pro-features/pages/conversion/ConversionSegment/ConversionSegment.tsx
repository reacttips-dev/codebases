import { Tab, TabPanel, Tabs } from "@similarweb/ui-components/dist/tabs";
import { Injector } from "common/ioc/Injector";
import { i18nFilter } from "filters/ngFilters";
import * as _ from "lodash";
import { ConversionSegmentOverview } from "pages/conversion/ConversionSegmentOverview";
import { ConversionSegmentsUtils } from "pages/conversion/ConversionSegmentsUtils";
import { ConversionSegmentOSS } from "pages/conversion/oss/ConversionSegmentOSS";
import * as React from "react";
import { FunctionComponent, useEffect, useMemo, useState } from "react";
import { connect } from "react-redux";
import { allTrackers } from "services/track/track";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { TrackWithGuidService } from "../../../../app/services/track/TrackWithGuidService";
import AllContexts from "../components/AllContexts";
import { IConversionSegmentProps } from "pages/conversion/ConversionSegment/ConversionSegmentTypes";
import {
    TabsContainer,
    TabListStyled,
    OrangeStyledPill,
    ContentContainer,
} from "pages/conversion/ConversionSegment/ConversionSegmentStyles";

const ConversionSegment: FunctionComponent<IConversionSegmentProps> = (props) => {
    const { translate, getLink, segmentsData } = props;
    const swNavigator = Injector.get("swNavigator") as any;
    const $rootScope = Injector.get("$rootScope") as any;
    const tabsRefArray = [];
    const [selectedTab, setSelectedTab] = useState<number>(
        parseInt(swNavigator.getApiParams().tab ? swNavigator.getApiParams().tab : "0", 10),
    );
    const { sid } = swNavigator.getParams();
    const segmentData = ConversionSegmentsUtils.getSegmentById(segmentsData, sid);

    // redirect machenism to avoid showing disabled oss tab for segments with no oss.
    $rootScope.$on("navChangeStart", (evt, toState, toParams) => {
        const segmentData = ConversionSegmentsUtils.getSegmentById(segmentsData, toParams.sid);
        if (
            toState.name === "conversion-customsegement" &&
            toParams.tab === "1" &&
            !segmentData.ossCountries.includes(parseInt(toParams.country, 10))
        ) {
            evt.preventDefault();
            swNavigator.go(toState, { ...toParams, tab: undefined });
        }
    });
    useEffect(() => {
        if (props.params.tab) {
            setSelectedTab(parseInt(props.params.tab, 10));
        }
    }, [props.params.tab]);

    const onTabSelect = (index: any) => {
        setSelectedTab(index);
        const params = swNavigator.getParams();
        swNavigator.applyUpdateParams({ ...params, tab: index });
        TrackWithGuidService.trackWithGuid("conversion.segment.analysis.tab", "switch", {
            tabName: getTabNameForTracking({ selectedSegmentTab: index.toString() }),
        });
    };

    const segmentOssUserCountries = useMemo(
        () =>
            segmentData?.ossCountries
                ? ConversionSegmentsUtils.getSegmentOssUserCountries(segmentData)
                : [],
        [segmentData],
    );
    const ossTabDisabled = segmentOssUserCountries.length === 0;

    useEffect(() => {
        // if OSS is disabled and route points to tab 1 (OSS), then redirect back to tab 0 (overview)
        if (props.params.tab === "1" && ossTabDisabled) {
            setTimeout(() => {
                onTabSelect(0);
            });
        }
    }, [props.params.tab, ossTabDisabled]);

    const getTabProps = (index, isDisabled?) => {
        return {
            onClick: () => (isDisabled ? _.noop() : onTabSelect(index)),
            selected: selectedTab === index,
            key: `tab-${index}`,
        };
    };

    const getTabNameForTracking = ({ selectedSegmentTab }) => {
        switch (selectedSegmentTab) {
            case "0":
                return "SEGMENT OVERVIEW";
            case "1":
                return "ON SITE SEARCH";
            default:
                return "SEGMENT OVERVIEW";
        }
    };

    return (
        <AllContexts
            translate={translate}
            track={allTrackers.trackEvent.bind(allTrackers)}
            trackWithGuid={TrackWithGuidService.trackWithGuid}
            linkFn={getLink}
        >
            <TabsContainer>
                <FlexRow justifyContent="space-between" alignItems="center">
                    <TabListStyled>
                        <Tab className="firstTab" {...getTabProps(0)}>
                            {i18nFilter()("conversion.segment.overview.tab.title")}
                        </Tab>
                        <Tab
                            disabled={ossTabDisabled}
                            className="secondTab"
                            {...getTabProps(1, ossTabDisabled)}
                        >
                            {i18nFilter()("conversion.segment.onsitesearch.tab.title")}
                            {!ossTabDisabled && <OrangeStyledPill>New</OrangeStyledPill>}
                        </Tab>
                    </TabListStyled>
                </FlexRow>
            </TabsContainer>
            <ContentContainer>
                <Tabs onSelect={onTabSelect} selectedIndex={selectedTab} forceRenderTabPanel={true}>
                    <TabPanel className="firstTab">
                        <div ref={(el) => (tabsRefArray[0] = el)}>
                            {segmentData && (
                                <ConversionSegmentOverview
                                    {...props}
                                    overviewSupportedCountries={segmentData?.countries}
                                />
                            )}
                        </div>
                    </TabPanel>

                    <TabPanel className="secondTab">
                        <div ref={(el) => (tabsRefArray[1] = el)}>
                            {segmentData && (
                                <ConversionSegmentOSS
                                    {...props}
                                    ossSupportedCountries={segmentData?.ossCountries}
                                />
                            )}
                        </div>
                    </TabPanel>
                </Tabs>
            </ContentContainer>
        </AllContexts>
    );
};

function mapStateToProps({ routing }) {
    const { currentPage, params } = routing;
    return {
        currentPage,
        params,
    };
}

export default connect(mapStateToProps, null)(ConversionSegment);
