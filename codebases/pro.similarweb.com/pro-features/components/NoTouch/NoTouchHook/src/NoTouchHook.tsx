import { swSettings } from "common/services/swSettings";
import { i18nFilter } from "filters/ngFilters";
import * as React from "react";
import ABService from "services/ABService";
import { allTrackers } from "services/track/track";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import TrialService from "services/TrialService";
import { getListItemsByI18n } from "../../../../utils";
import NoTouchText from "../../NoTouchText";
import { NoTouchTitle, NoTouchTitleNote } from "../../NoTouchTitle";
import {
    NoTouchHookButton,
    NoTouchHookColumn,
    NoTouchHookColumnImg,
    NoTouchHookColumnTransparent,
    NoTouchHookContainer,
    NoTouchHookFooter,
    NoTouchHookIcon,
    NoTouchHookImage,
    NoTouchHookImageAutoHeight,
    NoTouchHookLink,
    NoTouchHookList,
    NoTouchHookPrice,
    NoTouchMoreLink,
} from "./StyledComponents";

interface INoTouchHookProps {
    onCtaClick?: () => void;
}

const NoTouchHook: React.FunctionComponent<INoTouchHookProps> = ({ onCtaClick }) => {
    const swSites = swSettings.swsites;
    const workspace = new TrialService().getWorkspaceName();
    const vwoNewGeneralHookPopup = ABService.getFlag("vwoNewGeneralHookPopup");
    const isMarketingWorkspace = swSettings.components.MarketingWorkspace?.isAllowed;

    return vwoNewGeneralHookPopup && isMarketingWorkspace ? (
        <NoTouchHookContainer width="650px">
            <NoTouchHookColumnImg>
                <NoTouchHookImageAutoHeight />
            </NoTouchHookColumnImg>

            <NoTouchHookColumn>
                <NoTouchTitle>{i18nFilter()("stay.ahead.your.competitors")}</NoTouchTitle>
                <NoTouchText>{i18nFilter()("purchase.our.monthly.plan")}:</NoTouchText>
                <NoTouchHookList>
                    {getListItemsByI18n("hook_no_touch.marketing.nt_list.line_")}
                </NoTouchHookList>
                <NoTouchHookLink
                    href={`${swSites.light}/corp/pricing?workspace=${workspace}`}
                    target="_blank"
                    onClick={() => {
                        allTrackers.trackEvent(
                            "nt hook",
                            "click",
                            `View features/go to pricing page/${workspace}`,
                        );
                    }}
                >
                    {i18nFilter()("and.much.more")}
                </NoTouchHookLink>
                <NoTouchHookFooter>
                    <a
                        href={`${swSites.login}/purchase?workspace=${workspace}`}
                        target="_blank"
                        onClick={() => {
                            allTrackers.trackEvent(
                                "nt hook",
                                "click",
                                `Buy NT/go to payment page/${workspace}`,
                            );
                        }}
                    >
                        <NoTouchHookButton type="trial">
                            {i18nFilter()("hook_no_touch.button_purchase.text")}
                        </NoTouchHookButton>
                    </a>
                    <NoTouchMoreLink
                        onClick={() => {
                            TrackWithGuidService.trackWithGuid("learn.more", "click", {
                                info: "opened marketing solution",
                            });
                        }}
                        href={`${swSites.light}/corp/solution/marketing/`}
                        target="_blank"
                    >
                        {i18nFilter()("learn.more")}
                    </NoTouchMoreLink>
                </NoTouchHookFooter>
            </NoTouchHookColumn>
        </NoTouchHookContainer>
    ) : (
        <NoTouchHookContainer>
            <NoTouchHookColumn>
                <NoTouchTitle>
                    {i18nFilter()(`hook_no_touch.${workspace}.basic_title`)}
                    <NoTouchTitleNote>
                        {i18nFilter()(`hook_no_touch.${workspace}.basic_title_note`)}
                    </NoTouchTitleNote>
                </NoTouchTitle>
                <NoTouchText>{i18nFilter()(`hook_no_touch.${workspace}.basic_text`)}</NoTouchText>
                <NoTouchHookPrice>
                    {i18nFilter()(`hook_no_touch.${workspace}.basic_price`)}
                </NoTouchHookPrice>
                <NoTouchHookList>
                    {getListItemsByI18n(`hook_no_touch.${workspace}.basic_list.line_`)}
                </NoTouchHookList>
                <NoTouchHookFooter>
                    <a
                        href={`${swSites.login}/purchase?workspace=${workspace}`}
                        target="_blank"
                        onClick={() => {
                            allTrackers.trackEvent(
                                "nt hook",
                                "click",
                                `Buy NT/go to payment page/${workspace}`,
                            );
                        }}
                    >
                        <NoTouchHookButton type="trial">
                            {i18nFilter()("hook_no_touch.button_purchase.text")}
                        </NoTouchHookButton>
                    </a>
                </NoTouchHookFooter>
            </NoTouchHookColumn>

            <NoTouchHookColumnTransparent>
                <NoTouchTitle>
                    {i18nFilter()(`hook_no_touch.${workspace}.premium_title`)}
                </NoTouchTitle>
                <NoTouchText>{i18nFilter()(`hook_no_touch.${workspace}.premium_text`)}</NoTouchText>
                <NoTouchHookImage />
                <NoTouchHookList>
                    {getListItemsByI18n(`hook_no_touch.${workspace}.premium_list.line_`).filter(
                        (item, i) => {
                            if (i < 3) {
                                return item;
                            }
                        },
                    )}
                </NoTouchHookList>
                <NoTouchHookLink
                    href={`${swSites.light}/corp/pricing?workspace=${workspace}`}
                    target="_blank"
                    onClick={() => {
                        allTrackers.trackEvent(
                            "nt hook",
                            "click",
                            `View features/go to pricing page/${workspace}`,
                        );
                    }}
                >
                    {i18nFilter()(`hook_no_touch.${workspace}.premium_link.text`)}
                    <NoTouchHookIcon iconName="chev-right" />
                </NoTouchHookLink>
                <NoTouchHookFooter>
                    <NoTouchHookButton
                        type="outlined-negative"
                        onClick={() => {
                            onCtaClick();
                            allTrackers.trackEvent(
                                "nt hook",
                                "click",
                                `Premium/contact us/${workspace}`,
                            );
                        }}
                    >
                        {i18nFilter()("hook_no_touch.button_contact.text")}
                    </NoTouchHookButton>
                </NoTouchHookFooter>
            </NoTouchHookColumnTransparent>
        </NoTouchHookContainer>
    );
};

NoTouchHook.defaultProps = {
    onCtaClick: () => undefined,
};

export default NoTouchHook;
