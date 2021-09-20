/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const React = require('react');
const { l } = require('app/scripts/lib/localize');
const { debounce } = require('underscore');
const { unsplashClient } = require('@trello/unsplash');

const PhotosList = require('./photos-list');

const { DEFAULT_COLLECTION_ID } = unsplashClient.constants;
const DEBOUNCE_DELAY = 250;
const PAGE_SIZE = (function () {
  const maxItemsInScreen = Math.ceil((screen.height / 112) * 2);
  let maxItemsWithBuffer = Math.ceil(maxItemsInScreen * 1.5);

  // We want an even number
  if (maxItemsWithBuffer % 2) {
    maxItemsWithBuffer++;
  }

  return maxItemsWithBuffer;
})();

class PhotosView extends React.Component {
  static initClass() {
    this.prototype.displayName = 'PhotosView';
  }

  constructor(props) {
    super(props);

    const createCollection = (id) => ({
      connectionError: false,
      id,
      images: [],
      isLoading: false,
      marker: null,
      maxPage: 1,
      page: 1,
    });
    this.state = {
      collections: [
        createCollection(DEFAULT_COLLECTION_ID),
        createCollection('search'),
      ],
      defaultCollectionActive: true,
      defaultCollectionShowTitle: false,
      queueID: 0,
      searchTerm: null,
    };
    this.renderList = this.renderList.bind(this);
    this.onSearchInputChange = this.onSearchInputChange.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.updateCollection = this.updateCollection.bind(this);
    this.showErrorInCollection = this.showErrorInCollection.bind(this);
    this.getUnsplashBackgrounds = this.getUnsplashBackgrounds.bind(this);
    this.bindObserver = this.bindObserver.bind(this);
    this.bindMarkers = this.bindMarkers.bind(this);
    this.debouncedGetUnsplashBackgrounds = debounce(
      this.getUnsplashBackgrounds,
      DEBOUNCE_DELAY,
    );
  }

  componentDidMount() {
    // Start requesting the default collection
    return this.getUnsplashBackgrounds(DEFAULT_COLLECTION_ID);
  }

  render() {
    const {
      defaultCollectionActive,
      defaultCollectionShowTitle,
      searchTerm,
    } = this.state;

    return (
      <div className="board-backgrounds-photos">
        <div className="search-photos">
          <input
            onChange={this.onSearchInputChange}
            placeholder={l(['background photos', 'photos'])}
            type="text"
          />
          <span className="icon-sm icon-search" />
        </div>
        <div
          className="board-backgrounds-list-observer"
          ref={this.bindObserver}
        >
          {searchTerm ? this.renderList('search') : undefined}
          {defaultCollectionShowTitle ? (
            <div className="collection-title">
              {l(['background photos', 'top picks'])}
            </div>
          ) : undefined}
          {defaultCollectionActive
            ? this.renderList(DEFAULT_COLLECTION_ID)
            : undefined}
        </div>
      </div>
    );
  }

  //##################################################
  // Helper functions ################################
  //##################################################

  renderList(collectionID) {
    const { boardId } = this.props;
    const { collections } = this.state;
    const {
      connectionError,
      images,
      isLoading,
      maxPage,
      page,
    } = collections.filter((collection) => collection.id === collectionID)[0];

    return (
      <PhotosList
        boardId={boardId}
        collectionID={collectionID}
        connectionError={connectionError}
        images={images}
        isLoading={isLoading}
        maxPage={maxPage}
        page={page}
        registerMarker={this.registerMarker(collectionID)}
      />
    );
  }

  onSearchInputChange(e) {
    const { collections } = this.state;
    const value = e.target.value.trim();

    this.setState({
      collections: collections.map(function (collection) {
        if (collection.id === 'search') {
          collection.images = [];
          collection.isLoading = true;
        }

        return collection;
      }),
      defaultCollectionActive: !value,
      defaultCollectionShowTitle: false,
      searchTerm: value,
    });

    if (value) {
      return this.debouncedGetUnsplashBackgrounds('search');
    }
  }

