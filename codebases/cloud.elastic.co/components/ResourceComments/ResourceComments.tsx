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

import { isEmpty } from 'lodash'
import React, { Component, Fragment } from 'react'
import { FormattedMessage } from 'react-intl'

import {
  EuiComment,
  EuiButton,
  EuiButtonEmpty,
  EuiButtonIcon,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFlyout,
  EuiFlyoutBody,
  EuiFlyoutFooter,
  EuiFlyoutHeader,
  EuiFormLabel,
  EuiLoadingSpinner,
  EuiSpacer,
  EuiText,
  EuiTextArea,
  EuiTitle,
} from '@elastic/eui'

import { CuiAlert, CuiMarkdown, CuiPermissibleControl, CuiTimeAgo } from '../../cui'

import SpinButton from '../SpinButton'

import Permission from '../../lib/api/v1/permissions'
import { AsyncRequestState, ResourceComment } from '../../types'

import './resourceComments.scss'

type StateProps = {
  comments: ResourceComment[] | null
  createResourceCommentRequest: AsyncRequestState
  fetchResourceCommentsRequest: AsyncRequestState
  getDeleteResourceCommentRequest: (commentId: string) => AsyncRequestState
  getUpdateResourceCommentRequest: (commentId: string) => AsyncRequestState
  showResourceComments: boolean
  usernameFromToken: string | null
}

type DispatchProps = {
  fetchResourceComments: () => Promise<any>
  createResourceComment: (createParams: { message: string }) => Promise<any>
  updateResourceComment: (updateParams: {
    comment: ResourceComment
    message: string
  }) => Promise<any>
  deleteResourceComment: (deleteParams: { comment: ResourceComment }) => Promise<any>
}

type OwnProps = DispatchProps & {
  spacerBefore?: boolean
  spacerAfter?: boolean
}

type Props = StateProps & DispatchProps & OwnProps

type CommentEditState = {
  message: string
}

type State = {
  showEditFlyout: boolean
  editingComment: ResourceComment | null
  editorComment: CommentEditState | null
}

class ResourceComments extends Component<Props, State> {
  state: State = {
    showEditFlyout: false,
    editingComment: null,
    editorComment: null,
  }

  componentDidMount() {
    const { showResourceComments, fetchResourceComments } = this.props

    if (!showResourceComments) {
      return
    }

    fetchResourceComments()
  }

  render() {
    const { showResourceComments, spacerBefore, spacerAfter } = this.props

    if (!showResourceComments) {
      return null
    }

    return (
      <Fragment>
        {spacerBefore && <EuiSpacer size='m' />}

        {this.renderComments()}
        {this.renderCommentActions()}
        {this.renderEditFlyout()}

        {spacerAfter && <EuiSpacer size='m' />}
      </Fragment>
    )
  }

  renderComments() {
    const {
      comments,
      deleteResourceComment,
      fetchResourceCommentsRequest,
      getDeleteResourceCommentRequest,
      usernameFromToken,
    } = this.props

    if (fetchResourceCommentsRequest.error) {
      return (
        <Fragment>
          <CuiAlert type='warning'>{fetchResourceCommentsRequest.error}</CuiAlert>

          <EuiSpacer size='m' />
        </Fragment>
      )
    }

    if (!comments) {
      return (
        <Fragment>
          <EuiLoadingSpinner size='m' />

          <EuiSpacer size='m' />
        </Fragment>
      )
    }

    if (isEmpty(comments)) {
      return null
    }

    return (
      <CuiPermissibleControl permissions={Permission.listComment}>
        <Fragment>
          <div>
            {comments.map((comment) => {
              const deleteRequest = getDeleteResourceCommentRequest(comment.id)

              return (
                <Fragment key={comment.id}>
                  <EuiComment
                    username={comment.userId}
                    event='wrote'
                    timestamp={
                      <CuiTimeAgo date={comment.created} longTime={true} shouldCapitalize={false} />
                    }
                    actions={
                      usernameFromToken === comment.userId && (
                        <EuiFlexGroup gutterSize='s' alignItems='center' responsive={false}>
                          <CuiPermissibleControl permissions={Permission.updateComment}>
                            <EuiFlexItem grow={false}>
                              <EuiButtonIcon
                                size='s'
                                color='text'
                                iconType='pencil'
                                onClick={() => this.startEdit(comment)}
                                aria-label='Edit comment'
                              />
                            </EuiFlexItem>
                          </CuiPermissibleControl>

                          <EuiFlexItem grow={false}>
                            <CuiPermissibleControl permissions={Permission.deleteComment}>
                              <SpinButton
                                size='s'
                                iconType='trash'
                                aria-label='Delete comment'
                                buttonProps={{ color: `text` }}
                                buttonType={EuiButtonIcon}
                                spin={deleteRequest.inProgress}
                                onClick={() => deleteResourceComment({ comment })}
                              />
                            </CuiPermissibleControl>
                          </EuiFlexItem>
                        </EuiFlexGroup>
                      )
                    }
                  >
                    <EuiText>
                      <CuiMarkdown source={comment.message} />
                    </EuiText>
                  </EuiComment>

                  {deleteRequest.error && (
                    <Fragment>
                      <EuiSpacer size='m' />

                      <CuiAlert type='warning'>{deleteRequest.error}</CuiAlert>

                      <EuiSpacer size='m' />
                    </Fragment>
                  )}
                </Fragment>
              )
            })}
          </div>

          <EuiSpacer size='m' />
        </Fragment>
      </CuiPermissibleControl>
    )
  }

