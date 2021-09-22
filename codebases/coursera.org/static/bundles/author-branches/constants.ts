const exported = {
  storeNames: {
    BRANCHES_STORE: 'BranchesStore',
    SESSIONS_STORE: 'SessionsStore',
    COURSE_MATERIAL_STORE: 'CourseMaterialStore',
  } as const,

  branchStatus: {
    LIVE: 'live',
    ARCHIVED: 'archived',
    PENDING: 'pending',
    NEW: 'new',
    UPCOMING: 'upcoming',
    CREATING: 'creating',
  } as const,

  ALL_BRANCHES: 'ALL_BRANCHES',
};

export type BranchStatusValues = typeof exported.branchStatus[keyof typeof exported.branchStatus];

export default exported;

export const { storeNames, branchStatus, ALL_BRANCHES } = exported;
