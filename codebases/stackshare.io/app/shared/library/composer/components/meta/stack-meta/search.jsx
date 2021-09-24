import React, {Component} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import Indicator from '../../../../indicators/indeterminate/circular';
import StackIcon from '../../../../icons/chips/stack.svg';
import AddIcon from '../../../../icons/add-circle.svg';
import {withSendAnalyticsEvent} from '../../../../../enhancers/analytics-enhancer';
import {stackLabel, stackImage, stackResultsPresenter} from '../../../utils';
import {IMAGE_TYPE_USER} from '../../../constants';
import {
  SearchContainer,
  Panel,
  InputPanel,
  Input,
  IndicatorWrapper,
  List,
  Item,
  Name,
  AddIconWrapper
} from '../company-meta/search';
import {COMPOSER_SEARCH_STACK} from '../../../../../constants/analytics';

const StyledList = glamorous(List)({
  maxHeight: 704,
  overflowY: 'scroll'
});

const Image = glamorous.img(
  {
    height: 32,
    width: 32
  },
  ({imageType}) => ({
    borderRadius: imageType === IMAGE_TYPE_USER ? '50%' : 0
  })
);

export class StackSearch extends Component {
  static propTypes = {
    onChoose: PropTypes.func,
    myStacks: PropTypes.array,
    sendAnalyticsEvent: PropTypes.func
  };

  static defaultProps = {
    myCompanies: []
  };

  state = {
    keyword: '',
    isSearching: false
  };

  handleSearch = event => {
    const keyword = event.target.value;
    if (keyword && keyword.length > 0) {
      this.setState({isSearching: true});
      setTimeout(() => {
        this.setState({isSearching: false});
      }, 250);
    } else {
      this.setState({isSearching: false});
    }
    this.setState({keyword}, () => {
      this.props.sendAnalyticsEvent(COMPOSER_SEARCH_STACK, {
        keyword,
        ...stackResultsPresenter('results', this.filteredStacks())
      });
    });
  };

  handleAddNewStack = () => {
    window.open('/create-stack/scan', '_blank');
    this.props.onChoose(null);
  };

  inputRef = null;
  assignInput = el => (this.inputRef = el);

  componentDidMount() {
    this.inputRef.focus();
  }

  renderStack = stack => {
    const {identifier, imageUrl, name, imageType} = stack;
    return (
      <Item key={identifier} onClick={() => this.props.onChoose(stack)}>
        {imageUrl ? (
          <Image src={imageUrl} imageType={imageType} title={name} alt={name} />
        ) : (
          stackImage(imageType)
        )}
        <Name>{stackLabel({stack, bold: true})}</Name>
      </Item>
    );
  };

  keywordFilter = stack => {
    const {keyword} = this.state;
    const str = stackLabel({stack});
    const pattern = new RegExp(keyword + '.*', 'gi');
    const matches = str.match(pattern);
    return matches && matches.length > 0;
  };

  filteredStacks = () => this.props.myStacks.filter(stack => this.keywordFilter(stack));

  render() {
    const {keyword, isSearching} = this.state;

    return (
      <SearchContainer>
        <Panel>
          <InputPanel>
            <StackIcon />
            <Input
              innerRef={this.assignInput}
              placeholder="Find my stack…"
              value={keyword}
              onChange={this.handleSearch}
            />
          </InputPanel>
          {isSearching && (
            <IndicatorWrapper>
              <Indicator size={32} />
            </IndicatorWrapper>
          )}
          <StyledList>
            {this.filteredStacks().map(this.renderStack)}
            <Item onClick={this.handleAddNewStack}>
              <AddIconWrapper>
                <AddIcon />
              </AddIconWrapper>
              <Name>Add new stack&hellip;</Name>
            </Item>
          </StyledList>
        </Panel>
      </SearchContainer>
    );
  }
}

export default withSendAnalyticsEvent(StackSearch);
