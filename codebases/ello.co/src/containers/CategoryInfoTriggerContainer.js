import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { setIsCategoryDrawerOpen } from '../actions/gui'
import { selectIsCategoryDrawerOpenBase } from '../selectors/gui'
import { CategoryInfoTrigger } from '../components/categories/CategoryRenderables'

function mapStateToProps(state) {
  const isCategoryDrawerOpen = selectIsCategoryDrawerOpenBase(state)

  return {
    isCategoryDrawerOpen,
  }
}

class CategoryInfoTriggerContainer extends PureComponent {
  static propTypes = {
    isCategoryDrawerOpen: PropTypes.bool.isRequired,
    isCloseable: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
  }

  handleTriggerClick = (e) => {
    const { isCategoryDrawerOpen } = this.props
    e.preventDefault()

    const collapsed = !isCategoryDrawerOpen
    this.props.dispatch(setIsCategoryDrawerOpen({ isOpen: collapsed }))
  }

  render() {
    const {
      isCategoryDrawerOpen,
      name,
      isCloseable,
    } = this.props

    return (
      <CategoryInfoTrigger
        collapsed={!isCategoryDrawerOpen}
        handleTriggerClick={this.handleTriggerClick}
        name={name}
        isCloseable={isCloseable}
      />
    )
  }
}

export default connect(mapStateToProps)(CategoryInfoTriggerContainer)
