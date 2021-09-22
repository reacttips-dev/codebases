import { observer } from 'mobx-react-lite';
import { isFeatureEnabled } from 'owa-feature-flags';
import { lazyGetTopicsSdkAsync } from 'owa-topic-common/lib/lazyFunctions';
import { TopicDropdownButton } from 'owa-topic-dropdown';
import { ITopicsSDK } from '@1js/cortex-topics-bootstrapper';
import * as React from 'react';
import type { ClientItemId } from 'owa-client-ids';
import type { ClientItem } from 'owa-mail-store';
import mailStore from 'owa-mail-store/lib/store/Store';
import type ItemReadingPaneViewState from 'owa-mail-reading-pane-store/lib/store/schema/ItemReadingPaneViewState';
import conversationStyles from './ItemHeaderIcons.scss';
import classnamesBind from 'classnames/bind';
const classNames = classnamesBind.bind(conversationStyles);
import { ZoomButtons } from 'owa-custom-zoom';

export interface ItemHeaderIconsProps {
    viewState: ItemReadingPaneViewState;
    itemId: ClientItemId;
    item?: ClientItem;
}

export default observer(function ItemHeaderIcons(props: ItemHeaderIconsProps) {
    props = {
        item: mailStore.items.get(props.itemId?.Id),
        ...props,
    };
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
    }, [props.itemId]);

    const topicButton =
        isFeatureEnabled('csi-owa-topic-dropdown') && topicsSdk?.isTopicsEnabled() ? (
            <TopicDropdownButton
                isLoading={props.viewState?.loadingState?.isLoading}
                item={props.item}
                conversationId={props.item?.ConversationId?.Id}
                topicsSdk={topicsSdk}
            />
        ) : null;

    const renderZoomButtons = (): JSX.Element => {
        if (isFeatureEnabled('rp-embiggen-dev')) {
            return <ZoomButtons />;
        }
        return null;
    };
    const zoomButtons = renderZoomButtons();

    if (topicButton) {
        return (
            <div
                className={classNames(
                    conversationStyles.headerIconsContainer,
                    conversationStyles.stackedSubjectIcons
                )}>
                {zoomButtons}
                {topicButton}
            </div>
        );
    }
    return null;
});
