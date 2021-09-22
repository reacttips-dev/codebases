import { IconButton } from "@similarweb/ui-components/dist/button";
import { AssetsService } from "services/AssetsService";
import { SegmentsUtils } from "services/segments/SegmentsUtils";
import { Banner } from "@similarweb/ui-components/dist/banner";
import { toggleCreateUpdateSegmentGroupModal } from "actions/segmentsModuleActions";
import { i18nFilter } from "filters/ngFilters";
import React from "react";
import { connect } from "react-redux";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { SegmentsUpsellButton } from "pages/segments/styleComponents";
import styled from "styled-components";

const EmptyStateContainer = styled.div`
    border-radius: 5px;
    align-items: center;
    margin-bottom: 20px;
`;

const ComparisonTableEmptyState = (props) => {
    const { toggleCreateUpdateSegmentGroupModal, isMidTierUser, hasGroups } = props;
    const renderCreateGroupButton = React.useMemo(() => {
        const createSegmentsGroup = () => {
            TrackWithGuidService.trackWithGuid(
                "segments.start.page.comparison.table.create.group.button",
                "click",
                {},
            );
            toggleCreateUpdateSegmentGroupModal(true);
        };
        return isMidTierUser ? (
            <SegmentsUpsellButton onClick={SegmentsUtils.openMidTierUserUpsellModal}>
                {i18nFilter()(
                    hasGroups
                        ? "segments.home.comparisons.downgraded.midtier.table.empty.state.button.unlock"
                        : "segment.startpage.comparision.new.compare",
                )}
            </SegmentsUpsellButton>
        ) : (
            <IconButton
                onClick={createSegmentsGroup}
                iconName="add"
                type="primary"
                iconSize="sm"
                placement="left"
            >
                {i18nFilter()("segment.startpage.comparision.new.compare")}
            </IconButton>
        );
    }, []);
    return (
        <EmptyStateContainer>
            <Banner
                title={i18nFilter()(
                    hasGroups
                        ? "segments.home.comparisons.downgraded.midtier.table.empty.state.title"
                        : "segments.home.comparisons.table.empty.state.title",
                )}
                subtitle={i18nFilter()(
                    hasGroups
                        ? "segments.home.comparisons.downgraded.midtier.table.empty.state.subtitle"
                        : "segments.home.comparisons.table.empty.state.subtitle",
                )}
                buttonType="primary"
                iconImagePath={AssetsService.assetUrl(
                    "/images/segments/group-table-empty-state.svg",
                )}
                buttonIconName={"add"}
                buttonText={i18nFilter()("segment.startpage.comparision.new.compare")}
                iconImageHeight={64}
                iconImageWidth={64}
                CustomButton={renderCreateGroupButton}
            />
        </EmptyStateContainer>
    );
};

function mapDispatchToProps(dispatch) {
    return {
        toggleCreateUpdateSegmentGroupModal: (isOpen, segmentGroup?) => {
            dispatch(toggleCreateUpdateSegmentGroupModal(isOpen, segmentGroup));
        },
    };
}

export default connect(undefined, mapDispatchToProps)(ComparisonTableEmptyState);
