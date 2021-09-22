import * as React from "react";
import {IBrowser as ScreenSize} from "redux-responsive";
import {HomePageContent} from "models";
import DynamicContent from "components/DynamicContent";
import {AdLoader, AdItem} from "components/Advertisement";
import {buildAdItemsFromSectionData} from "components/Advertisement/AdSlotUtils";
import {GoogleAdsEventAdSlot} from "components/Advertisement/GooglePublisherTag";
import ContactUs from "components/ContactUs";
import {DynamicContentFeatureToggles} from "config/featureToggles";

export interface Props {
    screenSize: ScreenSize;
    content: HomePageContent;
    regionName: string;
    isMobileApp?: boolean;
    loading?: boolean;
    language: Language;
    locale: Locale;
    appEnv: string;
    updateDynamicContentAdStatus: (adId: string, adRendered: boolean, adSlot: GoogleAdsEventAdSlot) => void;
    dynamicContentFeatureToggles: DynamicContentFeatureToggles;
}

export class HomePageLayout extends React.Component<Props> {
    public render() {
        const {
            content,
            screenSize,
            regionName,
            loading,
            language,
            locale,
            isMobileApp,
            appEnv,
            updateDynamicContentAdStatus,
            dynamicContentFeatureToggles,
        } = this.props;
        const primarySectionList = [
            {
                items: content.primary,
                className: "x-homepage-primary-banner",
            },
        ];
        const loadAds = () => {
            if (!isMobileApp) {
                const adTargetingProps = {
                    environment: appEnv,
                    lang: locale,
                };
                const allSectionAdItems: AdItem[] = [
                    ...buildAdItemsFromSectionData(primarySectionList),
                    ...buildAdItemsFromSectionData(content.sections),
                ];
                return (
                    <AdLoader
                        items={allSectionAdItems}
                        adTargetingProps={adTargetingProps}
                        callbackOnAdRendered={updateDynamicContentAdStatus}
                    />
                );
            }
        };

        return (
            <>
                {loadAds()}
                <DynamicContent
                    key="primary"
                    screenSize={screenSize}
                    regionName={regionName}
                    sectionList={primarySectionList}
                    language={language}
                    isLoading={loading}
                    isMobileApp={isMobileApp}
                />
                <DynamicContent
                    screenSize={screenSize}
                    regionName={regionName}
                    sectionList={content.sections}
                    isLoading={loading}
                    language={language}
                    isMobileApp={isMobileApp}
                    dynamicContentFeatureToggles={dynamicContentFeatureToggles}
                />
                {content.displayContactUs && <ContactUs />}
            </>
        );
    }
}

export default HomePageLayout;
