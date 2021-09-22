import { IconFill } from "@similarweb/ui-components/dist/icon-fill";
import _ from "lodash";
import * as React from "react";
import { StatelessComponent } from "react";
import MediaQuery from "react-responsive";
import DesktopHeaderSection from "./DesktopHeaderSection";
import EmptyHeaderSection from "./EmptyHeaderSection";
import LoadingHeaderSection from "./LoadingHeaderSection";
import MobileHeaderSection from "./MobileHeaderSection";
import { RatingNum } from "./StyledComponents";

export function roundByHalf(num) {
    if (num < 0.25) {
        return 0.5;
    } // at least half star
    const whole = Math.floor(num);
    const part = num - whole;
    return whole + (part < 0.25 ? 0 : part > 0.75 ? 1 : 0.5);
}

export function getRating(rating) {
    if (!rating) {
        return null;
    }
    return [
        <RatingNum key="num">{rating.toFixed(1)}</RatingNum>,
        <IconFill key="rating" value={roundByHalf(rating)} total={5} iconName="star" />,
    ];
}

const HeaderSection: StatelessComponent<any> = (props) => {
    if (props.loading) {
        return <LoadingHeaderSection />;
    }
    if (!props.data || _.get(props, "data.title", "").length === 0) {
        // fallback for empty or very partial data
        return <EmptyHeaderSection {...props} />;
    }
    return (
        <section>
            <MediaQuery query="(min-width: 501px)">
                <DesktopHeaderSection {...props} />
            </MediaQuery>
            <MediaQuery query="(max-width: 500px)">
                <MobileHeaderSection {...props} />
            </MediaQuery>
        </section>
    );
};
HeaderSection.displayName = "HeaderSection";
export default HeaderSection;
