import * as React from "react";
import {IBrowser as ScreenSize} from "redux-responsive";
import Divider from "@material-ui/core/Divider";

import MerchBanner from "components/MerchBanner";
import {MerchItem, SectionItemTypes, MerchBannerType, ShowcaseBannerType, FlexBannerType} from "models";

import * as styles from "./style.css";
import ShowcaseBanner from "../ShowcaseBanner";
import FlexBanner from "../FlexBanner";

export interface Props {
    screenSize: ScreenSize;
    data: MerchItem[];
    disableSeoAttributes?: boolean;
}

export class SupportContent extends React.Component<Props> {
    public render() {
        const {data, screenSize, disableSeoAttributes} = this.props;
        const bannerData = data.find((x) => x.type === SectionItemTypes.banner);
        const showcaseBannerData = data.find((x) => x.type === SectionItemTypes.showcaseBanner);
        const flexBannerData = data.find((x) => x.type === SectionItemTypes.flexBanner);

        let supportContentWrapper = styles.singleBannerWrapper;
        if (showcaseBannerData && flexBannerData) {
            supportContentWrapper = screenSize.is.small ? styles.bannersRowWrapper : styles.bannersColumnWrapper;
        }
        return (
            <>
                {screenSize.lessThan.medium && <Divider />}
                <div className={styles.container}>
                    {bannerData && (
                        <MerchBanner
                            {...(bannerData as MerchBannerType)}
                            screenSize={this.getOverwrittenScreenSize()}
                            disableSeoAttributes={disableSeoAttributes}
                        />
                    )}
                    <div className={supportContentWrapper}>
                        {showcaseBannerData && (
                            <ShowcaseBanner
                                {...(showcaseBannerData as ShowcaseBannerType)}
                                disableSeoAttributes={disableSeoAttributes}
                            />
                        )}
                        {flexBannerData && (
                            <FlexBanner
                                data={flexBannerData as FlexBannerType}
                                screenSize={this.getOverwrittenScreenSize()}
                                isAlone={!showcaseBannerData}
                                disableSeoAttributes={disableSeoAttributes}
                            />
                        )}
                    </div>
                </div>
            </>
        );
    }

    // TODO: CMS does not currently support asset for large size. Re-using small asset, instead.
    private getOverwrittenScreenSize(): ScreenSize {
        const {screenSize} = this.props;
        if (screenSize.lessThan.medium) {
            return screenSize;
        }
        return {
            ...screenSize,
            lessThan: {
                ...screenSize.lessThan,
                small: true,
            },
        };
    }
}

export default SupportContent;
