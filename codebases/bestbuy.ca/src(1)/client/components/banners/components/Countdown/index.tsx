import * as React from "react";
import * as styles from "./styles.css";
import countdownHook from "./hooks/countdownHook";
import FlipCard from "./components/FlipCard";
import {classname} from "utils/classname";
import {CSSProperties} from "@material-ui/core/styles/withStyles";
import {injectIntl, InjectedIntlProps} from "react-intl";
import messages from "./translations/messages";

export interface CountdownTimerProps extends InjectedIntlProps {
    label?: string;
    textColour?: string;
    toDate: Date;
}

enum titles {
    days = "days",
    hours = "hours",
    minutes = "minutes",
    seconds = "seconds",
}

export const Countdown: React.FC<CountdownTimerProps> = ({label, textColour, toDate, intl}) => {
    const countDown = countdownHook(toDate);
    const {formatMessage} = intl;
    const countdownTitles = [
        formatMessage(messages.days),
        formatMessage(messages.hours),
        formatMessage(messages.minutes),
        formatMessage(messages.seconds),
    ];
    const cardStyle: CSSProperties =
        (!!textColour && {
            color: textColour,
        }) ||
        {};
    return (
        <div className={classname([styles.countdownClock])}>
            {label && <div className={styles.label}>{label}</div>}
            <div className={styles.counter}>
                {Object.values(countDown).map((value, index) => {
                    const title = countdownTitles[index];
                    const hideUnit = index === 0 && value <= 0;
                    return (
                        !hideUnit && (
                            <div
                                aria-label={`${value} ${countdownTitles[index]}`}
                                key={countdownTitles[index] + "-container"}
                                className={styles.unitSection}>
                                <div aria-hidden="true" className={styles.cardContainer}>
                                    <div style={{...cardStyle}}>
                                        <FlipCard
                                            key={countdownTitles[index]}
                                            className={classname([styles.flipCard])}
                                            minCharacters={title === titles.days ? 1 : 2}
                                            val={value}
                                        />
                                    </div>
                                    <div className={styles.title}>{countdownTitles[index]}</div>
                                </div>
                            </div>
                        )
                    );
                })}
            </div>
        </div>
    );
};

export default injectIntl(Countdown);
