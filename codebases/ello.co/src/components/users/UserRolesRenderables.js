import Immutable from 'immutable'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import { DismissButtonLG } from './../buttons/Buttons'
import { PencilIcon, XBoxIcon } from './../assets/Icons'
import { FilterSelectorControl } from './../forms/FilterSelectorControl'
import StatusMessage from './../forms/StatusMessage'
import { css, hover, media, select } from '../../styles/jss'
import * as s from '../../styles/jso'

const userDetailRemoveRoleStyle = css(
  s.colorA,
  select('& .confirm-text',
    s.ml5,
    s.mr5,
    select('& a',
      hover(s.colorBlack),
    ),
    select('& button',
      s.ml10,
      s.colorA,
      s.transitionColor,
      select('&.remove-confirm',
        s.colorBlack,
      ),
      hover(s.colorBlack),
    ),
  ),
)

class UserDetailRemoveRole extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
    }
  }

  toggleDoubleConfirm() {
    const { open } = this.state

    this.setState({
      open: !open,
    })
  }


  render() {
    const {
      categoryName,
      categorySlug,
      categoryUserId,
      handleDeleteRole,
      username,
    } = this.props

    const { open } = this.state

    if (open) {
      return (
        <span className={userDetailRemoveRoleStyle}>
          <span className="confirm-text">
            Remove @{username} from <Link to={`/discover/${categorySlug}`}>{categoryName}</Link>?
            <button
              className="remove-confirm"
              onClick={() => handleDeleteRole(categoryUserId)}
            >
              Yes
            </button>
            <button
              className="remove-cancel"
              onClick={() => this.toggleDoubleConfirm()}
            >
              No
            </button>
          </span>
          <button
            className="remove"
            onClick={() => this.toggleDoubleConfirm()}
          >
            <XBoxIcon />
          </button>
        </span>
      )
    }
    return (
      <button
        className="remove"
        onClick={() => this.toggleDoubleConfirm()}
      >
        <XBoxIcon />
      </button>
    )
  }
}
UserDetailRemoveRole.propTypes = {
  categoryName: PropTypes.string.isRequired,
  categorySlug: PropTypes.string.isRequired,
  categoryUserId: PropTypes.string.isRequired,
  handleDeleteRole: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
}
// UserDetailRemoveRole.defaultProps = {
// }

const userDetailRolesModalStyle = css(
  s.block,
  s.relative,
  s.bgcF2,
  { margin: '0 auto' },
  select(
    '> .mask',
    s.fullscreen,
    s.fullWidth,
    s.fullHeight,
    s.bgcModal,
    s.zModal,
    { transition: `background-color 0.4s ${s.ease}` },

    media(s.minBreak2,
      s.flex,
      s.itemsCenter,
      s.justifyCenter,
    ),
  ),
)
const userDetailRolesStyle = css(
  s.relative,
  s.block,
  s.pt20,
  s.pb10,
  s.mt40,
  s.colorBlack,
  s.fullWidth,
  s.leftAlign,
  s.bgcWhite,
  {
    maxWidth: 780,
    borderRadius: 5,
  },

  media(s.minBreak2,
    s.m0,
    s.pt40,
    { width: '80%' },
  ),
  media(s.minBreak4,
    { width: '60%' },
  ),

  select('& .CloseModal',
    s.colorA,
    { top: 14, right: 20 },
    hover(s.colorBlack),

    media(s.maxBreak2,
      { top: 7, right: 7 },
    ),
  ),

  select('& h1',
    s.sansBlack,
    s.fontSize24,
  ),

  select('& .assign-roles',
    s.pb10,
    s.pr20,
    s.pl20,

    select('& .fs-rolePicker',
      s.ml10,
      { width: 200 },

      media(s.maxBreak2,
        s.ml0,
        s.fullWidth,
      ),
    ),

    media(s.maxBreak2,
      s.pr10,
      s.pl10,
    ),
  ),
  select('& .user-roles',
    s.pt20,
    s.pr20,
    s.pl20,
    s.resetList,
    s.borderTop,
    { borderColor: '#f2f2f2' },

    media(s.maxBreak2,
      s.pr10,
      s.pl10,
    ),
  ),
)

const roleName = {
  FEATURED: 'Featured User',
  CURATOR: 'Curator',
  MODERATOR: 'Moderator',
}

