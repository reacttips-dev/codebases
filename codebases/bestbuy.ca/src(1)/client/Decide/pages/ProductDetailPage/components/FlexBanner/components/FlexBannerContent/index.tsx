import * as React from "react";
import { Button } from "@bbyca/bbyca-components";

import * as styles from "../../style.css";

export interface FlexBannerContentProps {
    ctaText: string;
    bodyText: string;
    highlightedText: string;
}
const FlexBannerContent: React.StatelessComponent<FlexBannerContentProps> = ({
    bodyText,
    highlightedText,
    ctaText,
}: FlexBannerContentProps) => (
        <div className={styles.bannerContent}>
            <span className={styles.bodyText} data-automation="flex-banner-body-text">
                {bodyText}
            </span>
            <div className={styles.highlightedText} data-automation="flex-banner-highlighted-text">
                {highlightedText}
            </div>
            {ctaText &&
                <div className={styles.flexBannerButton} data-automation="flex-banner-button-text">
                    <Button appearance="secondary" size="small" >
                        {ctaText}
                    </Button>
                </div>
            }
        </div>
    );

export default FlexBannerContent;
