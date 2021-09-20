import React, { useCallback, useMemo } from 'react';
import { useUpdateViewInOrganizationViewMutation } from './UpdateViewInOrganizationViewMutation.generated';
import { useViewFiltersContextQuery } from './ViewFiltersContextQuery.generated';
import { BoardTableViewFilter } from './filters/BoardTableViewFilter';
import { DueFilter, LabelsFilter, MembersFilter } from './filters';
import { ListFilter } from './filters/ListFilter';
import {
  ViewFiltersContext,
  ViewFiltersContextValue,
  ViewFiltersSourceEditable,
} from './ViewFiltersContext';
import { Spinner } from '@trello/nachos/spinner';
import isEqual from 'react-fast-compare';
import { ViewFilters } from './ViewFilters';

interface SavedViewProviderProps {
  idWorkspaceView: string;
  idView: string;
  children: React.ReactNode;
}

export const SavedViewProvider: React.FunctionComponent<SavedViewProviderProps> = ({
  idWorkspaceView,
  idView,
  children,
}) => {
  const { data, error, loading } = useViewFiltersContextQuery({
    variables: { idOrganizationView: idWorkspaceView },
  });
  const [
    updateViewInOrganizationView,
  ] = useUpdateViewInOrganizationViewMutation();

  // Currently we only support 1 view per organization view, but the schema is set up to allow multiple views
  const view = useMemo(() => {
    return data?.organizationView?.views.find((view) => view.id === idView);
  }, [data?.organizationView?.views, idView]);

  // Currently we only support 1 criteria, but the schema is set up to allow multiple criteria
  const cardFilterCriteria = useMemo(() => {
    return (
      view?.cardFilter.criteria[0] || {
        // Default empty criteria if there isn't one defined yet
        __typename: 'OrganizationView_View_CardFilter_Criteria' as 'OrganizationView_View_CardFilter_Criteria',
      }
    );
  }, [view?.cardFilter.criteria]);

  const setNewCardFilterCriteria = useCallback(
    (newCardFilterCriteria) => {
      if (!data?.organizationView || !view || !cardFilterCriteria || loading) {
        return;
      }

      const newView = {
        ...view,
        cardFilter: {
          ...view.cardFilter,
          criteria: [
            newCardFilterCriteria, // Overwrite the first criteria in the array
            ...view!.cardFilter.criteria.slice(1),
          ],
        },
        id: idView,
      };

      updateViewInOrganizationView({
        variables: {
          idOrganizationView: idWorkspaceView,
          idView,
          view: newView,
        },
        // NW 4/16/21: Leaving optimistic response off for now because of issues with re-rendering and having to construct response typenames
        // optimisticResponse: {
        //   __typename: 'Mutation',
        //   updateViewInOrganizationView: {
        //     ...data.organizationView,
        //     views: data.organizationView.views.map((view) =>
        //       view.id === newView.id ? newView : view,
        //     ),
        //   },
        // },
      });
    },
    [
      cardFilterCriteria,
      data?.organizationView,
      idView,
      idWorkspaceView,
      loading,
      updateViewInOrganizationView,
      view,
    ],
  );

  const setFilter = useCallback(
    (filter: BoardTableViewFilter) => {
      const newCardFilterCriteria = {
        ...cardFilterCriteria,
        ...filter.serializeToView(),
      };

      if (isEqual(newCardFilterCriteria, cardFilterCriteria)) {
        return;
      }
      setNewCardFilterCriteria(newCardFilterCriteria);
    },
    [cardFilterCriteria, setNewCardFilterCriteria],
  );

  const clearNonBoardFilters = useCallback(() => {
    if (!data?.organizationView || !view || !cardFilterCriteria || loading) {
      return;
    }

    const newCardFilterCriteria = {
      ...cardFilterCriteria,
      ...new LabelsFilter().serializeToView(),
      ...new DueFilter().serializeToView(),
      ...new MembersFilter().serializeToView(),
      ...new ListFilter().serializeToView(),
    };

    setNewCardFilterCriteria(newCardFilterCriteria);
  }, [
    cardFilterCriteria,
    data?.organizationView,
    loading,
    setNewCardFilterCriteria,
    view,
  ]);

  const providerValue: ViewFiltersContextValue<ViewFiltersSourceEditable> = useMemo(() => {
    return {
      viewFilters: {
        filters: ViewFilters.fromSavedView(cardFilterCriteria),
        editable: true,
        setFilter,
        clearNonBoardFilters,
      },
    };
  }, [cardFilterCriteria, setFilter, clearNonBoardFilters]);

  if (error) {
    throw error;
  }
  if (loading) {
    return <Spinner centered />;
  }

  return (
    <ViewFiltersContext.Provider value={providerValue}>
      {children}
    </ViewFiltersContext.Provider>
  );
};
