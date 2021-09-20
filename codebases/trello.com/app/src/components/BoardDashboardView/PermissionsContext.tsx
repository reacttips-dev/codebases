import React, { createContext, useCallback } from 'react';
import { canEdit as canEditBoard } from '@trello/boards';
import { usePermissionsContextQuery } from './PermissionsContextQuery.generated';

interface PermissionsContextState {
  canEdit(): boolean;
}

export const PermissionsContext = createContext<PermissionsContextState>({
  canEdit() {
    return false;
  },
});

interface PermissionsContextProviderProps {
  idBoard: string;
}

export const PermissionsContextProvider: React.FC<PermissionsContextProviderProps> = ({
  idBoard,
  children,
}) => {
  const { data } = usePermissionsContextQuery({
    variables: {
      idBoard,
    },
  });

  const canEdit = useCallback(() => {
    if (!data?.board || !data?.member) {
      return false;
    }
    return canEditBoard(
      data.member,
      data.board,
      data.board.organization || null,
      data.board.organization?.enterprise,
    );
  }, [data]);

  return (
    <PermissionsContext.Provider value={{ canEdit }}>
      {children}
    </PermissionsContext.Provider>
  );
};
