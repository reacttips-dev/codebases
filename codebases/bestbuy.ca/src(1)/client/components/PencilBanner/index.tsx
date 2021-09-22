import * as React from "react";
import * as styles from "./styles.css";
import Link from "components/Link";
import Background from "components/Background";
import {SectionImage, Theme} from "models";
import {buildLinkProps, LinkEventProps} from "@bbyca/apex-components";
import {classname, classIf} from "utils/classname";

export interface GlobalPencilBannerProps {
    messageTitle: string;
    messageDetails?: string;
    cta?: LinkEventProps;
    className?: string;
    images?: SectionImage;
    theme: keyof typeof Theme;
    language: Language;
    backgroundColour?: string;
    isMobileApp: boolean;
}

const PencilBanner = (props: GlobalPencilBannerProps) => {
    const {messageTitle, messageDetails, images, theme, cta, language, isMobileApp, backgroundColour} = props;

    const ariaLabel = !cta || cta.eventType === "externalUrl" ? null : {ariaLabel: cta.ctaText};
    const linkProps = buildLinkProps({...(cta as LinkEventProps), language}, isMobileApp);
    const imageRoleProp = images && images.alternateText ? {role: "img", "aria-label": images.alternateText} : null;
    const backgroundStyles = {
        backgroundColor: backgroundColour,
    };

    return !isMobileApp && !!messageTitle ? (
        <div
            className={classname([styles.globalPencilBanner, classIf(styles.light, theme === "light", styles.dark)])}
            style={!!backgroundColour ? backgroundStyles : undefined}
            {...imageRoleProp}>
            {!backgroundColour && <Background images={images} repeatImage={true} theme={theme} />}
            <div className={styles.messageContent}>
                {messageTitle && <span className={styles.messageTitle}>{messageTitle}</span>}
                <div className={styles.messageSubcontent}>
                    {messageDetails && <span className={styles.messageDetails}>{messageDetails}</span>}
                    {cta && (
                        <Link
                            chevronType="right"
                            className={styles.ctaLink}
                            extraAttrs={{"data-automation": "pencil-banner-cta"}}
                            {...linkProps}
                            {...ariaLabel}>
                            {cta.ctaText}
                        </Link>
                    )}
                </div>
            </div>
        </div>
    ) : null;
};

export default PencilBanner;
