import { LinkButton } from "@similarweb/ui-components/dist/link";
import { setWebsiteGroupRecommendationSuccess } from "actions/marketingWorkspaceActions";
import { ActionableTooltip } from "components/ActionableTooltip/src/ActionableTooltip";
import { i18nFilter } from "filters/ngFilters";
import * as React from "react";
import { connect } from "react-redux";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";

const Component = ({
    websiteGroupRecommendationSuccess,
    clearWebsiteGroupRecommendationSuccess,
    children,
}) => {
    const onClick = () => {
        TrackWithGuidService.trackWithGuid(
            "website_group_recommendation_success.see_list.click",
            "click",
        );
        clearWebsiteGroupRecommendationSuccess();
    };
    const onClose = () => {
        TrackWithGuidService.trackWithGuid("website_group_recommendation_success.close", "close");
        clearWebsiteGroupRecommendationSuccess();
    };
    if (websiteGroupRecommendationSuccess) {
        return (
            <ActionableTooltip
                text={i18nFilter()(
                    "workspaces.marketing.websitegroup.recommendation.success.tooltip.text",
                )}
                title={i18nFilter()(
                    "workspaces.marketing.websitegroup.recommendation.success.tooltip.title",
                )}
                button={
                    <LinkButton
                        label={i18nFilter()(
                            "workspaces.marketing.websitegroup.recommendation.success.tooltip.button",
                        )}
                        url={websiteGroupRecommendationSuccess}
                        onClick={onClick}
                    />
                }
                onClose={onClose}
            >
                {children}
            </ActionableTooltip>
        );
    } else {
        return children;
    }
};

const mapStateToProps = ({ marketingWorkspace: { websiteGroupRecommendationSuccess } }) => {
    return {
        websiteGroupRecommendationSuccess,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        clearWebsiteGroupRecommendationSuccess: () => {
            dispatch(setWebsiteGroupRecommendationSuccess(null));
        },
    };
};

export const WebsiteGroupRecommendationSuccess = connect(
    mapStateToProps,
    mapDispatchToProps,
)(Component);
