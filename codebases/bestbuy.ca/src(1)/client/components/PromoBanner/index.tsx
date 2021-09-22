import * as React from "react";
import {
    convertLocaleToLang,
    PromoBanner as PromoBannerInterface,
} from "models";
import { InjectedIntlProps, injectIntl } from "react-intl";
import { IBrowser as ScreenSize } from "redux-responsive";
import Link from "components/Link";
import MerchBanner from "components/MerchBanner";
import { buildLinkProps } from "@bbyca/apex-components";
import Divider from "@material-ui/core/Divider";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import * as styles from "./style.css";

export interface Props {
    merchItem: PromoBannerInterface;
    screenSize: ScreenSize;
    className?: string;
    isMobileApp?: boolean;
    noPadding?: boolean;
    noDivider?: boolean;
    language: Language;
}

export class PromoBanner extends React.Component<Props & InjectedIntlProps> {
    public render() {
        const merchItemEvent = {
            ...this.props.merchItem.event,
            language: convertLocaleToLang(this.props.intl.locale as Locale),
        };
        const merchItemWithLanguage = {
            ...this.props.merchItem,
            event: merchItemEvent,
        };

        return (
            <div className={`${styles.container} x-promo-banner`}>
                <div className={`${styles.bannerContainer} ${this.props.className ? this.props.className : ""} ${this.props.noPadding ? styles.noPadding : ""}`}>
                    <MerchBanner
                        {...merchItemWithLanguage}
                        screenSize={this.props.screenSize}
                        belongsWithText={this.hasMarketingText()}
                        isMobileApp={this.props.isMobileApp}
                    />
                    {this.renderTextSection()}
                </div>
                {!this.props.noDivider && <Divider className={styles.dividerWithMargin} />}
            </div>
        );
    }

    private hasMarketingText = () => {
        const {
            merchItem: {
                ctaText,
                headline1,
                headline2,
            },
        } = this.props;

        return !!(ctaText || headline1 || headline2);
    }

    private renderTextSection = () => {
        const {
            merchItem: {
                alternateText,
                event,
            },
            isMobileApp,
            language,
        } = this.props;

        const ariaLabel = !event.eventType || event.eventType === "externalUrl" ? null : { ariaLabel: alternateText };

        if (this.hasMarketingText()) {
            return event.eventType ?
                <Link className={styles.textContainer} {...buildLinkProps({ ...event, language }, isMobileApp)} {...ariaLabel}>
                    {this.renderTextContent()}
                </Link> :
                <div className={styles.textContainer} {...ariaLabel}>
                    {this.renderTextContent()}
                </div>;
        } else {
            return null;
        }
    }

    private renderTextContent = () => {
        const {
            merchItem: {
                ctaText,
                headline1,
                headline2,
            },
        } = this.props;

        return (
            <>
                {headline1 && <h2 className={styles.headline1}>{headline1}</h2>}
                {headline2 && <p className={styles.headline2}>{headline2}</p>}
                {ctaText &&
                    <div className={styles.ctaContainer}>
                        <span>{ctaText}</span>
                        <KeyboardArrowRight
                            className={styles.icon}
                            classes={{
                                root: styles.arrowIcon,
                            }}
                            viewBox={"0 0 18 18"} />
                    </div>
                }
            </>
        );
    }
}

export default injectIntl<Props>(PromoBanner);
