import React, { Fragment, useCallback, useEffect, useReducer, useRef } from 'react';
import { connect } from 'react-redux';
import cn from 'classnames';

import useMartyContext from 'hooks/useMartyContext';
import { getPDPTrackingPropsFormatted, priceToFloat } from 'helpers/ProductUtils';
import { SmallLoader } from 'components/Loader';
import {
  getLists,
  getListsForItemId,
  heartProduct,
  toggleHeartingLoginModal,
  unHeartProduct
} from 'actions/hearts';
import NewCollectionModal from 'components/account/Collections/NewCollectionModal';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import useEvent from 'hooks/useEvent';

import css from 'styles/components/account/socialCollectionsWidget.scss';

const OPEN = 'OPEN';
const SHOW_MORE = 'SHOW_MORE';
const SAVE_COLLECTION = 'SAVE_COLLECTION';
const ON_OPEN_MENU = 'ON_OPEN_MENU';
const SHOW_NEW_COLLECTION_MODAL = 'SHOW_NEW_COLLECTION_MODAL';
const IS_LOADING = 'IS_LOADING';

const initialState = {
  showMore: false,
  showNewCollectionModal: false,
  isLoading: false,
  hasOpened: false
};

const reducer = (state, action) => {
  const { type, showMore, showNewCollectionModal, isLoading } = action;
  switch (type) {
    case OPEN:
      return { ...state, hasOpened: true };
    case SHOW_MORE:
      return { ...state, showMore };
    case SAVE_COLLECTION:
      return { ...state, showMore: true, showNewCollectionModal: false };
    case SHOW_NEW_COLLECTION_MODAL:
      return { ...state, showNewCollectionModal };
    case IS_LOADING:
      return { ...state, isLoading };
    case ON_OPEN_MENU:
      return { ...state, showMore: true, isLoading: true };
    default:
      return initialState;
  }
};

const CreateNewCollection = ({
  showMore,
  toggleNewCollectionModal,
  testId,
  canAddNewCollection,
  hydraBlueSkyPdp
}) => canAddNewCollection && (
  <button
    type="button"
    className={css.addNew}
    aria-expanded={showMore}
    onClick={toggleNewCollectionModal(true)}
    data-test-id={testId('addToNewCollection')}
  >
    {hydraBlueSkyPdp ? 'Create New' : 'Add to new Collection'}
  </button>
);

