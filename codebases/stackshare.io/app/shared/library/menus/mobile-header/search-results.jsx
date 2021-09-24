import React, {Component} from 'react';
import glamorous from 'glamorous';
import {ASH, CHARCOAL, FOCUS_BLUE, GUNSMOKE, WHITE} from '../../../style/colors';
import SearchIcon from '../../icons/search.svg';
import {BASE_TEXT, WEIGHT} from '../../../style/typography';
import ServiceTile, {SMALL} from '../../tiles/service';
import {ALPHA} from '../../../style/color-utils';
import PropTypes from 'prop-types';
import SiteSearchResults from '../../search/site/site-search-results';

const Container = glamorous.div(
  {
    width: '100%',
    position: 'relative',
    zIndex: 100,
    display: 'flex',
    flexDirection: 'column',
    background: WHITE,
    minHeight: '100vh'
  },
  ({active}) => ({display: active ? 'flex' : 'none'})
);

const ExitLink = glamorous.div({
  ...BASE_TEXT,
  fontSize: 16,
  letterSpacing: 0.2,
  '> a': {
    WebkitTapHighlightColor: ALPHA(FOCUS_BLUE, 0.05),
    color: GUNSMOKE,
    ':visited,:hover,:active': {
      color: GUNSMOKE
    },
    textDecoration: 'none',
    padding: 10,
    marginLeft: 8,
    marginRight: 8,
    display: 'flex',
    alignItems: 'center',
    '> svg': {
      marginRight: 8
    }
  }
});

const Results = glamorous.div({
  marginBottom: 70 + 50
});

const ResultSection = glamorous.section({
  '> ul': {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    '> li': {
      WebkitTapHighlightColor: ALPHA(FOCUS_BLUE, 0.05),
      margin: '10px 18px',
      '> div > span': {
        fontSize: 15,
        color: CHARCOAL,
        fontWeight: WEIGHT.NORMAL
      }
    }
  }
});

const SectionLabel = glamorous.div({
  ...BASE_TEXT,
  fontSize: 16,
  fontWeight: WEIGHT.BOLD,
  color: CHARCOAL,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottom: `2px solid ${ASH}`,
  marginLeft: 18,
  marginRight: 18,
  '> a': {
    WebkitTapHighlightColor: ALPHA(FOCUS_BLUE, 0.05),
    fontWeight: WEIGHT.NORMAL,
    fontSize: 15,
    letterSpacing: 0.2,
    color: GUNSMOKE,
    textDecoration: 'none',
    padding: 8,
    ':visited,:hover,:active': {
      color: GUNSMOKE
    }
  }
});

class SearchResults extends Component {
  static propTypes = {
    active: PropTypes.bool,
    results: PropTypes.object,
    value: PropTypes.string
  };

  render() {
    const {active, value, results} = this.props;

    return (
      <Container active={active}>
        <ExitLink>
          <a href={`/search/q=${value}`}>
            <SearchIcon />
            {value.length ? `Search “${value}”` : 'Type your search'}
          </a>
        </ExitLink>
        {results && (
          <Results>
            <SiteSearchResults rawResults={results}>
              {sections =>
                sections.map(({type, hash, items}) => (
                  <ResultSection key={type}>
                    <SectionLabel>
                      {type} <a href={`/search/q=${value}#${hash}`}>More</a>
                    </SectionLabel>
                    <ul>
                      {items.map(hit => (
                        <li key={hit.id} onClick={() => (window.location = hit.canonicalUrl)}>
                          <ServiceTile
                            size={SMALL}
                            href={hit.canonicalUrl}
                            imageUrl={hit.imageUrl}
                            label={true}
                            name={hit.name}
                          />
                        </li>
                      ))}
                    </ul>
                  </ResultSection>
                ))
              }
            </SiteSearchResults>
          </Results>
        )}
      </Container>
    );
  }
}

export {SearchResults as default};
