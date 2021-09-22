const formChangedResponseId = (responseId: string, localScopeId?: string | null): string => {
  return localScopeId ? `${responseId}:${localScopeId}` : responseId;
};

export default formChangedResponseId;
