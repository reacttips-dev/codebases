import React from "react";
import { Button, ButtonLabel } from "@similarweb/ui-components/dist/button";
import {
    SegmentsWarningBannerContentPrimary,
    SegmentsWarningBannerContentSecondary,
} from "pages/segments/wizard/SegmentWizard/SegmentWizardStyles";
import { SegmentsVsGroupOvertime } from "./components/benchmarkOvertime/SegmentsVsGroupOvertime";
import {
    SegmentsAnalysisContainer,
    StyledSegmentsWarningBannerContainer,
    StyledSegmentsWarningBannerContent,
    SegmentsWarningBannerActionsSection,
    SegmentsWarningCloseButton,
} from "./StyledComponents";
import { ENABLE_FIREBOLT, ICustomSegmentAvailableMembers } from "services/segments/SegmentsUtils";
import I18n from "components/WithTranslation/src/I18n";
import { IWithUseAdvancedPref, withUseAdvancedPref } from "pages/segments/withUseAdvancedPref";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";

export const WarningBannerMissingData: React.FC = () => {
    return (
        <StyledSegmentsWarningBannerContainer>
            <StyledSegmentsWarningBannerContent>
                <SegmentsWarningBannerContentPrimary>
                    <I18n>segment.group.analysis.missing.response.warning.primary</I18n>
                </SegmentsWarningBannerContentPrimary>
                <SegmentsWarningBannerContentSecondary>
                    <I18n>segment.group.analysis.missing.response.warning.secondary</I18n>
                </SegmentsWarningBannerContentSecondary>
            </StyledSegmentsWarningBannerContent>
        </StyledSegmentsWarningBannerContainer>
    );
};

const WarningBannerOmittedSegmentsComponent: React.FC<
    { onClose: () => void; count: number } & IWithUseAdvancedPref
> = ({ onClose, count, useAdvancedPref }) => {
    const [updatingInProcess, setUpdatingInProcess] = React.useState(false);
    const turnOnUseAdvancedPref = React.useCallback(async () => {
        setUpdatingInProcess(true);
        const updated = await useAdvancedPref.changePref(true, "Segments Group Analysis");
        if (updated) {
            Injector.get<SwNavigator>("swNavigator").reload();
        }
    }, [useAdvancedPref.changePref]);
    return (
        <StyledSegmentsWarningBannerContainer>
            <StyledSegmentsWarningBannerContent>
                <div>
                    <SegmentsWarningBannerContentPrimary>
                        <I18n dataObj={{ count }}>
                            {count === 1
                                ? "segment.group.analysis.warning.omitted.segments.primary.single"
                                : "segment.group.analysis.warning.omitted.segments.primary.plural"}
                        </I18n>
                    </SegmentsWarningBannerContentPrimary>
                    <SegmentsWarningBannerContentSecondary>
                        <I18n>
                            {count === 1
                                ? "segment.group.analysis.warning.omitted.segments.secondary.single"
                                : "segment.group.analysis.warning.omitted.segments.secondary.plural"}
                        </I18n>
                    </SegmentsWarningBannerContentSecondary>
                </div>
                <SegmentsWarningBannerActionsSection>
                    <Button
                        type="primary"
                        onClick={turnOnUseAdvancedPref}
                        isLoading={updatingInProcess}
                        isDisabled={updatingInProcess}
                    >
                        <ButtonLabel>
                            <I18n>segment.group.analysis.button.optin.turn.on</I18n>
                        </ButtonLabel>
                    </Button>
                    <SegmentsWarningCloseButton onClick={onClose} />
                </SegmentsWarningBannerActionsSection>
            </StyledSegmentsWarningBannerContent>
        </StyledSegmentsWarningBannerContainer>
    );
};
export const WarningBannerOmittedSegments = withUseAdvancedPref(
    WarningBannerOmittedSegmentsComponent,
);

export interface ICategoryOverviewProps {
    pageFilters?: any;
    loading: boolean;
    data?: any;
    components: any;
    selectedRows: any;
    graphData: any;
    tableData: any;
    availableMembers: ICustomSegmentAvailableMembers;
    onGraphDDClick: (props) => void;
    tableExcelLink: string;
    getAssetsUrl: (a) => string;
    timeGranularity?: string;
    responseMissingData?: any[];
    tableDataOmitted?: any[];
}

export const SegmentsGroupAnalysisOverview: React.FC<ICategoryOverviewProps> = ({
    components,
    loading,
    pageFilters,
    selectedRows,
    graphData,
    onGraphDDClick,
    tableExcelLink,
    tableData,
    availableMembers,
    timeGranularity,
    responseMissingData,
    tableDataOmitted,
}) => {
    const showWarningMissingData = responseMissingData?.length > 0;
    const showWarningOmittedSegments = tableDataOmitted?.length > 0;
    const [isClosedWarningOmittedSegments, setIsClosedWarningOmittedSegments] = React.useState(
        false,
    );
    const closeWarningOmittedSegments = React.useCallback(
        () => setIsClosedWarningOmittedSegments(true),
        [],
    );

    const fullTableData = React.useMemo(() => {
        return (
            tableData && {
                ...tableData,
                Data: tableDataOmitted.reduce(
                    (acc, tableDataItem) => {
                        return {
                            ...acc,
                            [tableDataItem.SegmentId]: {
                                ...tableDataItem,
                                isDisabled: true, // do not show data cells
                                HasGraphData: false, // to disable row selection
                                rowClass: "segmentRowDisabled", // grey out
                            },
                        };
                    },
                    { ...tableData.Data },
                ),
            }
        );
    }, [tableData, tableDataOmitted]);

    const { SegmentsGroupAnalysisTableContainer, GraphSwitcherComponent } = components;
    const SegmentsVsGroupProps = {
        title: "segments.group.analysis.title",
        titleTooltip: "segments.group.analysis.title.tooltip",
        filters: pageFilters,
        data: graphData,
        selectedRows,
        isLoading: loading,
        onGraphDDClick,
        tableExcelLink,
        rowSelectionProp: "SegmentId",
        availableMembers,
        selectedGranularity: timeGranularity,
        SwitcherComponent: GraphSwitcherComponent,
    };

    const tableProps = {
        isLoading: loading,
        tableData: fullTableData,
        selectedRows,
        availableMembers,
        tableSelectionKey: "SegmentsGroupAnalysisTable",
        tableSelectionProperty: "SegmentId",
    };

    return (
        <>
            {showWarningMissingData && <WarningBannerMissingData />}
            {ENABLE_FIREBOLT && showWarningOmittedSegments && !isClosedWarningOmittedSegments && (
                <WarningBannerOmittedSegments
                    onClose={closeWarningOmittedSegments}
                    count={tableDataOmitted.length}
                />
            )}
            <SegmentsAnalysisContainer>
                <SegmentsVsGroupOvertime {...SegmentsVsGroupProps} />
                <SegmentsGroupAnalysisTableContainer {...tableProps} />
            </SegmentsAnalysisContainer>
        </>
    );
};
