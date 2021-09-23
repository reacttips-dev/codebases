import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { CategoryPostHistoryRecord } from '../components/category_posts/CategoryPostRenderables'
import { sendCategoryPostAction } from '../actions/category_posts'
import {
  selectPostAuthorUsername,
  selectPostCategoryPosts,
} from '../selectors/post'

function mapStateToProps(state, props) {
  return {
    authorUsername: selectPostAuthorUsername(state, props),
    categoryPosts: selectPostCategoryPosts(state, props),
  }
}

class CategoryPostHistoryContainer extends Component {
  static propTypes = {
    authorUsername: PropTypes.string.isRequired,
    categoryPosts: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
  }

  onFireCategoryPostAction = (action) => {
    const { dispatch } = this.props
    dispatch(sendCategoryPostAction(action))
  }

  render() {
    const { categoryPosts, authorUsername } = this.props
    const elems = categoryPosts.map(cp =>
      (
        <CategoryPostHistoryRecord
          key={cp.get('id')}
          authorUsername={authorUsername}
          status={cp.get('status')}
          submittedByUsername={cp.get('submittedByUsername')}
          featuredByUsername={cp.get('featuredByUsername')}
          categorySlug={cp.get('categorySlug')}
          categoryName={cp.get('categoryName')}
          actions={cp.get('actions')}
          fireAction={this.onFireCategoryPostAction}
        />
      ),
    ).toArray()

    return <aside className="CategoryHistory">{elems}</aside>
  }
}

export default connect(mapStateToProps)(CategoryPostHistoryContainer)
