import { IUserSegmentType } from "./SegmentCreationFirstStep";

export const USER_SEGMENT_TYPES: IUserSegmentType[] = [
    { id: "1", name: "category" },
    { id: "2", name: "conversion" },
    { id: "3", name: "brand" },
    { id: "4", name: "topic" },
    { id: "5", name: "other" },
];
export const USER_SEGMENT_TYPES_PREFIX = "user.segment.type";
export const getSegmentTypeById = (id: string): IUserSegmentType => {
    if (!id) {
        return undefined;
    }
    const firstIndex = USER_SEGMENT_TYPES.findIndex((item) => item.id === id);
    return USER_SEGMENT_TYPES[firstIndex];
};
