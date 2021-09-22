import * as React from "react";
import {injectIntl, InjectedIntlProps} from "react-intl";
import {NavigationLink} from "models";
import messages from "../../translations/messages";
import {SyncedNav, SideNavMenu, Navigation as MobileNav} from "@bbyca/bbyca-components";
import {classname} from "utils/classname";
import * as styles from "./styles.css";

export interface NavigationProps extends InjectedIntlProps {
    className?: string;
    mobileNavigationData?: NavigationLink;
    navigationData: NavigationLink;
    title?: string;
}
// tslint:disable: jsdoc-format
export const Navigation: React.FC<NavigationProps> = ({
    className,
    navigationData,
    mobileNavigationData,
    title,
    intl,
}) => (
    <>
        <div className={classname([styles.desktopNavigation, className])}>
            <SyncedNav tree={navigationData} backToText={intl.formatMessage(messages.backTo)} />
        </div>
        {/**
         * todo: mobile navigation to be depricated and standardised
         * through <SyncedNav /> for all breakpoints
         */}
        {mobileNavigationData && (
            <div className={styles.mobileNavigation}>
                <SideNavMenu
                    title={title}
                    sideNavContent={() => (
                        <MobileNav
                            isMobile={true}
                            backToText={intl.formatMessage(messages.backTo)}
                            tree={mobileNavigationData}
                        />
                    )}
                />
            </div>
        )}
    </>
);

export default injectIntl(Navigation);
