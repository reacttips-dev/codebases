import React, {Component} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {compose, withApollo} from 'react-apollo';
import AddIcon from '../../../../icons/add-circle.svg';
import Indicator from '../../../../indicators/indeterminate/circular';
import DefaultCompanyIcon from '../../../../icons/default-company-icon.svg';
import CompanyIcon from '../../../../icons/chips/company.svg';
import {companySearch} from '../../../../../../data/shared/queries';
import {withSendAnalyticsEvent} from '../../../../../enhancers/analytics-enhancer';
import {tagsPresenter} from '../../../utils';
import {ALPHA} from '../../../../../style/color-utils';
import {ASH, BLACK, TARMAC, WHITE} from '../../../../../style/colors';
import {BASE_TEXT, WEIGHT} from '../../../../../style/typography';
import {COMPOSER_SEARCH_COMPANY} from '../../../../../constants/analytics';

export const SearchContainer = glamorous.div({
  position: 'absolute',
  top: 0,
  left: 0,
  display: 'flex',
  width: '100%',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 100,
  cursor: 'default'
});

export const Name = glamorous.div({
  ...BASE_TEXT,
  flexGrow: 1
});

export const InputPanel = glamorous.div({
  display: 'flex',
  alignItems: 'center',
  paddingLeft: 13,
  height: 46
});

export const Input = glamorous.input({
  ...BASE_TEXT,
  lineHeight: 1,
  marginLeft: 9,
  marginRight: 24,
  outline: 'none',
  border: 0,
  borderBottom: `1px solid ${ASH}`,
  fontSize: 14,
  flexGrow: 1
});

export const Panel = glamorous.div({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  background: WHITE,
  boxShadow: `0 11px 20px rgba(0,0,0,0.2)`,
  borderRadius: 2
});

export const List = glamorous.ul({
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

export const Item = glamorous.li({
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

export const AddIconWrapper = glamorous.div({
  width: 32,
  height: 32,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
});

export const IndicatorWrapper = glamorous.div({
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
            this.props.sendAnalyticsEvent(COMPOSER_SEARCH_COMPANY, {
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
        <img src={c.imageUrl} title={c.name} alt={c.name} width={32} height={32} />
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
          <InputPanel>
            <CompanyIcon />
            <Input
              innerRef={this.assignInput}
              placeholder="Find my company…"
              value={keyword}
              onChange={this.handleSearch}
            />
          </InputPanel>
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
