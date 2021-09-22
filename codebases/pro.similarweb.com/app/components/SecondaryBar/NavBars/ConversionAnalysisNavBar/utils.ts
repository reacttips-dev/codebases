import { Injector } from "common/ioc/Injector";
import _ from "lodash";
import { ConversionSegmentsUtils } from "pages/conversion/ConversionSegmentsUtils";

export const getCustomSegmentGroupsWithData = (allSegments) => {
    const userSegmentGroups = ConversionSegmentsUtils.getCustomSegmentGroups(allSegments);
    const userSegmentGroupsWithData = userSegmentGroups.map((group) => {
        let segments = [];
        group.segments.map((segmentId) => {
            const customSegment = ConversionSegmentsUtils.getSegmentById(allSegments, segmentId);
            if (!customSegment) {
                return;
            } else {
                segments.push(customSegment);
            }

            segments = _.sortBy(Object.values(segments), ["domain", "segmentName"]);
        });

        // replace the segments property, in the group object, with
        // a new segments property that contains data pertaining to each segment.
        return {
            ...group,
            segments,
        };
    });
    return userSegmentGroupsWithData;
};

export const isGroupSegmentSelected = (group): boolean => {
    const { gid, sid } = Injector.get<any>("swNavigator").getParams();
    if (gid === "nogroup") {
        return false;
    }
    if (gid && sid) {
        return group && group.id === gid && sid && _.find(group.segments, ({ id }) => id === sid)
            ? true
            : false;
    }

    return false;
};

export enum groupMenuActions {
    DELETE,
    RENAME,
    ADD,
    REMOVE,
}
