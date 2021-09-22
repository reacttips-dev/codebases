const exported = {
  Member: 'MEMBER' as const,
  SoftDeletedMember: 'SOFT_DELETED_MEMBER' as const,
  Invited: 'INVITED' as const,
  EmailNotVerified: 'INVITED_EMAIL_NOT_VERIFIED' as const,
  NotMember: 'NOT_MEMBER' as const,
  Whitelisted: 'WHITELISTED' as const,
};

export default exported;
export const { Member, SoftDeletedMember, Invited, EmailNotVerified, NotMember, Whitelisted } = exported;
