import React from "react";
import { connect } from "react-redux";
import { Button } from "@similarweb/ui-components/dist/button";
import { i18nFilter } from "filters/ngFilters";
import { SegmentsUtils } from "services/segments/SegmentsUtils";
import { ICustomSegmentAccount, ICustomSegmentsGroup } from "services/segments/segmentsApiService";
import { MODE } from "pages/segments/analysis/SegmentsAnalysisTrafficContainer";
import { IWithUseAdvancedPref, withUseAdvancedPref } from "pages/segments/withUseAdvancedPref";
import { BoxContainer } from "pages/conversion/components/ConversionScatterChart/StyledComponents";
import { SegmentsAnalysisContainer } from "pages/segments/StyledComponents";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import {
    EmptyStateContainer,
    EmptyStateIcon,
    EmptyStateTitle,
    EmptyStateSubTitle,
    EmptyStateActionButtons,
} from "./StyledComponents";

interface ISegmentsAnalysisAdvancedEmptyWrapper extends IWithUseAdvancedPref {
    children: React.ReactNode;
    params: { mode: string; id: string };
    allSegments: ICustomSegmentAccount[];
    groups: ICustomSegmentsGroup[];
}

const segmentEmptyStateTexts = {
    single: {
        main: "segments.nodata.advanced.single.main",
        sub: "segments.nodata.advanced.single.sub",
    },
    group: {
        main: "segments.nodata.advanced.group.main",
        sub: "segments.nodata.advanced.group.sub",
    },
};

const SegmentsAnalysisAdvancedEmptyWrapperComponent = (
    props: ISegmentsAnalysisAdvancedEmptyWrapper,
) => {
    const { children, params, allSegments, groups, useAdvancedPref } = props;

    const { i18n, swNavigator } = React.useMemo(
        () => ({
            i18n: i18nFilter(),
            swNavigator: Injector.get<SwNavigator>("swNavigator"),
        }),
        [],
    );

    const isDisallowed = React.useMemo(() => {
        let isAdvancedDisallowed = false;
        switch (params.mode) {
            case MODE.single:
                const currentSegment = SegmentsUtils.getSegmentById(
                    { segments: allSegments },
                    params.id,
                ) as ICustomSegmentAccount;
                isAdvancedDisallowed =
                    !!currentSegment &&
                    !useAdvancedPref.value &&
                    SegmentsUtils.isSegmentAdvanced(currentSegment);
                break;
            case MODE.group:
                const currentGroup = SegmentsUtils.getSegmentGroupById(groups, params.id);
                isAdvancedDisallowed =
                    !!currentGroup &&
                    !useAdvancedPref.value &&
                    SegmentsUtils.isGroupAdvanced(currentGroup, { segments: allSegments });
                break;
        }
        return isAdvancedDisallowed;
    }, [useAdvancedPref.value, allSegments, groups, params.id]);

    const [updatingInProcess, setUpdatingInProcess] = React.useState(false);
    const turnOnUseAdvancedPref = React.useCallback(async () => {
        setUpdatingInProcess(true);
        const updated = await useAdvancedPref.changePref(true, "Segments Empty State");
        if (updated) {
            Injector.get<SwNavigator>("swNavigator").reload();
        }
    }, [useAdvancedPref.changePref]);

    const onBackClick = React.useCallback(() => {
        const currentModule = swNavigator.getCurrentModule();
        const segmentsHomepage = `${currentModule}-homepage`;
        swNavigator.go(segmentsHomepage);
    }, []);

    return isDisallowed || updatingInProcess ? (
        <SegmentsAnalysisContainer>
            <BoxContainer>
                <EmptyStateContainer>
                    <EmptyStateIcon />
                    <EmptyStateTitle>
                        {i18n(segmentEmptyStateTexts[params.mode].main)}
                    </EmptyStateTitle>
                    <EmptyStateSubTitle>
                        {i18n(segmentEmptyStateTexts[params.mode].sub)}
                    </EmptyStateSubTitle>
                    <EmptyStateActionButtons>
                        <Button type="flat" onClick={onBackClick}>
                            {i18n("segments.nodata.advanced.button.goBack")}
                        </Button>
                        <Button
                            type="primary"
                            onClick={turnOnUseAdvancedPref}
                            isLoading={updatingInProcess}
                            isDisabled={updatingInProcess}
                        >
                            {i18n("segments.nodata.advanced.button.turnOn")}
                        </Button>
                    </EmptyStateActionButtons>
                </EmptyStateContainer>
            </BoxContainer>
        </SegmentsAnalysisContainer>
    ) : (
        children
    );
};

const mapStateToProps = (store) => {
    const {
        segmentsModule: { customSegmentsMeta },
        routing: { params },
    } = store;
    return {
        allSegments: customSegmentsMeta?.AccountSegments,
        groups: customSegmentsMeta?.SegmentGroups,
        params,
    };
};

const SegmentsAnalysisAdvancedEmptyWrapper = withUseAdvancedPref(
    connect(mapStateToProps)(SegmentsAnalysisAdvancedEmptyWrapperComponent),
);

export default SegmentsAnalysisAdvancedEmptyWrapper;
