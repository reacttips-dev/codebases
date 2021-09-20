import React from 'react';

export interface MemberInfo {
  id: string | null;
}
const defaultMemberInfo: MemberInfo = { id: null };
export const MemberContext = React.createContext(defaultMemberInfo);
