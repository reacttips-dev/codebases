import { observer } from 'mobx-react-lite';
import { closeTabAriaLabel } from 'owa-locstrings/lib/strings/closetabarialabel.locstring.json';
import loc from 'owa-localize';
import { IconButton } from '@fluentui/react/lib/Button';
import { ControlIcons } from 'owa-control-icons';

import closeTab from 'owa-tab-store/lib/actions/closeTab';
import toggleChatTab from 'owa-tab-store/lib/actions/toggleChatTab';
import type { FloatingChatTabViewState } from 'owa-tab-store/lib/store/schema/TabViewState';
import * as React from 'react';

import styles from './FloatingChatTab.scss';
import classnamesBind from 'classnames/bind';
const classNames = classnamesBind.bind(styles);

export interface FloatingChatTabProps {
    viewState: FloatingChatTabViewState;
    className: string;
    subjectClassName: string;
}

export interface FloatingChatTabState {
    chatTitle: string;
    unreadCount: number;
}

const CHAT_CONTAINER_CLASSES = 'swc chat';

// The string 'Skype Chat Tab' should never be localized, as it will be replaced before we go any further than SDF
// We are waiting on SWC to provide a method to resolve the information about the chat given the ID.
const CHAT_CONTAINER_SUBJECT = 'Skype Chat Tab';

export default observer(function FloatingChatTab(props: FloatingChatTabProps) {
    React.useEffect(() => {
        _isMounted.current = true;
        return () => {
            _isMounted.current = false;
            conversationProxy.current = null;
        };
    }, []);
    const conversationProxy = React.useRef(null);
    const _isMounted = React.useRef<boolean>();
    const [chatTitle_0, setChatTitle] = React.useState<string>(CHAT_CONTAINER_SUBJECT);
    const [unreadCount, setUnreadCount] = React.useState<number>(0);
    const onComponentRefUpdated = (id: string) => (ref: HTMLDivElement) => {
        if (ref && window.swc) {
            if (!conversationProxy.current) {
                const conversationProxyPromise = window.swc.SDK.Chat.startChat(
                    { ConversationId: id },
                    ref
                );
                const { viewState } = props;
                conversationProxyPromise.then(proxy => {
                    if (_isMounted.current) {
                        conversationProxy.current = proxy;
                        if (conversationProxy.current.onTitle) {
                            conversationProxy.current.onTitle(title => {
                                setChatTitle(title);
                            });
                        }
                        if (conversationProxy.current.onUnreadCount) {
                            conversationProxy.current.onUnreadCount(unreadCount => {
                                setUnreadCount(unreadCount);
                            });
                        }
                        if (conversationProxy.current.onClose) {
                            conversationProxy.current.onClose(() => {
                                closeTab(viewState);
                            });
                        }
                        if (conversationProxy.current.onCollapse) {
                            conversationProxy.current.onCollapse(isCollapsed => {
                                if (viewState.isChatActive && isCollapsed) {
                                    toggleChatTab(viewState);
                                }
                            });
                        }
                    }
                });
            }
        }
    };
    const onClickCloseButton = (e: React.MouseEvent<unknown>) => {
        e.stopPropagation();
        closeTab(props.viewState);
    };
    const { viewState, className, subjectClassName } = props;
    const { isChatActive, data } = viewState;
    const chatTitle = unreadCount > 0 ? '(' + unreadCount + ') ' + chatTitle_0 : chatTitle_0;
    return (
        <div className={className} title={chatTitle}>
            <div
                className={classNames(styles.chatContainer, { chatInactive: !isChatActive })}
                onClick={containerOnClick}>
                <div className={CHAT_CONTAINER_CLASSES} ref={onComponentRefUpdated(data)} />
            </div>
            <div className={subjectClassName}>{chatTitle}</div>
            <IconButton
                iconProps={{ iconName: ControlIcons.Cancel }}
                onClick={onClickCloseButton}
                className={styles.rightIcon}
                aria-label={loc(closeTabAriaLabel)}
            />
        </div>
    );
});

function containerOnClick(e: React.MouseEvent<unknown>) {
    e.stopPropagation();
}
