import * as React from "react";
import {injectIntl} from "react-intl";
import {IBrowser as ScreenSize} from "redux-responsive";
import {buildLinkProps} from "@bbyca/apex-components";

import {FlexBannerType} from "models";
import Link from "components/Link";

import * as styles from "./style.css";
import {FlexBannerImage} from "./components/FlexBannerImage";
import FlexBannerContent from "./components/FlexBannerContent";

export interface Props {
    data: FlexBannerType;
    screenSize: ScreenSize;
    isAlone: boolean;
    disableSeoAttributes?: boolean;
}

export const FlexBanner: React.StatelessComponent<Props> = (props: Props) => {
    const {
        bodyText,
        event: {ctaText},
        highlightedText,
        image,
        alternateText,
        event,
    } = props.data;
    const shouldDisplaySideways = !!props.isAlone && !!props.screenSize.is.small;
    const bannerLayout = props.isAlone ? styles.singleBannerLayout : styles.multipleBannerLayout;
    const getUniqueKey = (() => {
        let keyIndex = 0;
        return (prefix) => {
            keyIndex++;
            return `${prefix.replace(/\s/g, "-")}-${keyIndex}`;
        };
    })();
    const flexBannerChildren = [
        <FlexBannerContent
            key={getUniqueKey("content")}
            bodyText={bodyText}
            ctaText={ctaText}
            highlightedText={highlightedText}
        />,
    ];
    let eventProps = null;
    let eventLinkProps = null;
    let targetSelf = null;
    if (event) {
        if (!event.eventType || event.eventType === "externalUrl") {
            targetSelf = {targetSelf: true};
        }
        eventProps = buildLinkProps(event);
        eventLinkProps = eventProps;
    }

    shouldDisplaySideways
        ? flexBannerChildren.push(
              <FlexBannerImage
                  key={getUniqueKey("content")}
                  image={image}
                  alternateText={alternateText}
                  screenSize={props.screenSize}
                  disableSeoAttributes={props.disableSeoAttributes}
              />,
          )
        : flexBannerChildren.unshift(
              <FlexBannerImage
                  key={getUniqueKey("content")}
                  image={image}
                  alternateText={alternateText}
                  screenSize={props.screenSize}
                  disableSeoAttributes={props.disableSeoAttributes}
              />,
          );

    return (
        !!props.data && (
            <div
                className={`x-flexBanner ${styles.flexBannerContainer} ${shouldDisplaySideways ? styles.flexRow : ""}`}>
                <Link
                    className={`${bannerLayout} ` + styles.bannerLink}
                    {...eventLinkProps}
                    {...targetSelf}
                    disableSeoAttributes={props.disableSeoAttributes}>
                    {flexBannerChildren}
                </Link>
            </div>
        )
    );
};

export default injectIntl<Props>(FlexBanner);
