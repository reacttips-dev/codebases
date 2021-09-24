export const isPrivateMember = (companyId, privateMode) => {
  if (privateMode) {
    return privateMode.id === companyId;
  } else {
    return false;
  }
};
