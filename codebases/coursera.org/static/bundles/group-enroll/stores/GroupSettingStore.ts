import _ from 'underscore';

import BaseStore from 'vendor/cnpm/fluxible.v0-4/addons/BaseStore';
// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'bund... Remove this comment to see the full error message
import GroupSetting from 'bundles/groups/models/GroupSetting';
// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'bund... Remove this comment to see the full error message
import Group from 'bundles/groups/models/Group';

const SERIALIZED_PROPS: Array<keyof GroupSettingStore$DehydratedState> = [
  'groups',
  'groupsLoaded',
  'groupSettings',
  'groupMemberships',
];

// TODO: Replace any with more specific type
type GroupSettingStore$DehydratedState = {
  groupsLoaded: boolean;
  groups: Array<any>;
  groupSettings: any;
  groupMemberships: any;
};

type UserData = {
  definition: any; // TODO: replace with specific types
  typeName: string;
};

type GroupMembership = {
  createdAt: number;
  groupId: string;
  id: string;
  role: string; // TODO: Replace with enum
  userData: UserData; // TODO: Replace with intersection of all the possible user data objects
  userId: number;
};

class GroupSettingStore extends BaseStore {
  static storeName = 'GroupSettingStore';

  sessionGroup: Group = null;

  sessionGroupLoaded = false;

  groups: Array<Group> = [];

  groupsLoaded = false;

  groupSettings: Array<GroupSetting> = [];

  groupMemberships: Array<GroupMembership> = [];

  emitChange!: () => void;

  static handlers = {
    LOADED_COURSE_GROUPS: 'onLoadedCourseGroups',
    LOADED_SESSION_GROUP: 'onLoadedSessionGroup',
  };

  onLoadedCourseGroups({
    groups = [],
    groupMemberships = [],
    groupSettings = [],
  }: {
    groups: Array<Group>;
    groupMemberships: Array<GroupSetting>;
    groupSettings: Array<GroupMembership>;
  }) {
    this.groups = groups;
    this.groupsLoaded = true;
    this.groupSettings = groupSettings;
    this.groupMemberships = groupMemberships;

    this.emitChange();
  }

  onLoadedSessionGroup({ sessionGroup = null }: { sessionGroup: Group }) {
    this.sessionGroup = sessionGroup;
    this.sessionGroupLoaded = true;

    this.emitChange();
  }

  dehydrate(): GroupSettingStore$DehydratedState {
    return {
      ..._(this).pick(...SERIALIZED_PROPS),
      groupSettings: this.groupSettings && this.groupSettings.map((groupSetting) => groupSetting.toJSON()),
      groups: this.groups.map((group) => group.toJSON()),
    };
  }

  rehydrate(state: GroupSettingStore$DehydratedState) {
    Object.assign(this, {
      ..._(state).pick(...SERIALIZED_PROPS),
      groupSettings: state.groupSettings.map((groupSettingData: $TSFixMe) => new GroupSetting(groupSettingData)),
      groups: state.groups.map((group) => new Group(group)),
    });
  }

  hasLoaded(): boolean {
    return this.groupsLoaded;
  }

  hasSessionGroupLoaded(): boolean {
    return this.sessionGroupLoaded;
  }

  isRosterEnabled(): boolean {
    return !_(this.getMyGroupsWithRosterEnabled()).isEmpty();
  }

  // TODO: Replace any with a more specific type
  getMyGroupsWithRosterEnabled(): any {
    return _(this.groups).filter((group: $TSFixMe) => {
      const rosterSetting = _(this.groupSettings).find(
        (setting: $TSFixMe) => setting.groupId === group.id && setting.key === 'ALLOW_GROUP_ROSTER'
      );

      return rosterSetting && rosterSetting.value;
    });
  }

  // TODO: Replace any with a more specific type
  getMyGroupsWithForumsEnabled(): any {
    return _(this.groups).filter((group: $TSFixMe) => {
      const forumSetting = _(this.groupSettings).find(
        (setting: $TSFixMe) => setting.groupId === group.id && setting.key === 'ALLOW_FORUM'
      );

      return forumSetting && forumSetting.value;
    });
  }

  // TODO: Replace any with a more specific type
  getMyGroupsWithEventsEnabled(): any {
    return _(this.groups).filter((group: $TSFixMe) => {
      const eventSetting = _(this.groupSettings).find(
        (setting: $TSFixMe) => setting.groupId === group.id && setting.key === 'ALLOW_EVENT'
      );

      return eventSetting && eventSetting.value;
    });
  }

  // TODO: Replace any with a more specific type
  getSlackTeamSettings(): any {
    return _(this.groupSettings).filter((setting: $TSFixMe) => setting.key === 'GROUP_SLACK_TEAM_NAME');
  }

  hasGroups(): boolean {
    return this.hasLoaded() && this.groups.length > 0;
  }
}

export default GroupSettingStore;
