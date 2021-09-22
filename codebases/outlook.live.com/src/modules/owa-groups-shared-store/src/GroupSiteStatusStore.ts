import { createStore } from 'satcheljs';
import type GroupSiteStatusInformation from './schema/GroupSiteStatusInformation';
import { ObservableMap } from 'mobx';
import type GroupSiteStatus from 'owa-groups-sharepoint-commands/lib/schema/GroupSiteStatus';

// getGroupSiteStatusStore is a map from keys (groupSmtpAddress) to values (groupSiteStatus)
export const getGroupSiteStatusStore = createStore<GroupSiteStatusInformation>(
    'getGroupSiteStatusStore',
    {
        groupSiteStatus: new ObservableMap<string, GroupSiteStatus>(),
    }
);
