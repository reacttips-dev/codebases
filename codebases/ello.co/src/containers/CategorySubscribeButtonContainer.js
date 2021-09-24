import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { followCategories } from '../actions/profile'
import { selectIsLoggedIn } from '../selectors/authentication'
import { selectSubscribedCategoryIds } from '../selectors/profile'
import { CategorySubscribeButton } from '../components/categories/CategoryRenderables'

function mapStateToProps(state, props) {
  const isLoggedIn = selectIsLoggedIn(state)
  const subscribedIds = selectSubscribedCategoryIds(state, props)

  return {
    isLoggedIn,
    subscribedIds: selectSubscribedCategoryIds(state, props),
    isSubscribed: !!props.categoryId && !!isLoggedIn && subscribedIds.includes(props.categoryId),
  }
}

class CategorySubscribeButtonContainer extends PureComponent {
  static propTypes = {
    categoryId: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    isSubscribed: PropTypes.bool.isRequired,
    subscribedIds: PropTypes.object.isRequired,
  }

  subscribe = (e) => {
    const { isLoggedIn, categoryId, dispatch, subscribedIds } = this.props
    e.preventDefault()
    if (!isLoggedIn) {
      const { onClickOpenRegistrationRequestDialog } = this.context
      onClickOpenRegistrationRequestDialog('subscribe-from-page-header')
    } else {
      const catIds = subscribedIds.push(categoryId)
      dispatch(followCategories(catIds, true))
    }
  }

  unsubscribe = (e) => {
    const { categoryId, dispatch, subscribedIds } = this.props
    e.preventDefault()
    const catIds = subscribedIds.filter(id => id !== categoryId)
    dispatch(followCategories(catIds, true))
  }

  render() {
    const {
      isSubscribed,
    } = this.props

    return (
      <CategorySubscribeButton
        subscribe={this.subscribe}
        unsubscribe={this.unsubscribe}
        isSubscribed={isSubscribed}
      />
    )
  }
}

export default connect(mapStateToProps)(CategorySubscribeButtonContainer)
