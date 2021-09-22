import { memberCountSingular } from 'owa-locstrings/lib/strings/membercountsingular.locstring.json';
import { memberCountPlural } from 'owa-locstrings/lib/strings/membercountplural.locstring.json';
import {
    privateGroupTooltip,
    publicGroupTooltip,
    groupMembersButton,
} from './stringUtils.locstring.json';
import { privateAccessType } from 'owa-locstrings/lib/strings/privateaccesstype.locstring.json';
import { publicAccessType } from 'owa-locstrings/lib/strings/publicaccesstype.locstring.json';
import loc, { format as stringFormat } from 'owa-localize';
import type { GroupInformation } from '../index';
import UnifiedGroupAccessType from 'owa-service/lib/contract/UnifiedGroupAccessType';

export function getAccessTypeString(groupInformation: GroupInformation) {
    const accessType = groupInformation.groupDetails
        ? groupInformation.groupDetails.AccessType
        : groupInformation.basicInformation
        ? groupInformation.basicInformation.AccessType
        : null;

    if (accessType) {
        if (accessType === UnifiedGroupAccessType.Private) {
            return loc(privateAccessType);
        } else if (accessType === UnifiedGroupAccessType.Public) {
            return loc(publicAccessType);
        }
    }
    return '';
}

export function getAccessTypeTooltip(groupInformation: GroupInformation): string {
    const accessType = groupInformation.groupDetails
        ? groupInformation.groupDetails.AccessType
        : groupInformation.basicInformation
        ? groupInformation.basicInformation.AccessType
        : null;

    if (accessType) {
        if (accessType === UnifiedGroupAccessType.Private) {
            return loc(privateGroupTooltip);
        } else if (accessType === UnifiedGroupAccessType.Public) {
            return loc(publicGroupTooltip);
        }
    }
    return '';
}

export function getMembersButtonText(groupInformation: GroupInformation): string {
    let memberCount = 0;

    if (groupInformation.members) {
        memberCount = groupInformation.members.totalCount;
    } else if (groupInformation.groupDetails) {
        memberCount = groupInformation.groupDetails.MemberCount;
    }

    // There's currently a bug in GetMembers that it's successful and it returns an members array without a totalCount set.
    if (!memberCount) {
        return loc(groupMembersButton);
    }

    if (memberCount > 1) {
        return stringFormat(loc(memberCountPlural), memberCount.toString());
    } else {
        return stringFormat(loc(memberCountSingular), memberCount.toString());
    }
}
