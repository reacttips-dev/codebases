import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { selectInnerWidth, selectIsCategoryDrawerOpen } from '../selectors/gui'
import { selectCategoryForPath, selectCategoryUsers } from '../selectors/categories'
import { selectRandomPageHeader } from '../selectors/page_headers'
import { CategoryInfo } from '../components/categories/CategoryRenderables'

function mapStateToProps(state, props) {
  const category = selectCategoryForPath(state, props)
  const categoryId = category.get('id')
  const categoryName = category.get('name')

  return {
    category,
    categoryId,
    categoryUsers: selectCategoryUsers(state, { categoryId }),
    collapsed: !selectIsCategoryDrawerOpen(state),
    innerWidth: selectInnerWidth(state),
    name: categoryName,
    pageHeader: selectRandomPageHeader(state),
  }
}

class CategoryInfoContainer extends PureComponent {
  static propTypes = {
    category: PropTypes.object.isRequired,
    categoryUsers: PropTypes.array.isRequired,
    collapsed: PropTypes.bool.isRequired,
    innerWidth: PropTypes.number.isRequired,
    name: PropTypes.string,
    pageHeader: PropTypes.object,
  }
  static defaultProps = {
    name: 'Category',
    pageHeader: null,
  }

  render() {
    const {
      category,
      categoryUsers,
      collapsed,
      innerWidth,
      name,
      pageHeader,
    } = this.props

    let ctaCaption = null
    let ctaHref = null
    if (pageHeader) {
      ctaCaption = pageHeader.getIn(['ctaLink', 'text'])
      ctaHref = pageHeader.getIn(['ctaLink', 'url'])
    }

    return (
      <CategoryInfo
        category={category}
        categoryUsers={categoryUsers}
        collapsed={collapsed}
        ctaCaption={ctaCaption}
        ctaHref={ctaHref}
        innerWidth={innerWidth}
        name={name}
      />
    )
  }
}

export default connect(mapStateToProps)(CategoryInfoContainer)
