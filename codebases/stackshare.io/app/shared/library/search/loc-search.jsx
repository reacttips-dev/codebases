import React, {useState, useContext, useEffect} from 'react';
import glamorous from 'glamorous';
import GeoMarker from '../icons/geo-marker.svg';
import SearchInput, {Input, renderCloseButton} from './search-input';
import {ASH, WHITE} from '../../style/colors';
import {findClosestCity} from './providers/places';
import {AlgoliaPlacesContext} from '../../enhancers/algolia-places-enhancer';
import PropTypes from 'prop-types';

const FakeInput = glamorous(Input)({
  border: `1px solid ${ASH}`,
  paddingTop: 11,
  paddingBottom: 11,
  borderRadius: 2
}).withComponent('div');

const Container = glamorous.div({
  width: '100%',
  display: 'flex',
  background: WHITE,
  position: 'relative',
  '> div > div > input.SearchInput': {
    border: `1px solid ${ASH}`,
    paddingTop: 11,
    paddingBottom: 11,
    borderRadius: 2
  }
});

const GeoButton = glamorous.button({
  position: 'absolute',
  top: 'calc(50% - 15px)',
  background: 'transparent',
  right: 0,
  zIndex: 100,
  outline: 'none',
  border: 0,
  padding: 0,
  cursor: 'pointer',
  height: 30,
  width: 30,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
});

const LocationSearchInput = ({setLocation, onAdd, location}) => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    setLocation(location);
    onAdd();
  }, [location]);

  const places = useContext(AlgoliaPlacesContext);

  return (
    <Container>
      {location && <FakeInput>{location.name}</FakeInput>}
      {location && renderCloseButton(() => setLocation(null))}
      {!location && (
        <SearchInput
          placeholder="Around me"
          onActive={active => setActive(active)}
          onChange={res => {
            setLocation(res);
            setActive(false);
          }}
        />
      )}
      {!active && !location && (
        <GeoButton
          title="Use my current location"
          onClick={() => findClosestCity(places).then(val => setLocation(val))}
        >
          <GeoMarker />
        </GeoButton>
      )}
    </Container>
  );
};

LocationSearchInput.propTypes = {
  setLocation: PropTypes.func,
  onAdd: PropTypes.func,
  location: PropTypes.object
};

export default LocationSearchInput;
