interface Board {
  memberships?: {
    idMember: string;
    deactivated: boolean;
  }[];
}

export function getIsDeactivated(boards: Board | Board[] = []) {
  const allBoards = Array.isArray(boards) ? boards : [boards];
  const deactivatedIds = new Set(
    ([] as string[]).concat(
      ...allBoards.map((board) =>
        board.memberships
          ? board.memberships
              .filter((membership) => membership.deactivated)
              .map((membership) => membership.idMember)
          : [],
      ),
    ),
  );

  return function isDeactivated(idMember: string) {
    return deactivatedIds.has(idMember);
  };
}
