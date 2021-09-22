interface GroupsWarmupData {
    warmedUpGroups: string[];
    warmUpTime: number;
}

let groupsWarmupData: GroupsWarmupData = {
    warmedUpGroups: null,
    warmUpTime: 0,
};

export function setGroupsWarmUpTime(incomingWarmUpTime: number) {
    groupsWarmupData.warmUpTime = incomingWarmUpTime;
}

export function getGroupsWarmUpTime() {
    return groupsWarmupData.warmUpTime;
}

export function setWarmedUpGroups(groups: string[]) {
    groupsWarmupData.warmedUpGroups = groups;
}

export function wasGroupWarmedUp(groupId: string): boolean {
    const lowerCaseGroupId = groupId.toLowerCase();

    if (!groupsWarmupData.warmedUpGroups) {
        return false;
    }

    for (let i = 0; i < groupsWarmupData.warmedUpGroups.length; ++i) {
        const warmedGroupId = groupsWarmupData.warmedUpGroups[i];
        if (warmedGroupId.toLowerCase() == lowerCaseGroupId) {
            return true;
        }
    }

    return false;
}
