import { observer } from 'mobx-react-lite';

import { FocusZone, FocusZoneDirection } from '@fluentui/react/lib/FocusZone';
import { Icon } from '@fluentui/react/lib/Icon';
import { Image } from '@fluentui/react/lib/Image';
import { AriaProperties, AriaRoles, generateDomPropertiesForAria } from 'owa-accessibility';
import {
    getModuleUrl,
    getModuleUrlForNewAccount,
    lazyGetCloudCacheAccount,
    lazyAddCloudCacheAccount,
    store,
    AddCloudCacheAccountCallout,
} from 'owa-cloud-cache-accounts-option';
import { ControlIcons } from 'owa-control-icons';
import { isFeatureEnabled } from 'owa-feature-flags';
import WebSessionType from 'owa-service/lib/contract/WebSessionType';
import { getOwaResourceUrl } from 'owa-resource-url';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import * as React from 'react';
import { LightningId } from 'owa-lightning-core-v2/lib/LightningId';
import isIndexedPath from 'owa-url/lib/isIndexedPath';
import { logUsage } from 'owa-analytics';
import { isPremiumConsumer } from 'owa-session-store';
import isOfficeRailEnabled from 'owa-left-rail-utils/lib/isOfficeRailEnabled';
import { Module } from 'owa-workloads';

import OUTLOOK_SVG from './svg/outlook.svg';
import GOOGLE_SVG from './svg/Google.svg';
import styles from './AccountSwitcher.scss';
import classnamesBind from 'classnames/bind';
let classNames = classnamesBind.bind(styles);

export interface AccountSwitcherProps extends React.HTMLAttributes<HTMLAnchorElement> {
    /**
     *  The action to call when the item is clicked and it also represents the active session.
     * - (eg, clicking Gmail while in Gmail)
     */
    activeAccountAction?: (ev?: React.MouseEvent<unknown>) => void;
}

interface AccountSwitcherEntry {
    /**
     *  The name of the account icon to use.
     */
    iconUrl: string;

    /*
     * The action to call when the item is clicked.
     * If a method, the method will be called.
     * If a string, the window will be navigated to the given string as a url.
     */
    action?:
        | ((ev?: React.MouseEvent<unknown>, item?: AccountSwitcherEntry, index?: number) => void)
        | string;

    /**
     *  If the action is a string we will navigate to that string. This parameter allows us to define if we
     *  should open it in the same tab or not.
     */
    openInSameTab?: boolean;

    ariaLabel?: string;

    title: string;

    sessionType: WebSessionType;
}

