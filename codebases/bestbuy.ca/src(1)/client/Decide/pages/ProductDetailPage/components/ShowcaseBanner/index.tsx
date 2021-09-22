import * as React from "react";
import {InjectedIntlProps, injectIntl} from "react-intl";
import {LinkEventType} from "@bbyca/apex-components";
import {Button} from "@bbyca/bbyca-components";

import Image from "components/Image";
import {ResponsiveImageType} from "models";
import Link from "components/Link";

import messages from "./translations/messages";
import * as styles from "./style.css";

export interface Props {
    title: string;
    backgroundImage: ResponsiveImageType;
    event?: LinkEventType;
    disableSeoAttributes?: boolean;
}

export class ShowcaseBanner extends React.Component<Props & InjectedIntlProps> {
    public render() {
        return (
            <div className={`x-showcaseBanner ${styles.showcaseBannerContainer}`}>
                <Link
                    className={styles.bannerLink}
                    href={this.props.event.url}
                    disableSeoAttributes={this.props.disableSeoAttributes}
                    external>
                    <div className={styles.bannerContent}>
                        <span className={styles.tag}>{this.props.intl.formatMessage(messages.bannerLabel)}</span>
                        <p className={styles.headline}>{this.props.title}</p>
                        <Button appearance="tertiary" className={styles.showcaseBannerButton} size="small">
                            {this.props.intl.formatMessage(messages.cta)}
                        </Button>
                    </div>
                    <div className={styles.gradient}></div>
                    <div className={styles.imagePositionWrapper}>
                        <div className={styles.imageWrapper}>
                            <Image src={this.props.backgroundImage.small.x1} />
                        </div>
                    </div>
                </Link>
            </div>
        );
    }
}

export default injectIntl<Props>(ShowcaseBanner);
