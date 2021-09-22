import { Tab, TabPanel, Tabs } from "@similarweb/ui-components/dist/tabs";
import { Injector } from "common/ioc/Injector";
import { i18nFilter } from "filters/ngFilters";
import * as _ from "lodash";
import CustomSegmentsOrgTableContainer from "pages/segments/analysis/CustomSegmentsOrgTableContainer";
import CustomSegmentsTableContainer from "pages/segments/analysis/CustomSegmentsTableContainer";
import { ISegmentsStartPageProps } from "pages/segments/start-page/SegmentsStartPage";
import {
    ContentContainer,
    StyledIconButton,
    TabsContainer,
    TabListStyled,
} from "pages/segments/start-page/StyledComponents";
import React, { useEffect, useState } from "react";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { SegmentsTableStyles } from "pages/segments/styleComponents";

export const getTabNameForTracking = ({ selectedSegmentTab }) => {
    switch (selectedSegmentTab) {
        case "0":
            return "ALL SEGMENTS";
        case "1":
            return "MY SEGMENTS";
        default:
            return "ALL SEGMENTS";
    }
};

export const SegmentTableTabs = (props: ISegmentsStartPageProps) => {
    const swNavigator = Injector.get("swNavigator") as any;
    const [selectedTab, setSelectedTab] = useState<number>(
        parseInt(
            swNavigator.getApiParams().tab &&
                (swNavigator.getApiParams().tab === "0" || swNavigator.getApiParams().tab === "1")
                ? swNavigator.getApiParams().tab
                : "0",
            10,
        ),
    );
    const tabsRefArray = [];

    const createSegment = () => {
        TrackWithGuidService.trackWithGuid("custom.segments.analysis.create", "click");
        const currentModule = swNavigator.getCurrentModule();
        const segmentWizardStateName = `${currentModule}-wizard`;
        swNavigator.go(segmentWizardStateName);
    };

    const getTabProps = (index, isDisabled?) => {
        return {
            onClick: () => (isDisabled ? _.noop() : onTabSelect(index)),
            selected: selectedTab === index,
            key: `tab-${index}`,
        };
    };

    useEffect(() => {
        if (props.params.tab && (props.params.tab === "0" || props.params.tab === "1")) {
            setSelectedTab(parseInt(props.params.tab, 10));
        }
    }, [props.params.tab]);

    const onTabSelect = (index: any) => {
        setSelectedTab(index);
        const params = swNavigator.getParams();
        swNavigator.applyUpdateParams({ ...params, tab: index });
        TrackWithGuidService.trackWithGuid("segment.analysis.home.tab", "switch", {
            tabName: getTabNameForTracking({ selectedSegmentTab: index.toString() }),
        });
    };

    const [allowedOrganizationSegments, allowedSegments] = React.useMemo(() => {
        const allowedSegmentFilter = (seg) => !seg.isLocked;
        return [
            (props.organizationSegments ?? []).filter(allowedSegmentFilter),
            (props.segments ?? []).filter(allowedSegmentFilter),
        ];
    }, [props.organizationSegments, props.segments]);

    return (
        <>
            <TabsContainer>
                <TabListStyled>
                    <Tab className="firstTab" {...getTabProps(0)}>
                        {i18nFilter()("segments.analysis.organization.title")}
                    </Tab>
                    <Tab className="secondTab" {...getTabProps(1)}>
                        {i18nFilter()("segments.analysis.title")}
                    </Tab>
                </TabListStyled>
                <StyledIconButton
                    onClick={createSegment}
                    iconName="add"
                    type="outlined"
                    iconSize="sm"
                    placement="left"
                >
                    {i18nFilter()("segments.analysis.create.button.text")}
                </StyledIconButton>
            </TabsContainer>
            <ContentContainer>
                <SegmentsTableStyles />
                <Tabs onSelect={onTabSelect} selectedIndex={selectedTab} forceRenderTabPanel={true}>
                    <TabPanel className="firstTab">
                        <div ref={(el) => (tabsRefArray[0] = el)}>
                            <CustomSegmentsOrgTableContainer
                                isLoading={props.isLoading}
                                tableData={allowedOrganizationSegments}
                            />
                        </div>
                    </TabPanel>

                    <TabPanel className="secondTab">
                        <div ref={(el) => (tabsRefArray[1] = el)}>
                            <CustomSegmentsTableContainer
                                isLoading={props.isLoading}
                                tableData={allowedSegments}
                            />
                        </div>
                    </TabPanel>
                </Tabs>
            </ContentContainer>
        </>
    );
};
