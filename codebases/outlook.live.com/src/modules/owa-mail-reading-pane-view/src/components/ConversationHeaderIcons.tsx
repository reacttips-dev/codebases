import { IconButton } from '@fluentui/react/lib/Button';
import { observer } from 'mobx-react-lite';
import { ConversationAttachmentWellButton } from 'owa-attachment-conversation-well-view';
import { ControlIcons } from 'owa-control-icons';
import { isFeatureEnabled } from 'owa-feature-flags';
import loc from 'owa-localize';
import expandCollapseAllItemParts from 'owa-mail-reading-pane-store/lib/actions/expandCollapseAllItemParts';
import type ConversationReadingPaneViewState from 'owa-mail-reading-pane-store/lib/store/schema/ConversationReadingPaneViewState';
import getConversationReadingPaneViewState from 'owa-mail-reading-pane-store/lib/utils/getConversationReadingPaneViewState';
import isAllItemPartsExpanded from 'owa-mail-reading-pane-store/lib/utils/isAllItemPartsExpanded';
import mailStore from 'owa-mail-store/lib/store/Store';
import canConversationLoadMore from 'owa-mail-store/lib/utils/canConversationLoadMore';
import { getItemToShowFromNodeId } from 'owa-mail-store/lib/utils/conversationsUtils';
import { useComputed } from 'owa-react-hooks/lib/useComputed';
import isSMIMEItem from 'owa-smime/lib/utils/isSMIMEItem';
import { lazyGetTopicsSdkAsync } from 'owa-topic-common/lib/lazyFunctions';
import { TopicDropdownButton } from 'owa-topic-dropdown';
import { ITopicsSDK } from '@1js/cortex-topics-bootstrapper';
import * as React from 'react';
import { collapseConversation, expandConversation } from './ConversationHeaderIcons.locstring.json';
import conversationStyles from './ConversationReadingPane.scss';
import classnamesBind from 'classnames/bind';
import { ZoomButtons } from 'owa-custom-zoom';

const classNames = classnamesBind.bind(conversationStyles);

export interface ConversationHeaderIconsProps {
    conversationId: string;
}

export default observer(function ConversationHeaderIcons(props: ConversationHeaderIconsProps) {
    const [topicsSdk, setTopicsSdk] = React.useState<ITopicsSDK | undefined>(undefined);
    const mountedRef = React.useRef(true);

    React.useEffect(() => {
        if (isFeatureEnabled('csi-owa-topic-dropdown')) {
            lazyGetTopicsSdkAsync
                .importAndExecute()
                .then(topicsSdk => {
                    if (mountedRef.current) {
                        setTopicsSdk(topicsSdk);
                    }
                })
                .catch(() => {});
            return () => {
                mountedRef.current = false; // clean up function
            };
        } else {
            return () => {};
        }
    }, []);

    const getIsAllItemPartsExpanded = useComputed((): boolean => {
        return isAllItemPartsExpanded(props.conversationId);
    });

    const conversationItemParts = mailStore.conversations.get(props.conversationId);
    const sMIMEitems = conversationItemParts
        ? conversationItemParts.conversationNodeIds.filter(nodeId => {
              const item = getItemToShowFromNodeId(nodeId);
              if (item) {
                  return isSMIMEItem(item);
              }

              return false;
          })
        : [];

    const renderAttachmentWell = (
        selectedConversationReadingPaneState: ConversationReadingPaneViewState,
        canLoadMore: boolean
    ): JSX.Element => {
        if (selectedConversationReadingPaneState?.attachmentWell) {
            return (
                <ConversationAttachmentWellButton
                    viewState={selectedConversationReadingPaneState.attachmentWell}
                    canLoadMore={canLoadMore}
                    instrumentationContext={
                        selectedConversationReadingPaneState.instrumentationContext
                    }
                />
            );
        }
        return null;
    };

    const renderTopicButton = (viewState: ConversationReadingPaneViewState) =>
        !!viewState &&
        isFeatureEnabled('csi-owa-topic-dropdown') &&
        topicsSdk?.isTopicsEnabled() ? (
            <TopicDropdownButton
                conversationId={viewState.conversationId.Id}
                topicsSdk={topicsSdk}
                isLoading={viewState.loadingState.isLoading}
            />
        ) : null;

    const renderExpCollConversationButton = (
        selectedConversationReadingPaneState: ConversationReadingPaneViewState
    ): JSX.Element => {
        if (
            selectedConversationReadingPaneState?.itemPartsMap &&
            selectedConversationReadingPaneState.itemPartsMap.size > 1
        ) {
            return getIsAllItemPartsExpanded.get() ? (
                <IconButton
                    title={loc(collapseConversation)}
                    ariaLabel={loc(collapseConversation)}
                    onClick={onCollapseConversationClicked}
                    iconProps={{ iconName: ControlIcons.CollapseContent }}
                    className={conversationStyles.expCollConversationButton}
                />
            ) : (
                <IconButton
                    title={loc(expandConversation)}
                    ariaLabel={loc(expandConversation)}
                    onClick={onExpandConversationClicked}
                    iconProps={{ iconName: ControlIcons.ExploreContent }}
                    className={conversationStyles.expCollConversationButton}
                />
            );
        }
        return null;
    };

    const renderZoomButtons = (): JSX.Element => {
        if (isFeatureEnabled('rp-embiggen-dev')) {
            return <ZoomButtons />;
        }
        return null;
    };

    const onExpandConversationClicked = () => {
        expandCollapseAllItemParts(
            props.conversationId,
            true /*shouldExpand*/,
            false /*isFromShortcut*/
        );
    };
    const onCollapseConversationClicked = () => {
        expandCollapseAllItemParts(
            props.conversationId,
            false /*shouldExpand*/,
            false /*isFromShortcut*/
        );
    };
    const conversationReadingPaneViewState = getConversationReadingPaneViewState(
        props.conversationId
    );
    const canLoadMore: boolean = canConversationLoadMore(props.conversationId);
    const topicButton = renderTopicButton(conversationReadingPaneViewState);
    const attachmentWell =
        sMIMEitems.length === 0
            ? renderAttachmentWell(conversationReadingPaneViewState, canLoadMore)
            : null;
    const expCollConversationButton = renderExpCollConversationButton(
        conversationReadingPaneViewState
    );
    const zoomButtons = renderZoomButtons();

    if (topicButton || attachmentWell || expCollConversationButton) {
        return (
            <div
                className={classNames(
                    conversationStyles.headerIconsContainer,
                    isFeatureEnabled('mon-tri-subjectHeader') &&
                        conversationStyles.stackedSubjectIcons
                )}>
                {zoomButtons}
                {topicButton}
                {attachmentWell}
                {expCollConversationButton}
            </div>
        );
    }
    return null;
});
