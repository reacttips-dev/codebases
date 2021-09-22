// [be-tech-debt] not all item types pass back atomic validations on drafts so for some we must parse the publish error to display better error messages
export const getErrorIsSlugifiableError = (error: string) => !!error?.includes('is not slugifiable');