export default function UserDetailRoles({
  administeredCategories,
  categoryUsers,
  close,
  handleDeleteRole,
  handleMaskClick,
  handleRolesSubmit,
  isOpen,
  isStaff,
  newRole,
  searchCategories,
  userId,
  username,
}) {
  if (!isOpen) {
    return null
  }

  return (
    <div className={userDetailRolesModalStyle}>
      <div className="mask" role="presentation" onClick={handleMaskClick}>
        <div className={`${userDetailRolesStyle} content`}>
          <DismissButtonLG
            onClick={close}
          />
          <div className="assign-roles">
            <h1>Community Roles</h1>
            <UserCategoryRolesForm
              administeredCategories={administeredCategories}
              handleSubmit={handleRolesSubmit}
              newRole={newRole}
              searchCategories={searchCategories}
              userId={userId}
              isStaff={isStaff}
            />
          </div>
          <ul className="user-roles">
            {categoryUsers.map((cu) => {
              let isNew = false
              if (newRole && newRole.categoryId === cu.get('categoryId')) {
                isNew = true
              }

              return (
                <UserRole
                  key={cu.get('id')}
                  administeredCategories={administeredCategories}
                  categoryUserId={cu.get('id')}
                  categoryName={cu.get('categoryName')}
                  categorySlug={cu.get('categorySlug')}
                  handleDeleteRole={handleDeleteRole}
                  isNew={isNew}
                  isStaff={isStaff}
                  roleId={cu.get('role')}
                  username={username}
                />
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}
UserDetailRoles.propTypes = {
  administeredCategories: PropTypes.object.isRequired,
  categoryUsers: PropTypes.object.isRequired,
  close: PropTypes.func.isRequired,
  handleDeleteRole: PropTypes.func.isRequired,
  handleMaskClick: PropTypes.func.isRequired,
  handleRolesSubmit: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  newRole: PropTypes.object,
  searchCategories: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  isStaff: PropTypes.bool.isRequired,
}
UserDetailRoles.defaultProps = {
  newRole: null,
}

const userRoleStyle = css(
  s.flex,
  s.justifySpaceBetween,
  s.fullWidth,
  s.mb10,
  s.bgcF2,
  { padding: '6px 8px 2px 8px' },

  select('& .controls',
    s.flex,
    s.justifyCenter,
    s.itemsCenter,

    select('& .edit, & .remove',
      s.colorA,
      s.transitionColor,
      { marginTop: -2 },
      hover(
        s.colorBlack,
      ),
    ),
    select('& .edit',
      s.displayNone, // Hide edit until we wire it up.
      { marginLeft: 5 },
      select('& svg',
        {
          marginTop: -1,
          transform: 'scale(0.85)',
        },
      ),
    ),
    select('& .remove',
      { marginLeft: 3 },
    ),
    select('& .new-role',
      s.inlineBlock,
      s.bgcGreen,
      {
        marginTop: -4,
        width: 12,
        height: 12,
        borderRadius: 12,
      },
      select('& i',
        s.displayNone,
      ),
    ),
  ),
)

function canEdit(slug, subjectRole, administeredCategories) {
  if (administeredCategories.count() === 0) { return false }
  const category = administeredCategories.find(ac => ac.get('slug') === slug)
  return category && category.get('role') === 'MODERATOR'
}

function canDelete(slug, subjectRole, administeredCategories) {
  if (administeredCategories.count() === 0) { return false }
  const category = administeredCategories.find(ac => ac.get('slug') === slug)
  return category && (
    category.get('role') === 'MODERATOR' ||
    (category.get('role') === 'CURATOR' && subjectRole === 'FEATURED')
  )
}

function UserRole({
  administeredCategories,
  categoryUserId,
  categoryName,
  categorySlug,
  handleDeleteRole,
  isNew,
  isStaff,
  roleId,
  username,
}) {
  return (
    <li className={userRoleStyle}>
      <span className="meta">
        {roleName[roleId]} in&nbsp;
        <Link to={`/discover/${categorySlug}`}>{categoryName}</Link>
      </span>
      <span className="controls">
        {isNew &&
          <span className="new-role"><i>New!</i></span>
        }
        {isStaff || canEdit(categorySlug, roleId, administeredCategories) ?
          <button
            className="edit"
          >
            <PencilIcon />
          </button>
        : null}
        {isStaff || canDelete(categorySlug, roleId, administeredCategories) ?
          <UserDetailRemoveRole
            categoryName={categoryName}
            categorySlug={categorySlug}
            categoryUserId={categoryUserId}
            handleDeleteRole={handleDeleteRole}
            username={username}
          />
        : null }
      </span>
    </li>
  )
}
UserRole.propTypes = {
  administeredCategories: PropTypes.object.isRequired,
  categoryUserId: PropTypes.string.isRequired,
  categoryName: PropTypes.string.isRequired,
  categorySlug: PropTypes.string.isRequired,
  handleDeleteRole: PropTypes.func.isRequired,
  isNew: PropTypes.bool.isRequired,
  isStaff: PropTypes.bool.isRequired,
  roleId: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
}

const formStyle = css(
  s.flex,
  s.justifySpaceBetween,
  s.itemsCenter,
  s.fullWidth,
  s.mt30,
  s.mb10,

  select('& .selectors',
    s.flex,
    s.justifyStart,
    select('& .fs',
      s.block,
    ),
  ),

  select('& .role-submit',
    s.pr10,
    s.pl10,
    s.hv40,
    s.lh40,
    s.fontSize14,
    s.colorWhite,
    s.bgcGreen,
    s.transitionBgColor,
    { borderRadius: 5 },

    hover(
      s.bgcDarkGreen,
      {
        cursor: 'pointer',
      },
    ),

    select('&:disabled, &:disabled:hover',
      s.bgcA,
      hover({ cursor: 'default' }),
    ),
  ),

  select('& .status-msg',
    s.m0,
    s.p0,
  ),

  media(s.maxBreak3,
    select('& .selectors',
      select('& .fs',
        { width: 200 },
      ),
    ),
  ),
  media(s.maxBreak2,
    s.block,
    s.rightAlign,
    select('& .selectors',
      s.block,
      s.fullWidth,
      select('& .fs',
        s.block,
        s.fullWidth,
        s.ml0,
        s.leftAlign,
      ),
    ),
    select('& .status-msg',
      s.inlineBlock,
      { marginRight: 10 },
    ),
  ),
)

/* eslint-disable react/no-multi-comp */
class UserCategoryRolesForm extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      selectedCategories: [],
      selectedRoles: [],
      showStatusMsg: false,
    }
    this.onSelectCategory = this.onSelectCategory.bind(this)
    this.onClearCategory = this.onClearCategory.bind(this)
    this.onSelectRole = this.onSelectRole.bind(this)
    this.onClearRole = this.onClearRole.bind(this)
    this.resetForm = this.resetForm.bind(this)
    this.toggleStatusMsg = this.toggleStatusMsg.bind(this)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.newRole !== this.props.newRole) {
      this.toggleStatusMsg(true)
    }
  }

  onSelectCategory(item) {
    // abandoning multi-select for now
    // const { selectedCategories } = this.state
    const selectedCategories = []
    selectedCategories.push(item)

    this.setState({ selectedCategories })
  }

  onClearCategory() {
    this.setState({
      selectedCategories: [],
    })
  }

  onSelectRole(item) {
    // abandoning multi-select for now
    // const { selectedRoles } = this.state
    const selectedRoles = []
    selectedRoles.push(item)

    this.setState({ selectedRoles })
  }

  onClearRole() {
    this.setState({
      selectedRoles: [],
    })
  }

  resetForm() {
    this.onClearCategory()
    this.onClearRole()
  }

  toggleStatusMsg(show = false) {
    this.setState({
      showStatusMsg: show,
    })
  }

  handleSubmitLocal(e) {
    e.preventDefault()

    const { handleSubmit, userId } = this.props
    const { selectedCategories, selectedRoles } = this.state

    if (selectedCategories && selectedRoles) {
      const categoryId = selectedCategories[0].get('id')
      const role = selectedRoles[0].get('id').toLowerCase()
      const roleParams = {
        categoryId,
        role,
        userId,
      }

      return handleSubmit(roleParams, this.resetForm)
    }
    return null
  }

  render() {
    const {
      administeredCategories,
      isStaff,
      newRole,
      searchCategories,
    } = this.props

    const {
      selectedCategories,
      selectedRoles,
      showStatusMsg,
    } = this.state

    const userRoles = Immutable.fromJS([
      { id: 'FEATURED', name: 'Featured User', requires: ['CURATOR', 'MODERATOR'] },
      { id: 'CURATOR', name: 'Curator', requires: ['MODERATOR'] },
      { id: 'MODERATOR', name: 'Moderator', requires: ['MODERATOR'] },
    ])

    if (administeredCategories.count() < 1) {
      return null
    }

    const selectedCategoryRole = selectedCategories[0] ? administeredCategories.find(
      ac => ac.get('id') === selectedCategories[0].get('id'),
    ).get('role') : Immutable.List()

    const filteredRoles = userRoles.filter(ur =>
      isStaff || ur.get('requires').includes(selectedCategoryRole),
    )

    const enableSubmit = ((selectedCategories.length > 0) && (selectedRoles.length > 0))

    return (
      <form className={formStyle} onSubmit={this.onSubmit}>
        <div className="selectors">
          <FilterSelectorControl
            labelText="Choose Category"
            listItems={administeredCategories}
            onSelect={this.onSelectCategory}
            onClear={this.onClearCategory}
            searchCallback={searchCategories}
            searchPromptText="Type category name"
            selectedItems={selectedCategories}
            type="roleCategoryPicker"
          />
          <FilterSelectorControl
            labelText="Choose position"
            listItems={filteredRoles}
            onSelect={this.onSelectRole}
            onClear={this.onClearRole}
            searchPromptText="Type position"
            selectedItems={selectedRoles}
            type="rolePicker"
          />
        </div>
        {newRole && showStatusMsg &&
          <StatusMessage onHideCallback={() => this.toggleStatusMsg()}>Success!</StatusMessage>
        }
        <button
          className="role-submit"
          disabled={!enableSubmit}
          onClick={e => this.handleSubmitLocal(e)}
        >
          <span>Add</span>
        </button>
      </form>
    )
  }
}
UserCategoryRolesForm.propTypes = {
  administeredCategories: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isStaff: PropTypes.bool.isRequired,
  newRole: PropTypes.object,
  searchCategories: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
}
UserCategoryRolesForm.defaultProps = {
  newRole: null,
}
