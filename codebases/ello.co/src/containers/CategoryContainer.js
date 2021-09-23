import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { CategoryCard } from '../components/categories/CategoryRenderables'
import {
  selectCategoryName,
  selectCategorySlug,
  selectCategoryTileImageUrl,
  selectCategoryIsSubscribed,
  selectCategoryIsPromo,
} from '../selectors/categories'

function mapStateToProps(state, props) {
  return {
    name: selectCategoryName(state, props),
    slug: selectCategorySlug(state, props),
    tileImageUrl: selectCategoryTileImageUrl(state, props),
    isSubscribed: selectCategoryIsSubscribed(state, props),
    isPromo: selectCategoryIsPromo(state, props),
  }
}

export const CategoryContainer = ({
  categoryId,
  isPromo,
  isSubscribed,
  name,
  slug,
  tileImageUrl,
}) => (
  <CategoryCard
    categoryId={categoryId}
    imageUrl={tileImageUrl}
    isPromo={isPromo}
    isSubscribed={isSubscribed}
    name={name}
    to={`/discover/${slug}`}
  />
)

CategoryContainer.propTypes = {
  categoryId: PropTypes.string.isRequired,
  isPromo: PropTypes.bool.isRequired,
  isSubscribed: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  tileImageUrl: PropTypes.string,
}

CategoryContainer.defaultProps = {
  tileImageUrl: null,
}

CategoryContainer.contextTypes = {
  onClickOpenRegistrationRequestDialog: PropTypes.func.isRequired,
}

export default connect(mapStateToProps)(CategoryContainer)