  renderCommentActions() {
    return (
      <EuiFlexGroup>
        <EuiFlexItem grow={false}>
          <CuiPermissibleControl permissions={Permission.createComment}>
            <EuiButton iconType='editorComment' onClick={() => this.startEdit(null)} color='text'>
              <FormattedMessage
                id='resource-comments.leave-comment'
                defaultMessage='Leave comment'
              />
            </EuiButton>
          </CuiPermissibleControl>
        </EuiFlexItem>
      </EuiFlexGroup>
    )
  }

  renderEditFlyout() {
    const { createResourceCommentRequest, getUpdateResourceCommentRequest, usernameFromToken } =
      this.props

    const { showEditFlyout, editingComment, editorComment } = this.state

    if (!showEditFlyout) {
      return null
    }

    if (editorComment === null) {
      return null // sanity
    }

    const { message } = editorComment

    const commitRequest =
      editingComment === null
        ? createResourceCommentRequest
        : getUpdateResourceCommentRequest(editingComment.id)

    const hasEmptyMessage = message.trim().length === 0

    return (
      <EuiFlyout ownFocus={true} onClose={this.stopEdit} size='s'>
        <EuiFlyoutHeader hasBorder={true}>
          <EuiTitle size='m'>
            <h2>
              {editingComment === null ? (
                <FormattedMessage id='resource-comments.new-comment' defaultMessage='New comment' />
              ) : (
                <FormattedMessage
                  id='resource-comments.edit-comment'
                  defaultMessage='Edit comment'
                />
              )}
            </h2>
          </EuiTitle>
        </EuiFlyoutHeader>

        <EuiFlyoutBody>
          <EuiFormLabel>
            <FormattedMessage id='resource-comments.message' defaultMessage='Message' />
          </EuiFormLabel>

          <EuiTextArea
            value={message}
            onChange={(e) => this.updateField(`message`, e.target.value)}
          />

          <EuiSpacer size='m' />

          {hasEmptyMessage || (
            <Fragment>
              <EuiFormLabel>
                <FormattedMessage id='resource-comments.preview' defaultMessage='Preview' />
              </EuiFormLabel>

              <div>
                <EuiComment
                  username={editingComment ? editingComment.userId : usernameFromToken}
                  event='wrote'
                  timestamp={
                    <CuiTimeAgo
                      date={editingComment ? editingComment.created : new Date()}
                      longTime={true}
                      shouldCapitalize={false}
                    />
                  }
                >
                  <EuiText>
                    <CuiMarkdown source={message} />
                  </EuiText>
                </EuiComment>
              </div>
            </Fragment>
          )}
        </EuiFlyoutBody>

        <EuiFlyoutFooter>
          <EuiFlexGroup justifyContent='spaceBetween' responsive={false}>
            <EuiFlexItem grow={false}>
              <SpinButton
                onClick={this.commitChanges}
                disabled={hasEmptyMessage}
                fill={true}
                spin={commitRequest.inProgress}
              >
                {editingComment === null ? (
                  <FormattedMessage
                    id='resource-comments.insert-comment'
                    defaultMessage='Comment'
                  />
                ) : (
                  <FormattedMessage id='resource-comments.update-comment' defaultMessage='Update' />
                )}
              </SpinButton>
            </EuiFlexItem>

            <EuiFlexItem grow={false}>
              <EuiButtonEmpty iconType='cross' onClick={this.stopEdit} flush='left'>
                <FormattedMessage id='resource-comments.cancel-editing' defaultMessage='Cancel' />
              </EuiButtonEmpty>
            </EuiFlexItem>
          </EuiFlexGroup>

          {commitRequest.error && (
            <Fragment>
              <EuiSpacer size='m' />
              <CuiAlert type='error'>{commitRequest.error}</CuiAlert>
            </Fragment>
          )}
        </EuiFlyoutFooter>
      </EuiFlyout>
    )
  }

  startEdit = (comment) => {
    this.setState({
      showEditFlyout: true,
      editingComment: comment,
      editorComment: {
        message: comment === null ? `` : comment.message,
      },
    })
  }

  stopEdit = () => {
    this.setState({
      showEditFlyout: false,
      editingComment: null,
      editorComment: null,
    })
  }

  updateField = (fieldName, value) => {
    const { editorComment } = this.state

    if (editorComment === null) {
      return // sanity
    }

    this.setState({
      editorComment: {
        ...editorComment,
        [fieldName]: value,
      },
    })
  }

  commitChanges = () => {
    const { createResourceComment, updateResourceComment } = this.props
    const { editingComment, editorComment } = this.state

    if (editorComment === null) {
      return // sanity
    }

    const { message } = editorComment

    const savePromise =
      editingComment === null
        ? createResourceComment({ message })
        : updateResourceComment({ comment: editingComment, message })

    return savePromise.then(this.stopEdit)
  }
}

export default ResourceComments
