import { useRef, useState } from 'react';
import { connect } from 'react-redux';
import cn from 'classnames';

import MelodyModal from 'components/common/MelodyModal';
import useMartyContext from 'hooks/useMartyContext';
import { createHeartList } from 'actions/hearts';

import css from 'styles/components/account/collectionModals/newCollectionModal.scss';

export const NewCollectionModal = ({
  onDoneModal,
  showNewCollectionModal,
  onCancelModal,
  createHeartList,
  hydraBlueSkyPdp,
  productImages = []
}) => {

  // Save collection lifecycle controls
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Collection name ref
  const input = useRef();

  // Testing params
  const { testId } = useMartyContext();

  // Modal callback
  const onAfterOpen = () => {
    setHasError(false);
    input.current?.focus();
  };

  // Form submit handler
  const onSaveNewCollection = e => {
    e.preventDefault();
    const { collectionName: { value } } = e.currentTarget;

    // Resets the lifecycle controls
    setIsLoading(true);
    setHasError(false);

    // Attempts to save the new collection
    createHeartList({ listName: value })
      .then(onDoneModal) // Succeeded
      .catch(() => setHasError(true)) // Failed
      .finally(() => setIsLoading(false)); // Lifecycle update
  };

  // OIDIA: Attempts to retrieve the featured image (first image from the product bundle list)
  const featuredImage = productImages[0] || false;

  return (
    <MelodyModal
      className={css.modal}
      heading="Create New Collection"
      headingTestId="newCollectionModalHeader"
      isOpen={showNewCollectionModal}
      onAfterOpen={onAfterOpen}
      onRequestClose={onCancelModal}
    >
      <div>
        <form method="post" onSubmit={onSaveNewCollection}>
          <div className={cn({ [css.blueSky]: hydraBlueSkyPdp })}>
            {hydraBlueSkyPdp && featuredImage && (
              <div className={css.productImage}>
                <img
                  alt={featuredImage.alt}
                  src={featuredImage.featured.src}
                  srcSet={featuredImage.featured.retinaSrc} />
              </div>
            )}
            <div className={css.fields}>
              <label htmlFor="collectionName">{hydraBlueSkyPdp ? 'Name your collection' : 'Collection Name'}</label>
              <input
                required
                ref={input}
                name="collectionName"
                id="collectionName"
                type="text"
                data-test-id={testId('newCollectionNameInputBox')}/>
              {hasError && (
                <div className={css.errorMsg} data-test-id={testId('newCollectionError')}>
                  <p>Oh No! There was an issue creating your collection. Please try again.</p>
                </div>
              )}
            </div>
          </div>

          <div className={css.footer}>
            <button type="button" onClick={onCancelModal} data-test-id={testId('cancelButton')}>Cancel</button>
            <button type="submit" disabled={isLoading} data-test-id={testId('createButton')}>Create{hydraBlueSkyPdp && ' & save'}</button>
          </div>
        </form>
      </div>
    </MelodyModal>
  );
};

export const mapStateToProps = () => ({});
const ConnectedNewCollectionModal = connect(mapStateToProps, {
  createHeartList
})(NewCollectionModal);

export default ConnectedNewCollectionModal;
