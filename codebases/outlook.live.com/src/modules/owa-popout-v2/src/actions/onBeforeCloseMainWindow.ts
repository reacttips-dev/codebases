import { action } from 'satcheljs';

export interface BeforeCloseMainWindowParam {
    redirectUrl: string;
}

const onBeforeCloseMainWindow = action(
    'Popout_BeforeCloseMainWindow',
    (tabId: string, param: BeforeCloseMainWindowParam) => ({ tabId, param })
);

export default onBeforeCloseMainWindow;
