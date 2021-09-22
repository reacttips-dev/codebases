import * as React from "react";
import { useCallback, useContext, useState } from "react";
import {
    OptInBanner,
    OptInBannerInner,
    OptInBannerInnerBlock,
    OptInBannerMainText,
    OptInBannerSecondaryText,
    StyledLink,
} from "./StyledComponents";
import I18n from "components/WithTranslation/src/I18n";
import { NewLabel } from "components/NewLabel/NewLabel";
import { Button, IconButton } from "@similarweb/ui-components/dist/button";
import { i18nFilter } from "filters/ngFilters";
import {
    IWithUseBetaBranchPref,
    WithUseBetaBranchPref,
} from "pages/website-analysis/TrafficAndEngagement/BetaBranch/useBetaBranchPrefHook";
import { BetaBranchContext } from "pages/website-analysis/TrafficAndEngagement/BetaBranch/BetaBranchContainer";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";

const BetaBranchOptInBannerComponent: React.FC<IWithUseBetaBranchPref> = ({
    useBetaBranchPref,
}) => {
    const [isVisible, setIsVisible] = useState(true);
    const { setIsBetaBranchFeedbackSurveyOpen } = useContext(BetaBranchContext);
    const onClose = useCallback(() => {
        TrackWithGuidService.trackWithGuid("webanalysis.beta.branch.opt.in.banner.close", "click");
        setIsVisible(false);
    }, []);
    const onOptIn = useCallback(() => {
        TrackWithGuidService.trackWithGuid("webanalysis.beta.branch.opt.in.banner.optIn", "click");
        useBetaBranchPref.changePref(true, "BetaOptInBanner");
    }, []);

    const onOptOut = useCallback(() => {
        TrackWithGuidService.trackWithGuid("webanalysis.beta.branch.opt.in.banner.optOut", "click");
        useBetaBranchPref.changePref(false, "BetaOptOutBanner");
    }, []);
    const onOpenFeedbackModal = useCallback(() => {
        TrackWithGuidService.trackWithGuid(
            "webanalysis.beta.branch.opt.in.banner.open.feedback",
            "click",
        );
        setIsBetaBranchFeedbackSurveyOpen(true);
    }, []);
    return !isVisible ? (
        <div />
    ) : (
        <OptInBanner optedIn={useBetaBranchPref.value}>
            <OptInBannerInner>
                <OptInBannerInnerBlock>
                    {!useBetaBranchPref.value && <NewLabel />}
                    <OptInBannerMainText>
                        <I18n>
                            {!useBetaBranchPref.value
                                ? "website.analysis.traffic.and.engagement.beta.data.banner.optin.main"
                                : "website.analysis.traffic.and.engagement.beta.data.banner.optout.main"}
                        </I18n>
                    </OptInBannerMainText>
                    <OptInBannerSecondaryText>
                        <I18n>
                            {!useBetaBranchPref.value
                                ? "website.analysis.traffic.and.engagement.beta.data.banner.optin.secondary"
                                : "website.analysis.traffic.and.engagement.beta.data.banner.optout.secondary"}
                        </I18n>
                    </OptInBannerSecondaryText>
                    <StyledLink
                        label={i18nFilter()(
                            "website.analysis.traffic.and.engagement.beta.data.banner.optin.learn.more",
                        )}
                        url={"https://support.similarweb.com/hc/en-us/articles/360018497238"}
                        target={"_blank"}
                    />
                </OptInBannerInnerBlock>
                <OptInBannerInnerBlock></OptInBannerInnerBlock>

                {!useBetaBranchPref.value ? (
                    <OptInBannerInnerBlock>
                        <Button onClick={onOptIn}>
                            {i18nFilter()(
                                "website.analysis.traffic.and.engagement.beta.data.banner.optin.button",
                            )}
                        </Button>
                        <OptInBannerInnerBlock>
                            <IconButton
                                iconSize={"sm"}
                                iconName="clear"
                                type="flat"
                                onClick={onClose}
                            />
                        </OptInBannerInnerBlock>
                    </OptInBannerInnerBlock>
                ) : (
                    <OptInBannerInnerBlock>
                        <IconButton
                            onClick={onOpenFeedbackModal}
                            type="primary"
                            iconName="response"
                        >
                            {i18nFilter()(
                                "website.analysis.traffic.and.engagement.beta.data.banner.open.feedback.button",
                            )}
                        </IconButton>
                        <OptInBannerInnerBlock>
                            <Button onClick={onOptOut} type="flat">
                                {i18nFilter()(
                                    "website.analysis.traffic.and.engagement.beta.data.banner.optout.button",
                                )}
                            </Button>
                        </OptInBannerInnerBlock>
                    </OptInBannerInnerBlock>
                )}
            </OptInBannerInner>
        </OptInBanner>
    );
};

export default WithUseBetaBranchPref(BetaBranchOptInBannerComponent);
