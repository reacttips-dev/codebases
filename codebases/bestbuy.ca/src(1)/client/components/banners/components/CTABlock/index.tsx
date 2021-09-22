import * as React from "react";
import * as styles from "./styles.css";
import SingleButton, {SingleButtonTypes} from "components/SingleButton";
import {LinkEventType, EventTypes} from "models";
import {classname} from "utils/classname";

interface CTABlockProps {
    className?: string;
    primaryCta?: LinkEventType;
    secondaryCta?: LinkEventType;
    darkTheme?: boolean;
}

const CTABlock: React.FC<CTABlockProps> = ({className = "", primaryCta, secondaryCta, darkTheme}) => (
    <div className={classname([styles.ctaWrp, darkTheme && styles.dark, className])}>
        {!!primaryCta && (
            <SingleButton
                className={styles.primaryCta}
                buttonType={SingleButtonTypes.secondary}
                darkTheme={darkTheme}
                event={primaryCta}
            />
        )}
        {!!secondaryCta && (
            <SingleButton
                className={classname([
                    styles.secondaryCta,
                    secondaryCta.eventType === EventTypes.video && styles.videoLink,
                ])}
                buttonType={
                    secondaryCta.eventType === EventTypes.video ? SingleButtonTypes.tertiary : SingleButtonTypes.link
                }
                darkTheme={darkTheme}
                event={secondaryCta}
            />
        )}
    </div>
);
export default CTABlock;
