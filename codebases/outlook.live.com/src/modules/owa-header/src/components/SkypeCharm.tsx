import { observer } from 'mobx-react-lite';
import { skypeCharm_ariaLabel } from 'owa-locstrings/lib/strings/skypecharm_arialabel.locstring.json';
import {
    skypeEnterpiseCharmBadgeCount_ariaLabel,
    skypeCharmBadgeCount_ariaLabel,
} from './SkypeCharm.locstring.json';
import { skypeEnterpriseCharm_ariaLabel } from 'owa-locstrings/lib/strings/skypeenterprisecharm_arialabel.locstring.json';
import loc from 'owa-localize';
import ChatProvider from 'owa-skype-for-business/lib/store/schema/ChatProvider';
import HeaderCharm from './HeaderCharm';
import { ControlIcons } from 'owa-control-icons';
import { isFeatureEnabled } from 'owa-feature-flags';
import { UcmaChatView, lazySetIsSkypeShown } from 'owa-skype-for-business';
import getUnreadChatsCount from 'owa-skype-for-business/lib/chatManager/getUnreadChatsCount';
import { getStore } from 'owa-skype-for-business/lib/store/chatStore';
import presenceStore from 'owa-skype-for-business/lib/store/presenceStore';
import ChatSignInState from 'owa-skype-for-business/lib/store/schema/ChatSignInState';
import { HeaderCharmType } from 'owa-header-store';

import * as React from 'react';
import {
    lazyUpdateIsGlimpseOpen,
    SkypeGlimpse,
    skypeStore,
    lazyShouldShowUnreadConversationCount,
} from 'owa-skype';

const TEAMS_URLS = 'https://teams.microsoft.com';

export default observer(function SkypeCharm(props: {}) {
    const charmDiv = React.useRef<HTMLButtonElement>();
    const renderCharm = (
        isActive: boolean,
        icon: ControlIcons,
        label: string,
        labelWithBadgeCount: string,
        content: JSX.Element,
        onClick: () => void,
        getBadgeCount: () => number
    ) => {
        return (
            <HeaderCharm
                ref={charmDiv}
                key="skype"
                icons={{
                    iconName: icon,
                    hoverIconName: icon,
                }}
                title={label}
                ariaLabel={label}
                ariaLabelWithBadgeCount={labelWithBadgeCount}
                behavior={{
                    isActive,
                    content,
                    onClick,
                    charm: HeaderCharmType.SkypeCharm,
                }}
                getBadgeCount={getBadgeCount}
            />
        );
    };
    const renderCharmContent = (): JSX.Element => {
        return <SkypeGlimpse onDismiss={onDismiss} target={charmDiv.current} />;
    };
    const isBusiness = isFeatureEnabled('fwk-skypeBusinessV2');
    if (isBusiness) {
        const skypeForBusinessStore = getStore();
        const chatProvider = skypeForBusinessStore.chatProvider;
        switch (chatProvider) {
            case ChatProvider.UCMA:
                return (
                    !isFeatureEnabled('fwk-skypeSuite') &&
                    presenceStore.signInState == ChatSignInState.SignedIn &&
                    renderCharm(
                        skypeForBusinessStore.isChatCalloutShown,
                        ControlIcons.SkypeForBusinessLogo,
                        loc(skypeEnterpriseCharm_ariaLabel),
                        loc(skypeEnterpiseCharmBadgeCount_ariaLabel),
                        skypeForBusinessStore.isChatCalloutShown && (
                            <UcmaChatView onDismiss={onUcmaDismiss} target={charmDiv.current} />
                        ),
                        onClickUcmaOrUcwaCharm,
                        getUnreadChatsCount
                    )
                );
            case ChatProvider.UCWA:
                return (
                    !isFeatureEnabled('fwk-skypeSuite') &&
                    renderCharm(
                        skypeForBusinessStore.isChatCalloutShown,
                        ControlIcons.SkypeForBusinessLogo,
                        loc(skypeEnterpriseCharm_ariaLabel),
                        loc(skypeEnterpiseCharmBadgeCount_ariaLabel),
                        null,
                        onClickUcmaOrUcwaCharm,
                        getUnreadChatsCount
                    )
                );
            case ChatProvider.Teams:
                return (
                    !isFeatureEnabled('fwk-skypeSuite') &&
                    renderCharm(
                        false,
                        ControlIcons.OfficeChat,
                        loc(skypeEnterpriseCharm_ariaLabel),
                        loc(skypeEnterpiseCharmBadgeCount_ariaLabel),
                        undefined /* content */,
                        onClickTeams,
                        getBadgeCount
                    )
                );
            default:
                return null;
        }
    } else {
        return (
            skypeStore.isSwcInitialized &&
            renderCharm(
                skypeStore.isGlimpseOpen,
                ControlIcons.SkypeLogo,
                loc(skypeCharm_ariaLabel),
                loc(skypeCharmBadgeCount_ariaLabel),
                skypeStore.isGlimpseOpen && renderCharmContent(),
                onClickNonUcmaCharm,
                getBadgeCount
            )
        );
    }
});

function onDismiss() {
    lazyUpdateIsGlimpseOpen.importAndExecute(false);
}

function onUcmaDismiss() {
    lazySetIsSkypeShown.importAndExecute(false);
}

function getBadgeCount() {
    return lazyShouldShowUnreadConversationCount.tryImportForRender()
        ? skypeStore.unreadConversationCount
        : null;
}

function onClickUcmaOrUcwaCharm() {
    lazySetIsSkypeShown
        .import()
        .then(setIsSkypeShown => setIsSkypeShown(!getStore().isChatCalloutShown));
}

function onClickNonUcmaCharm() {
    const isOpen = skypeStore.isGlimpseOpen;
    lazyUpdateIsGlimpseOpen.importAndExecute(!isOpen);
}

function onClickTeams() {
    window.open(TEAMS_URLS);
}
