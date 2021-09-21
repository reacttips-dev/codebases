/*
 * ELASTICSEARCH CONFIDENTIAL
 * __________________
 *
 *  Copyright Elasticsearch B.V. All rights reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Elasticsearch B.V. and its suppliers, if any.
 * The intellectual and technical concepts contained herein
 * are proprietary to Elasticsearch B.V. and its suppliers and
 * may be covered by U.S. and Foreign Patents, patents in
 * process, and are protected by trade secret or copyright
 * law.  Dissemination of this information or reproduction of
 * this material is strictly forbidden unless prior written
 * permission is obtained from Elasticsearch B.V.
 */

import { connect } from 'react-redux'
import { AsyncRequestState, ThunkDispatch } from '../../../../types'
import { fetchBlogs } from '../../../../actions/blogs'
import { fetchBlogsRequest, getBlogs } from '../../../../reducers'
import { Post } from '../../../../lib/api/v1/types'
import BlogsTile, { BlogsCategory } from './BlogsTile'

interface StateProps {
  blogs: Post[]
  fetchBlogsRequest: AsyncRequestState
}

interface DispatchProps {
  fetchBlogs: (category: BlogsCategory) => Promise<any>
}

const mapStateToProps = (state) => ({
  fetchBlogsRequest: fetchBlogsRequest(state),
  blogs: getBlogs(state),
})

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  fetchBlogs: (category) => dispatch(fetchBlogs(category)),
})

export default connect<StateProps, DispatchProps, unknown>(
  mapStateToProps,
  mapDispatchToProps,
)(BlogsTile)
