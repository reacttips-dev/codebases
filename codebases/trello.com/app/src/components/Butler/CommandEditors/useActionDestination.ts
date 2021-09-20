import { useEffect, useMemo, useState } from 'react';
import { formatButlerCommand as format } from 'app/src/components/Butler/formatButlerCommand';
import { useActionDestinationQuery } from './ActionDestinationQuery.generated';
import { SelectOption } from './CommandSelect';

const createOption = ({
  id,
  name,
}: {
  id: string;
  name: string;
}): SelectOption => ({
  label: name,
  value: id,
});

interface HookResult {
  idBoard: string | undefined | null;
  boards: SelectOption[];
  lists: SelectOption[];
  loading: boolean;
  selectBoard: (idBoard: string) => void;
}

/**
 * Reusable hook for formatting destination options. Fetches the open boards the
 * member has access to, and the open lists for that board. When changing the
 * selected board, refetch lists for the new board.
 * @param initialIdBoard Board to preselect for first load.
 * @param selectedBoardName If this hook needs to be rerendered (e.g. in the
 * list menu popover, which doesn't use screens), pass in the selected board
 * name attached to the action, for accurate population.
 * @param skip Whether to skip the query.
 */
export const useActionDestination = ({
  initialIdBoard,
  selectedBoardName,
  skip = false,
}: {
  initialIdBoard: string;
  selectedBoardName?: string;
  skip?: boolean;
}): HookResult => {
  const [idBoard, selectBoard] = useState<string | undefined | null>(
    // If selectedBoardName is defined, pull the correct board ID below.
    selectedBoardName ? undefined : initialIdBoard,
  );
  const { data, loading } = useActionDestinationQuery({
    variables: { idBoard: idBoard || initialIdBoard, initialIdBoard },
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    skip,
  });

  const { boards, lists } = useMemo(() => {
    if (!data?.board || !data?.member) {
      return { boards: [], lists: [] };
    }
    const boards = data.member.boards.map(createOption);
    // If the current board isn't included in the member's boards, add it.
    // (e.g. the user has access to a team board but isn't a member)
    if (
      !boards.some(({ value }) => value === initialIdBoard) &&
      data.initialBoard
    ) {
      boards.push(createOption(data.initialBoard));
      boards.sort((a, b) => a.label.localeCompare(b.label));
    }
    return {
      boards,
      lists: data.board.lists?.map(createOption) ?? [],
    };
  }, [initialIdBoard, data]);

  // Butler actions store boards only as names, unfortunately. If this hook is
  // rerendered at any point, we need to cross-reference the board selected from
  // within the action with what we actually have.
  useEffect(() => {
    if (typeof idBoard === 'undefined' && selectedBoardName && boards.length) {
      selectBoard(
        // Fallback to null to avoid infinite loops.
        boards.find(({ label }) => label === selectedBoardName)?.value ?? null,
      );
    }
  }, [idBoard, selectedBoardName, boards]);

  return { idBoard, boards, lists, loading, selectBoard };
};

export const positionOptions: SelectOption[] = [
  { label: format('top'), value: 'top' },
  { label: format('bottom'), value: 'bottom' },
];
