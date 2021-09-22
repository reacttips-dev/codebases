import * as React from "react";
import {classname} from "utils/classname";
import * as styles from "./styles.css";
import {Cookie, CookieUtils, DisplayDefault as Expandable, GlobalErrorMessage} from "@bbyca/bbyca-components";
import DateInput from "./components/DateInput";
import {isNumeric} from "./utils/validators";
import {injectIntl, InjectedIntlProps} from "react-intl";
import messages from "./translations/messages";

export interface AgeGateProps {
    ageRestricted?: boolean;
    ageRequired?: number;
    className?: string;
}

export enum AgeGateStatus {
    unknown,
    blocked,
    allowed,
}

export enum consts {
    ageSetEvent = "USER_AGE_SET",
    ageGateCookieName = "ageGateRestrictionAge",
    defaultMinAge = 18,
    UTCStartYear = 1970,
}

const calculateAge = (year: number, month: number, day: number) => {
    const dob = new Date(year, month - 1, day);
    const diff = Date.now() - dob.getTime();
    const age = new Date(diff);
    return Math.abs(age.getUTCFullYear() - consts.UTCStartYear);
};

const getSessionStatus = (requiredAge: number): AgeGateStatus => {
    const sessionCookie = CookieUtils.getCookie(consts.ageGateCookieName);
    const sessionAge: number = (sessionCookie && parseInt(sessionCookie.value, 10)) || -1;

    switch (true) {
        case sessionAge > -1 && sessionAge < requiredAge:
            return AgeGateStatus.blocked;
        case sessionAge >= requiredAge:
            return AgeGateStatus.allowed;
        default:
            return AgeGateStatus.unknown;
    }
};

export const AgeGate: React.FunctionComponent<AgeGateProps & InjectedIntlProps> = ({
    className,
    ageRequired = consts.defaultMinAge,
    ageRestricted,
    children,
    intl,
}) => {
    const [ageGateStatus, setStatus] = React.useState(
        ageRestricted ? getSessionStatus(ageRequired) : AgeGateStatus.allowed,
    );
    const [overlayActive, setOverlayActive] = React.useState(false);
    const [hasValidationError, setValidationError] = React.useState(false);
    const {formatMessage} = intl;
    const showOverlay = overlayActive && ageGateStatus !== AgeGateStatus.allowed;

    const handleVideoClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setOverlayActive(true);
    };

    interface FormResponseData {
        [value: string]: any;
    }
    const handleSubmit = (
        type: string,
        e: React.FormEvent,
        data: {
            year?: FormResponseData;
            month?: FormResponseData;
            day?: FormResponseData;
        },
    ) => {
        const {year = {}, month = {}, day = {}} = data;
        const userAge =
            isNumeric(year.value) && isNumeric(month.value) && isNumeric(day.value)
                ? calculateAge(year.value, month.value, day.value)
                : -1;
        e.preventDefault();
        setValidationError(false);
        CookieUtils.setCookie(new Cookie(consts.ageGateCookieName, userAge.toString()));
        window.dispatchEvent(new CustomEvent(consts.ageSetEvent, {detail: userAge}));
        if (userAge >= ageRequired) {
            setStatus(AgeGateStatus.allowed);
        } else {
            setStatus(AgeGateStatus.blocked);
        }
    };

    const handleError = (type: string) => {
        setValidationError(true);
    };

    const handleAgeEvent = (e: Event) => {
        const {detail} = e as CustomEvent;
        const userAge = parseInt(detail, 10);
        if (userAge >= ageRequired) {
            setStatus(AgeGateStatus.allowed);
        } else if (userAge < ageRequired && userAge > -1) {
            setStatus(AgeGateStatus.blocked);
        }
    };

    React.useEffect(() => {
        window.addEventListener(consts.ageSetEvent, handleAgeEvent);
        return () => window.removeEventListener(consts.ageSetEvent, handleAgeEvent);
    }, []);

    return (
        <div className={classname([styles.container, showOverlay && styles.active])}>
            <div className={classname([className, styles.ageGate])}>
                <div className={styles.background}></div>
                <div className={styles.content}>
                    {ageGateStatus === AgeGateStatus.blocked && (
                        <h2 className={classname([styles.heading, styles.restrictedMsg])}>
                            {formatMessage(messages.restrictedMsg)}
                        </h2>
                    )}
                    <Expandable open={ageGateStatus === AgeGateStatus.unknown && overlayActive}>
                        <h2 className={styles.heading}>{formatMessage(messages.heading)}</h2>
                        <Expandable open={hasValidationError}>
                            <div className={classname([styles.errorMsg, hasValidationError && styles.active])}>
                                <GlobalErrorMessage>{formatMessage(messages.validationError)}</GlobalErrorMessage>
                            </div>
                        </Expandable>
                        <DateInput onSubmit={handleSubmit} onError={handleError} />
                    </Expandable>
                </div>
            </div>
            <div className={styles.restrictedItem}>
                {children}
                {ageGateStatus !== AgeGateStatus.allowed && (
                    <button onClick={handleVideoClick} className={styles.clickOverlay}>
                        <span className={styles.accessibleContent}>play video</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default injectIntl(AgeGate);