export const SocialCollectionsWidget = ({
  canAddNewCollection = false,
  shouldAddImmediately = false,
  heartProduct,
  unHeartProduct,
  isCustomer,
  getStyleId,
  getLists,
  getListsForItemId,
  toggleHeartingLoginModal,
  hearts,
  colorId,
  productId,
  price,
  missingDimension,
  sourcePage,
  hydraBlueSkyPdp,
  productImages
}) => {
  const firstList = useRef();

  const [state, dispatch] = useReducer(reducer, initialState);

  const {
    showMore,
    showNewCollectionModal,
    isLoading,
    hasOpened
  } = state;

  const { marketplace: { account: { simpleCollections } } } = useMartyContext();

  const itemId = getStyleId();
  const priceAsFloat = typeof price === 'string' ? priceToFloat(price) : price;

  const {
    lists,
    itemIdLists
  } = hearts;

  const { testId } = useMartyContext();

  useEffect(() => {
    if (simpleCollections || !showMore) {
      return;
    }

    const bindCloseEvent = e => {
      if (!e.target.closest(`[data-collection="${itemId}"]`)) {
        dispatch({ type: SHOW_MORE, showMore: false });
      }
    };

    document.body.addEventListener('click', bindCloseEvent);
    return () => document.body.removeEventListener('click', bindCloseEvent);

  }, [itemId, showMore, simpleCollections]);

  const onGetListsForItemId = listId => {
    getListsForItemId({ itemId }).then(() => {
      dispatch({ type: IS_LOADING, isLoading: false });
      if (listId) {
        document.getElementById(listId)?.focus();
      } else {
        firstList.current?.focus();
      }
    });
  };

  // Handler for escape keyboard key
  useEvent(document, 'keyup', (keyboard => {
    if (showMore) {
      const key = keyboard.key || keyboard.keyCode;
      if (key === 'Escape' || key === 'Esc' || key === 27) {
        onCloseMenu();
      }
    }
  }));

  const getHeartInfo = (listId = 'h.') => ({
    itemId,
    listId,
    colorId,
    productId,
    price: priceAsFloat,
    missingDimension,
    sourcePage
  });

  const getListDetails = useCallback(() => {
    if (!lists) {
      getLists().then(onGetListsForItemId);
    } else {
      onGetListsForItemId();
    }
  }, [lists]); // eslint-disable-line react-hooks/exhaustive-deps

  // OIDIA: checks if the user has hearted this product before on load
  useEffect(() => {
    if (hydraBlueSkyPdp && isCustomer) {
      getListDetails();
    }
  }, [getListDetails, isCustomer, hydraBlueSkyPdp]);

  const onCloseMenu = () => {
    dispatch({ type: SHOW_MORE, showMore: false });
  };

  const onOpenMenu = () => {
    if (!isCustomer) {
      return toggleHeartingLoginModal(true);
    }

    if (!hasOpened) {
      dispatch({ type: OPEN });
    }

    if (shouldAddImmediately && !hasOpened) { // heart product to default list immediately when opened
      heartProduct(getHeartInfo(), getListDetails);
    } else { // otherwise, just get an updated list of collections
      getListDetails();
    }

    dispatch({ type: ON_OPEN_MENU });
  };

  const onCollectionChange = e => {
    const { checked, id } = e.currentTarget;
    dispatch({ type: IS_LOADING, isLoading: true });

    // `checked` comes back as the state it "will be" once its been clicked
    const heartType = checked ? heartProduct : unHeartProduct;
    heartType(getHeartInfo(id), () => {
      onGetListsForItemId(id);
    });
  };

  const onSaveNewCollection = response => {
    const { listId } = response;
    dispatch({ type: SAVE_COLLECTION });

    heartProduct(getHeartInfo(listId), () => {
      getLists().then(onGetListsForItemId);
    });
  };

  const toggleNewCollectionModal = useCallback(showNewCollectionModal => () => {
    dispatch({ type: SHOW_NEW_COLLECTION_MODAL, showNewCollectionModal });
  }, []);

  // suppress the rendering of this component if marketplace is Simple Collections
  if (simpleCollections) {
    return null;
  }

  // Legacy settings
  let basicStyle = shouldAddImmediately && !hasOpened;
  let saveLabel = 'Add to Collection';

  // OIDIA version
  if (hydraBlueSkyPdp) {
    basicStyle = !(itemIdLists?.length > 0);
    saveLabel = `${basicStyle ? 'Save' : 'Saved'} to Favorites`;
  }

  return (
    <>
      <div
        data-collection={itemId}
        className={cn(css.container, { [css.blueSky]: hydraBlueSkyPdp, [css.showMore]: showMore })}
      >
        <button
          type="button"
          aria-expanded={showMore}
          data-test-id={testId('addToFavorites')}
          onClick={showMore ? onCloseMenu : onOpenMenu}
          className={cn(css.addToButton, { [css.basic]: basicStyle })}
          {...getPDPTrackingPropsFormatted('Favorites', 'Button-Click')}
        >
          <span>{saveLabel}</span>
        </button>
        {showMore && (
          <div className={css.lists}>
            {!hydraBlueSkyPdp && (
              <CreateNewCollection
                showMore={showMore}
                toggleNewCollectionModal={toggleNewCollectionModal}
                testId={testId}
                canAddNewCollection={canAddNewCollection}
                hydraBlueSkyPdp={hydraBlueSkyPdp}
              />
            )}
            {lists && itemIdLists && !isLoading ? (
              lists.map(({ listId, name }, index) => {
                const matchingList = itemIdLists.find(itemIdList => listId === itemIdList.listId);
                return (
                  <Fragment key={listId}>
                    <input
                      id={`${listId}`}
                      ref={index === 0 ? firstList : null} // focus on first list checkbox
                      onChange={onCollectionChange}
                      defaultChecked={matchingList}
                      type="checkbox" />
                    <label htmlFor={`${listId}`} data-test-id={testId(`collection_${name}`)}>{name}</label>
                  </Fragment>
                );
              })
            ) : <SmallLoader />}
            {hydraBlueSkyPdp && (
              <CreateNewCollection
                showMore={showMore}
                toggleNewCollectionModal={toggleNewCollectionModal}
                testId={testId}
                canAddNewCollection={canAddNewCollection}
                hydraBlueSkyPdp={hydraBlueSkyPdp}
              />
            )}
          </div>
        )}
      </div>
      {canAddNewCollection && (
        <NewCollectionModal
          productImages={productImages}
          hydraBlueSkyPdp={hydraBlueSkyPdp}
          showNewCollectionModal={showNewCollectionModal}
          onCancelModal={toggleNewCollectionModal(false)}
          onDoneModal={onSaveNewCollection}
        />
      )}
    </>
  );
};

export const mapStateToProps = state => ({
  isCustomer: !!state.cookies['x-main'],
  hearts: state.hearts
});

const ConnectedSocialCollectionsWidget = connect(mapStateToProps, {
  getLists,
  getListsForItemId,
  heartProduct,
  unHeartProduct,
  toggleHeartingLoginModal
})(SocialCollectionsWidget);

export default withErrorBoundary('SocialCollectionsWidget', ConnectedSocialCollectionsWidget);
