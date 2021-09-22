const prefix = 'UNGRADED_LAB';

const createActionName = (actionName: string): string => `${prefix}_${actionName}`;

export const LoadUngradedLab = createActionName('LOAD_UNGRADED_LAB');
export const ClearUngradedLab = createActionName('CLEAR_UNGRADED_LAB');
