import React, {Component} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {BASE_TEXT, WEIGHT} from '../../../../../shared/style/typography';
import AddIcon from '../icons/add-icon.svg';
import {ASH, BLACK, TARMAC, WHITE} from '../../../../../shared/style/colors';
import ServiceTile, {SMALL} from '../../../../../shared/library/tiles/service';
import {ALPHA} from '../../../../../shared/style/color-utils';
import {compose, withApollo} from 'react-apollo';
import {companySearch} from '../../../../../data/feed/queries';
import Indicator from '../../../../../shared/library/indicators/indeterminate/circular';
import DefaultCompanyIcon from '../../icons/default-company-icon.svg';
import {withSendAnalyticsEvent} from '../../../../../shared/enhancers/analytics-enhancer';
import {FEED_SEARCH_COMPOSER_COMPANY} from '../../../constants/analytics';
import {tagsPresenter} from '../index';

const SearchContainer = glamorous.div({
  position: 'absolute',
  top: 54,
  left: 0,
  display: 'flex',
  width: '100%',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 100,
  cursor: 'default',
  paddingTop: 5
});

const Name = glamorous.div({
  ...BASE_TEXT,
  flexGrow: 1
});

const Input = glamorous.input({
  padding: 4,
  ...BASE_TEXT,
  margin: 10,
  outline: 'none'
});

const Panel = glamorous.div({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  background: WHITE,
  boxShadow: `0 11px 20px rgba(0,0,0,0.2)`,
  border: `1px solid ${ASH}`,
  borderRadius: 2
});

const List = glamorous.ul({
  display: 'flex',
  flexDirection: 'column',
  margin: 0,
  padding: 0,
  '>*': {
    borderBottom: `1px solid ${ASH}`,
    ':last-child': {
      border: 0
    }
  }
});

const Item = glamorous.li({
  display: 'flex',
  paddingTop: 16,
  paddingBottom: 16,
  paddingLeft: 13,
  '>:first-child': {
    marginRight: 10
  },
  alignItems: 'center',
  cursor: 'pointer',
  ':hover': {
    background: ALPHA(BLACK, 0.05)
  }
});

const AddIconWrapper = glamorous.div({
  width: 32,
  height: 32,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
});

const IndicatorWrapper = glamorous.div({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 5
});

const Role = glamorous.div({
  ...BASE_TEXT,
  background: TARMAC,
  color: WHITE,
  textTransform: 'uppercase',
  letterSpacing: 1.2,
  fontSize: 11,
  borderRadius: 2,
  marginRight: 10,
  padding: '1px 5px 2px 5px',
  fontWeight: WEIGHT.BOLD
});

export class CompanySearch extends Component {
  static propTypes = {
    onChoose: PropTypes.func,
    myCompanies: PropTypes.array,
    client: PropTypes.shape({query: PropTypes.func}), // ApolloClient
    sendAnalyticsEvent: PropTypes.func
  };

  static defaultProps = {
    myCompanies: []
  };

  state = {
    keyword: '',
    searchCompanies: [],
    isSearching: false
  };

  handleSearch = event => {
    const keyword = event.target.value;
    if (keyword && keyword.length > 0) {
      this.setState({isSearching: true});
      this.props.client
        .query({
          query: companySearch,
          variables: {keyword}
        })
        .then(result => {
          if (
            keyword === this.state.keyword &&
            result &&
            result.data &&
            result.data.companySearch
          ) {
            this.props.sendAnalyticsEvent(FEED_SEARCH_COMPOSER_COMPANY, {
              keyword,
              ...tagsPresenter('results', result.data.companySearch)
            });
            this.setState({searchCompanies: result.data.companySearch, isSearching: false});
          }
        });
    } else {
      this.setState({searchCompanies: [], isSearching: false});
    }
    this.setState({keyword});
  };

  handleAddNewCompany = () => {
    window.open('/create-stack/new-company', '_blank');
    this.props.onChoose(null);
  };

  inputRef = null;
  assignInput = el => (this.inputRef = el);

  componentDidMount() {
    this.inputRef.focus();
  }

  renderCompany = c => (
    <Item key={c.id} onClick={() => this.props.onChoose(c)}>
      {c.imageUrl ? (
        <ServiceTile imageUrl={c.imageUrl} size={SMALL} slim={true} />
      ) : (
        <DefaultCompanyIcon />
      )}
      <Name>{c.name}</Name>
      {c.myRole && <Role>{c.myRole}</Role>}
    </Item>
  );

  render() {
    const {myCompanies} = this.props;
    const {keyword, searchCompanies, isSearching} = this.state;

    return (
      <SearchContainer>
        <Panel>
          <Input
            innerRef={this.assignInput}
            placeholder="Find my company…"
            value={keyword}
            onChange={this.handleSearch}
          />
          {isSearching && (
            <IndicatorWrapper>
              <Indicator size={32} />
            </IndicatorWrapper>
          )}
          <List>
            {searchCompanies.length === 0 && myCompanies.map(this.renderCompany)}
            {searchCompanies.map(this.renderCompany)}
            <Item onClick={this.handleAddNewCompany}>
              <AddIconWrapper>
                <AddIcon />
              </AddIconWrapper>
              <Name>Add new company&hellip;</Name>
            </Item>
          </List>
        </Panel>
      </SearchContainer>
    );
  }
}

export default compose(
  withApollo,
  withSendAnalyticsEvent
)(CompanySearch);