  nextPage(collectionID) {
    const { collections } = this.state;

    const { page } = collections.filter(
      (collection) => collection.id === collectionID,
    )[0];

    return this.getUnsplashBackgrounds(collectionID, page + 1);
  }

  updateCollection(id, images, maxPage) {
    const collections = this.state.collections.map(function (collection) {
      if (collection.id === id) {
        collection.connectionError = false;
        collection.images = collection.images.concat(images);
        collection.isLoading = false;
        collection.maxPage = maxPage;
      }

      return collection;
    });

    let defaultCollectionActive = true;
    let defaultCollectionShowTitle = false;

    if (id === 'search') {
      defaultCollectionActive = !collections.filter(
        (collection) => collection.id === 'search',
      )[0].images.length;
      defaultCollectionShowTitle = defaultCollectionActive;
    }

    return this.setState({
      collections,
      defaultCollectionActive,
      defaultCollectionShowTitle,
    });
  }

  showErrorInCollection(collectionID) {
    return this.setState({
      collections: this.state.collections.map(function (collection) {
        if (collection.id === collectionID) {
          collection.connectionError = true;
          collection.isLoading = false;
        }
        return collection;
      }),
    });
  }

  getUnsplashBackgrounds(collectionID, page) {
    if (page == null) {
      page = 1;
    }
    let { queueID } = this.state;
    const { collections, searchTerm } = this.state;

    queueID++;

    this.setState({
      queueID,
      collections: collections.map(function (collection) {
        if (collection.id === collectionID) {
          collection.page = page;
          collection.isLoading = true;
        }
        return collection;
      }),
    });

    return (collectionID === 'search'
      ? unsplashClient
          .searchPhotos(searchTerm, page, PAGE_SIZE, true)
          .then(({ results, total }) => {
            // Forget about outdated search requests
            if (this.state.queueID === queueID) {
              return this.updateCollection(
                collectionID,
                results,
                Math.ceil(total / PAGE_SIZE),
              );
            }
          })
      : unsplashClient
          .getCollectionPhotos(collectionID, page, PAGE_SIZE, 'latest')
          .then((images) => {
            // We don't have collection size, so we just make maxPage higher by 1
            let maxPage = page + 1;

            if (images.length < PAGE_SIZE) {
              maxPage = page;
            }

            return this.updateCollection(collectionID, images, maxPage);
          })
    ).catch(() => {
      return this.showErrorInCollection(collectionID);
    });
  }

  registerMarker(collectionID) {
    return (marker) => {
      // React ref will sometimes fire with the first param undefined
      if (!marker) {
        return;
      }

      const collections = this.state.collections.map(function (collection) {
        if (collection.id === collectionID) {
          collection.marker = marker;
        }

        return collection;
      });

      this.setState({ collections });

      if (this.observer) {
        return this.bindMarkers();
      }
    };
  }

  bindObserver(observerRoot) {
    // React ref will sometimes fire with the first param undefined
    if (this.observer || !observerRoot) {
      return;
    }

    const { collections } = this.state;

    const callback = (entries) => {
      return (() => {
        const result = [];
        for (const entry of Array.from(entries)) {
          // We only need isIntersecting, polyfill works but Chrome <= 56 doesn't have it
          const intersected = entry.isIntersecting || entry.intersectionRatio;
          const collection = collections.filter(
            (collection) => collection.marker === entry.target,
          )[0];

          if (intersected && !collection.isLoading) {
            result.push(this.nextPage(collection.id));
          } else {
            result.push(undefined);
          }
        }
        return result;
      })();
    };

    this.observer = new IntersectionObserver(callback, {
      root: observerRoot,
    });

    return this.bindMarkers();
  }

  bindMarkers() {
    const { collections } = this.state;

    this.observer.disconnect();

    return (() => {
      const result = [];
      for (const collection of Array.from(collections)) {
        if (collection.marker) {
          result.push(this.observer.observe(collection.marker));
        } else {
          result.push(undefined);
        }
      }
      return result;
    })();
  }
}

PhotosView.initClass();
module.exports = PhotosView;
