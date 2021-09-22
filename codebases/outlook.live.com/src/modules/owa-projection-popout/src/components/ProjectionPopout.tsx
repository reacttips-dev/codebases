import * as React from 'react';
import { observer } from 'mobx-react-lite';

import type { ClientItemId } from 'owa-client-ids';
import { ProjectionCompose } from 'owa-mail-compose-projection-view';
import { ProjectionReadingPane } from 'owa-mail-popout-reading-pane';
import { ProjectionSxSV2 } from 'owa-sxs-v2-view';
import { ProjectionCalendarCompose } from 'owa-calendar-full-compose-view';

import closeProjection from 'owa-popout-v2/lib/actions/closeProjection';
import renderProjection from 'owa-popout-v2/lib/utils/renderProjection';
import getProjectionViewState from 'owa-popout-v2/lib/selectors/getProjectionViewState';

import { TabType, TabViewState, getTabTitle, TabState } from 'owa-tab-store';
import getTabById from 'owa-tab-store/lib/utils/getTabById';

export interface ProjectionPopoutProps {
    viewState: TabViewState;
}

/**
 * This is a bridge component between parent window and popout window. It renders nothing to parent window,
 * but it will call renderProjection to render the components into popout window.
 */
export default observer(function ProjectionPopout(props: ProjectionPopoutProps) {
    React.useEffect(() => {
        const { viewState } = props;
        const content = getContent();
        const title = getTabTitle(viewState);
        renderProjection(viewState.id, content, title);
    }, [props.viewState.type]);

    const tabId = props.viewState.id;

    React.useEffect(() => {
        const viewState = getProjectionViewState(tabId);
        viewState?.datapoint?.end();

        return () => {
            // If related viewState is stil in store, it means the Popout is being unmounted because the whole view
            // is being unmounted, so we should keep popout window opened and try redirect to deeplink
            const redirectToDeeplink =
                !!getProjectionViewState(tabId) && getTabById(tabId)?.state === TabState.Popout;

            closeProjection(tabId, redirectToDeeplink);
        };
    }, []);

    const getContent = React.useCallback((): JSX.Element => {
        const { viewState } = props;
        let content: JSX.Element = null;
        switch (viewState.type) {
            case TabType.MailCompose:
                content = renderMailCompose(viewState.data);
                break;
            case TabType.SecondaryReadingPane:
                content = renderReadingPane(viewState.data.id);
                break;
            case TabType.SxS:
                content = renderSxS(viewState.sxsId);
                break;
            case TabType.CalendarCompose:
                content = renderCalendarCompose(viewState.data);
                break;
        }
        return content;
    }, [props.viewState.type]);

    return null;
});

function renderMailCompose(composeId: string): JSX.Element {
    return <ProjectionCompose composeId={composeId} />;
}

function renderReadingPane(itemId: ClientItemId): JSX.Element {
    return <ProjectionReadingPane itemId={itemId} />;
}

function renderSxS(sxsId: string): JSX.Element {
    return <ProjectionSxSV2 sxsId={sxsId} />;
}

function renderCalendarCompose(formId: string): JSX.Element {
    return <ProjectionCalendarCompose formId={formId} />;
}
