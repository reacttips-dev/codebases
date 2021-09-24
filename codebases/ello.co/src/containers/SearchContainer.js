import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { replace } from 'react-router-redux'
import debounce from 'lodash/debounce'
import { updateQueryParams } from '../helpers/uri_helper'
import { searchForPosts, searchForUsers } from '../actions/search'
import { trackEvent } from '../actions/analytics'
import { hideSoftKeyboard } from '../lib/jello'
import SearchControl from '../components/forms/SearchControl'
import StreamContainer from './StreamContainer'
import { MainView } from '../components/views/MainView'
import { selectIsLoggedIn } from '../selectors/authentication'
import {
  selectPropsPathname,
  selectPropsQueryTerms,
  selectPropsQueryType,
} from '../selectors/routing'
import { css } from '../styles/jss'

const TABS = [
  { type: 'posts', children: 'Posts' },
  { type: 'users', children: 'People' },
]

const searchStyle = css(
  { paddingBottom: 80 },
)

// TODO: turn this into a selector and test that
export function getStreamAction(terms, type) {
  if (terms && terms.length > 1) {
    return type === 'users' ? searchForUsers(terms) : searchForPosts(terms)
  }
  return null
}

function mapStateToProps(state, props) {
  return {
    isLoggedIn: selectIsLoggedIn(state),
    pathname: selectPropsPathname(state, props),
    terms: selectPropsQueryTerms(state, props) || '',
    type: selectPropsQueryType(state, props) || 'posts',
  }
}

class SearchContainer extends PureComponent {
  static propTypes = {
    debounceWait: PropTypes.number,
    dispatch: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    pathname: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    terms: PropTypes.string.isRequired,
  }

  static defaultProps = {
    debounceWait: 666,
  }

  componentWillMount() {
    const { debounceWait } = this.props
    if (debounceWait > 0) {
      this.search = debounce(this.search, debounceWait)
    }
  }

  componentDidMount() {
    const { terms, type } = this.props
    this.search({ terms, type }, false)
  }

  onChangeControl = (vo) => {
    this.search(vo)
    if (vo.type) {
      this.setState(vo)
    }
  }

  onSubmit = (e) => {
    e.preventDefault()
    hideSoftKeyboard()
  }

  onClickTrackCredits = () => {
    const { dispatch } = this.props
    dispatch(trackEvent('banderole-credits-clicked'))
  }

  search(valueObject, shouldTrack = true) {
    const { dispatch, isLoggedIn, pathname, type } = this.props
    const vo = valueObject

    if (typeof vo.terms === 'string' && vo.terms.length < 2) {
      vo.terms = null
    }
    if (shouldTrack) {
      dispatch(replace({ pathname, search: updateQueryParams(vo) }))
    }

    if (vo.terms && vo.terms.length > 1) {
      const label = type && type === 'users' ? 'people' : 'posts'
      const trackStr = `search-logged-${isLoggedIn ? 'in' : 'out'}-${label}`
      dispatch(trackEvent(trackStr))
    }
  }

  render() {
    const { terms, type } = this.props
    let inputText = terms
    if (type === 'users' && terms.length === 0) {
      inputText = '@'
    } else if (type === 'posts' && terms === '@') {
      inputText = ''
    }
    return (
      <MainView className={`Search ${searchStyle}`}>
        <SearchControl
          activeType={type}
          onChange={this.onChangeControl}
          onSubmit={this.onSubmit}
          tabs={TABS}
          text={inputText}
        />
        <StreamContainer
          action={getStreamAction(terms, type)}
          key={`search_${type}_${terms}`}
          paginatorText="Load More"
        />
      </MainView>
    )
  }
}

export default connect(mapStateToProps)(SearchContainer)