export const AccountSwitcher = observer(function AccountSwitcher(props: AccountSwitcherProps) {
    React.useEffect(() => {
        if (getUserConfiguration().SessionSettings.WebSessionType === WebSessionType.GMail) {
            // since user can always sign into another account from Google sign in page,
            // we always need to make a Post call to keep the linking info in sync
            lazyAddCloudCacheAccount.importAndExecute();
        } else {
            lazyGetCloudCacheAccount.importAndExecute(
                getUserConfiguration().SessionSettings.WebSessionType
            );
        }
    }, []);
    const addNewAccountElement = React.useRef<HTMLElement>();
    const renderItem = (item: AccountSwitcherEntry, index: number) => {
        let isSelected = item.sessionType == getUserConfiguration().SessionSettings.WebSessionType;
        // If item is the selected session, we should render based on activeAccountAction instead.
        if (isSelected) {
            item.action = props.activeAccountAction;
        }
        let onClickCallback = (ev: React.MouseEvent<unknown>) => onItemClicked(ev, item, index);
        let itemAriaProps: AriaProperties = {
            role: AriaRoles.menuitem,
        };
        return (
            <a
                {...generateDomPropertiesForAria(itemAriaProps)}
                data-is-focusable={true}
                key={index}
                onClick={onClickCallback}
                className={classNames(
                    styles.buttonContainer,
                    isOfficeRailEnabled(Module.FilesHub)
                        ? styles.officeRailHoverBg
                        : styles.neutralLightHover
                )}>
                {getAccountIconElement(item, isSelected)}
                <div className={getBorderButtonCSS(item, isSelected)} />
            </a>
        );
    };
    const getAccountIconElement = (
        item: AccountSwitcherEntry,
        isSelected: boolean
    ): JSX.Element => {
        if (item.sessionType === WebSessionType.GMail) {
            if (store.cloudCacheConfigItem.emailAddress === null) {
                return (
                    <>
                        <div ref={setTargetRef}>
                            <Icon
                                iconName={ControlIcons.NewMail}
                                className={getAccountButtonCSS(item, isSelected)}
                                ariaLabel={item.ariaLabel}
                                title={item.ariaLabel}
                            />
                        </div>
                        <AddCloudCacheAccountCallout
                            lid={LightningId.AddCloudCacheAccountCallout}
                            target={setTarget}
                            when={activateCallout}
                        />
                    </>
                );
            } else {
                return (
                    <Image
                        shouldFadeIn={false}
                        src={getOwaResourceUrl(item.iconUrl)}
                        className={getAccountButtonCSS(item, isSelected)}
                        aria-label={item.ariaLabel}
                        title={item.ariaLabel}
                    />
                );
            }
        } else {
            return (
                <Image
                    shouldFadeIn={false}
                    src={getOwaResourceUrl(item.iconUrl)}
                    className={getAccountButtonCSS(item, isSelected)}
                    aria-label={item.ariaLabel}
                    title={item.ariaLabel}
                />
            );
        }
    };
    const setTargetRef = (ref: HTMLElement) => {
        return (addNewAccountElement.current = ref);
    };
    const setTarget = () => {
        return addNewAccountElement.current;
    };
    let accounts: AccountSwitcherEntry[] = [];
    const containerAriaProps: AriaProperties = {
        role: AriaRoles.menu,
    };
    const containerClassName = classNames(props.className, styles.container);
    if (
        isFeatureEnabled('auth-cloudCache') &&
        !getUserConfiguration().IsConsumerChild &&
        (isPremiumConsumer() || getUserConfiguration().SessionSettings.IsShadowMailbox) &&
        isIndexedPath()
    ) {
        accounts = [
            {
                iconUrl: OUTLOOK_SVG,
                action: getModuleUrl(WebSessionType.ExoConsumer),
                openInSameTab: false,
                title: 'Outlook',
                sessionType: WebSessionType.ExoConsumer,
                ariaLabel:
                    store.cloudCacheConfigItem.exchangeSmtpAddress ||
                    getUserConfiguration().SessionSettings.UserEmailAddress,
            },
            {
                iconUrl: store.cloudCacheConfigItem.emailAddress ? GOOGLE_SVG : null,
                action: store.cloudCacheConfigItem.emailAddress
                    ? getModuleUrl(WebSessionType.GMail) +
                      '&login_hint=' +
                      store.cloudCacheConfigItem.emailAddress
                    : getModuleUrlForNewAccount(WebSessionType.GMail),
                openInSameTab: false,
                title: store.cloudCacheConfigItem.emailAddress ? 'Gmail' : 'AddNew',
                sessionType: WebSessionType.GMail,
                ariaLabel: store.cloudCacheConfigItem.emailAddress || 'Add Gmail account',
            },
        ];
    }
    return accounts.length > 0 ? (
        <FocusZone
            className={containerClassName}
            isCircularNavigation={false}
            direction={FocusZoneDirection.vertical}
            {...generateDomPropertiesForAria(containerAriaProps)}>
            {accounts.map(renderItem)}
        </FocusZone>
    ) : null;
});

function getBorderButtonCSS(item: AccountSwitcherEntry, isSelected: boolean): string {
    switch (item.title) {
        case 'Outlook':
        case 'Gmail':
            return classNames(isSelected && styles.floatingBorder);
        default:
            return '';
    }
}

function getAccountButtonCSS(item: AccountSwitcherEntry, isSelected: boolean): string {
    switch (item.title) {
        case 'Outlook':
            return classNames(
                styles.leftRailButton,
                styles.outlookButton,
                !isSelected && styles.leftRailButtonUnselected
            );
        case 'Gmail':
            return classNames(
                styles.leftRailButton,
                styles.gmailButton,
                !isSelected && styles.leftRailButtonUnselected
            );
        case 'AddNew':
            return classNames(styles.addNewButton);
        default:
            return '';
    }
}

function onItemClicked(ev: React.MouseEvent<unknown>, item: AccountSwitcherEntry, index: number) {
    ev.preventDefault();
    ev.stopPropagation();
    if (item.sessionType == WebSessionType.GMail && item.title == 'AddNew') {
        logUsage('addCloudCacheAccountClickedFromAccountSwitcher', null, { isCore: true });
    }
    // If action is a string then open the url in new tab
    if (item.action instanceof String || typeof item.action === 'string') {
        window.open(item.action.toString(), '_blank');
    }
    // If we need to invoke an action do it if it is valid
    else if (item.action instanceof Function) {
        item.action(ev, item, index);
    }
}

function activateCallout(lightup: Function) {
    if (getUserConfiguration().SessionSettings.WebSessionType == WebSessionType.ExoConsumer) {
        setTimeout(lightup, 125);
    }
}
