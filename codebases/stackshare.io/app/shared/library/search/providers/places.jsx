import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import {SearchContext} from './context';
import {AlgoliaPlacesContext} from '../../../enhancers/algolia-places-enhancer';

export const formatName = hit => {
  let name = hit.locale_names[0];
  if (hit.administrative && hit.administrative.length) {
    name += `, ${hit.administrative[0]}`;
  }
  return name;
};

export const findClosestCity = places =>
  new Promise(resolve =>
    places.search(
      {
        query: '',
        type: 'city',
        language: 'en',
        hitsPerPage: 1,
        aroundLatLngViaIP: true
      },
      (err, res) => {
        if (err) {
          resolve(null);
        } else {
          const [hit] = res.hits;
          resolve({
            id: hit.objectID,
            name: formatName(hit),
            type: 'location',
            _geoloc: hit._geoloc
          });
        }
      }
    )
  );

const createSearch = places => async keyword =>
  new Promise(resolve =>
    places.search(
      {
        query: keyword,
        language: 'en',
        aroundLatLngViaIP: true,
        type: 'city',
        hitsPerPage: 10
      },
      (err, res) => {
        if (err) {
          // eslint-disable-next-line no-console
          console.error(err);
          resolve([]);
        } else {
          resolve(
            res.hits.map(hit => ({
              id: hit.objectID,
              name: formatName(hit),
              type: 'location',
              _geoloc: hit._geoloc
            }))
          );
        }
      }
    )
  );

const PlacesSearchProvider = ({children}) => {
  const places = useContext(AlgoliaPlacesContext);
  return <SearchContext.Provider value={createSearch(places)}>{children}</SearchContext.Provider>;
};

PlacesSearchProvider.propTypes = {
  children: PropTypes.any
};

export default PlacesSearchProvider;
