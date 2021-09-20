/* eslint-disable import/no-default-export */
import classNames from 'classnames';
import { CloseIcon } from '@trello/nachos/icons/close';
import {
  performSearch,
  setSearchQuery,
} from 'app/gamma/src/modules/state/models/search';
import { State } from 'app/gamma/src/modules/types';
import {
  removeSavedSearch,
  SavedSearchUpdate,
  updateSavedSearchPosition,
} from 'app/gamma/src/modules/state/models/saved-searches';
import React from 'react';
import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
  Droppable,
  DroppableProvided,
  DropResult,
} from 'react-beautiful-dnd';
import { connect } from 'react-redux';
import { getMe } from 'app/gamma/src/selectors/members';
import { ProductFeatures } from '@trello/product-features';
import { getSavedSearches } from 'app/gamma/src/selectors/saved-searches';
import { SavedSearchModel } from 'app/gamma/src/types/models';
import { Dispatch } from 'app/gamma/src/types';
import preventDefault from 'app/gamma/src/util/prevent-default';
import DeleteSearchMenu from './delete-search-menu';
import { getMyTeams } from 'app/gamma/src/selectors/teams';

import styles from './search-results.less';

import { forTemplate } from '@trello/i18n';
import { Button } from '@trello/nachos/button';
const format = forTemplate('search_instant_results');

interface DispatchProps {
  onDelete: (id: string) => void;
  onExecuteSavedSearch: (query: string) => void;
  reorderSavedSearched: (orderUpdate: SavedSearchUpdate) => void;
}
interface StateProps {
  savedSearches: SavedSearchModel[];
  isSavedSearchEnabled: boolean;
}
interface AllProps extends StateProps, DispatchProps {}

interface SavedSearchesState {
  isDeleteConfirmActive: string;
}

const mapStateToProps = (state: State) => {
  return {
    savedSearches: getSavedSearches(state),
    isSavedSearchEnabled:
      ProductFeatures.isFeatureEnabled(
        'savedSearches',
        getMe(state)?.products?.[0],
      ) ||
      getMyTeams(state).some(({ premiumFeatures }) =>
        premiumFeatures?.includes('savedSearches'),
      ),
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    onDelete(id: string) {
      dispatch(removeSavedSearch(id));
    },
    onExecuteSavedSearch(query: string) {
      dispatch(setSearchQuery({ query }));
      dispatch(performSearch({}));
    },
    reorderSavedSearched(orderUpdate: SavedSearchUpdate) {
      dispatch(updateSavedSearchPosition(orderUpdate));
    },
  };
};

class SavedSearches extends React.Component<AllProps, SavedSearchesState> {
  state = {
    isDeleteConfirmActive: '',
  };

  addDeleteConfirmation = (id: string) => {
    this.setState({ isDeleteConfirmActive: id });
  };

  removeDeleteConfirmation = () => this.setState({ isDeleteConfirmActive: '' });

  renderDeleteMenu = (id: string) => {
    const { onDelete } = this.props;
    const { isDeleteConfirmActive } = this.state;

    if (id === isDeleteConfirmActive) {
      return (
        <DeleteSearchMenu
          id={id}
          onDelete={onDelete}
          onCancel={this.removeDeleteConfirmation}
        />
      );
    } else {
      return (
        <Button
          appearance="icon"
          className={styles.deleteSavedSearchButton}
          onClick={preventDefault(() => this.addDeleteConfirmation(id))}
          iconBefore={<CloseIcon color="gray" size="small" />}
        />
      );
    }
  };

  renderDraggableWrapper = (search: SavedSearchModel, index: number) => {
    const { isSavedSearchEnabled } = this.props;

    return (
      <Draggable
        key={search.id}
        disableInteractiveElementBlocking={true}
        draggableId={search.id}
        index={index}
        isDragDisabled={!isSavedSearchEnabled}
      >
        {(
          draggableProvided: DraggableProvided,
          draggableSnapshot: DraggableStateSnapshot,
        ) => this.renderListItem(draggableProvided, draggableSnapshot, search)}
      </Draggable>
    );
  };

  renderListItem = (
    draggableProvided: DraggableProvided,
    draggableSnapshot: DraggableStateSnapshot,
    search: SavedSearchModel,
  ) => {
    const { isSavedSearchEnabled, onExecuteSavedSearch } = this.props;
    const { isDeleteConfirmActive } = this.state;

    //Adds dimmer on text when delete confirmation is active
    const buttonStyles = classNames(
      styles.savedSearchButton,
      isDeleteConfirmActive === search.id && styles.muteSavedSearch,
    );

    //Adds dragging class which shouldn't be added on IE11
    const listItemStyles = classNames(
      styles.savedSearchListItem,
      draggableSnapshot.isDragging && styles.isDragging,
    );

    return (
      <div
        ref={draggableProvided.innerRef}
        {...draggableProvided.draggableProps}
        {...draggableProvided.dragHandleProps}
      >
        <div className={listItemStyles} key={search.id}>
          <Button
            appearance="subtle"
            size="fullwidth"
            onClick={preventDefault(() => onExecuteSavedSearch(search.query))}
            className={buttonStyles}
          >
            {search.name}{' '}
            <span className={styles.searchQuery}>{search.query}</span>
          </Button>
          {isSavedSearchEnabled && this.renderDeleteMenu(search.id)}
        </div>
      </div>
    );
  };

  onDragEnd = (result: DropResult) => {
    const { draggableId, source, destination } = result;
    const { reorderSavedSearched } = this.props;
    if (
      // they didn't drop it on a droppable
      !destination ||
      // they dropped it in the same position
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return;
    }
    //User is able to reorder when delete confirmation is active
    //and the delete confirmation clears in classic
    this.removeDeleteConfirmation();

    reorderSavedSearched({
      id: draggableId,
      position: destination.index,
    });
  };

  render() {
    const { isSavedSearchEnabled, savedSearches } = this.props;

    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable
          isDropDisabled={!isSavedSearchEnabled}
          droppableId="saved-searches"
        >
          {(dropableProvided: DroppableProvided) => (
            <section
              ref={dropableProvided.innerRef}
              className={styles.searchResultsSection}
            >
              <div className={styles.searchResultHeading}>
                {format('saved-searches')}
              </div>
              {savedSearches.length ? (
                savedSearches.map((search, index) =>
                  this.renderDraggableWrapper(search, index),
                )
              ) : (
                <span className={styles.noSavedSearchMessage}>
                  {format(
                    'you-have-no-saved-searches-to-save-a-search-start-searching-and-click-save-this-search-in-the-upper-corner',
                  )}
                </span>
              )}
              {dropableProvided.placeholder}
            </section>
          )}
        </Droppable>
        <hr className={styles.savedSearchSeparator} />
      </DragDropContext>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SavedSearches);
