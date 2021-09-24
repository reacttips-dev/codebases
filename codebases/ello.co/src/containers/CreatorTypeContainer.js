/* eslint-disable react/no-multi-comp */
import Immutable from 'immutable'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import debounce from 'lodash/debounce'
import { getCategories } from '../actions/discover'
import { saveProfile } from '../actions/profile'
import { selectCreatorTypeCategories } from '../selectors/categories'
import { selectCreatorTypeCategoryIds } from '../selectors/profile'
import { css, hover, media, modifier, parent, select } from '../styles/jss'
import { ONBOARDING_VERSION } from '../constants/application_types'
import { closeModal } from '../actions/modals'
import FormButton from '../components/forms/FormButton'
import CreatorTypesModal from '../components/modals/CreatorTypesModal'
import * as s from '../styles/jso'

const containerStyle = css(
  s.fullWidth,
  { maxWidth: 490 },
)

const headerStyle = css(
  s.colorA,
  s.sansRegular,
  s.fontSize24,
  s.mb20,
  s.transitionHeight,
)

const catHeaderStyle = css(
  { ...headerStyle },
  { marginTop: 30 },
  parent('.inSettings', s.mt20),
)

const categoriesStyle = css(
  { marginBottom: -10 },
)

const buttonStyle = css(
  s.bgcWhite,
  s.borderA,
  s.center,
  s.colorA,
  s.mr10,
  s.px5,
  s.truncate,
  {
    borderRadius: 5,
    height: 40,
    maxWidth: 230,
    transition: 'background-color 0.2s, border-color 0.2s, color 0.2s',
    width: 'calc(50% - 5px)',
  },
  hover(s.colorWhite, s.bgcBlack, s.borderBlack),
  modifier('.isActive', s.colorWhite, s.bgcBlack, s.borderBlack),
  select(':nth-child(2n)', s.mr0),
)

const catButtonStyle = css(
  { ...buttonStyle },
  s.mb10,
  modifier('.isActive', hover(s.bgc6, { border: '1px solid #666' })),
  media('(min-width: 26.25em)', // 420 / 16 = 26.25em
    { maxWidth: 150, width: 'calc(33% - 6px)' },
    select(':nth-child(2n)', s.mr10),
    select(':nth-child(3n)', s.mr0),
  ),
)

const submitButtonStyle = css(
  s.mt30,
  s.hv40,
  { lineHeight: 3 },
)

export class CategoryButton extends PureComponent {

  static propTypes = {
    category: PropTypes.object.isRequired,
    isActive: PropTypes.bool.isRequired,
    onCategoryClick: PropTypes.func.isRequired,
  }

  componentWillMount() {
    this.state = { isActive: this.props.isActive }
  }

  onClick = () => {
    const { category, onCategoryClick } = this.props
    this.setState({ isActive: !this.state.isActive })
    onCategoryClick(Number(category.get('id')))
  }

  render() {
    const { category } = this.props
    const { isActive } = this.state
    return (
      <button
        className={`${catButtonStyle} ${isActive ? 'isActive' : ''}`}
        onClick={this.onClick}
      >
        {category.get('name')}
      </button>
    )
  }
}

function mapStateToProps(state, props) {
  const { classModifier } = props
  return {
    categories: selectCreatorTypeCategories(state),
    creatorTypeIds: (selectCreatorTypeCategoryIds(state) || Immutable.List()).toArray(),
    isModal: classModifier !== 'inOnboarding' && classModifier !== 'inSettings',
  }
}

class CreatorTypeContainer extends PureComponent {

  static propTypes = {
    categories: PropTypes.array.isRequired,
    classModifier: PropTypes.string,
    creatorTypeIds: PropTypes.array,
    dispatch: PropTypes.func.isRequired,
    isModal: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    classModifier: '',
    creatorTypeIds: [],
  }

  componentWillMount() {
    const { classModifier, creatorTypeIds, dispatch } = this.props
    this.state = {
      artistActive: creatorTypeIds.length > 0,
      categoryIds: creatorTypeIds,
      fanActive: creatorTypeIds.length === 0 && classModifier === 'inSettings',
    }
    this.updateCreatorTypes = debounce(this.updateCreatorTypes, 1000)
    dispatch(getCategories())
  }

  onCategoryClick = (id) => {
    const ids = [...this.state.categoryIds]
    const index = ids.indexOf(id)
    if (index === -1) {
      ids.push(id)
    } else {
      ids.splice(index, 1)
    }
    this.setState({ categoryIds: ids }, this.updateCreatorTypes)
  }

  onClickArtist = () => {
    this.setState({ artistActive: true, fanActive: false })
  }

  onClickFan = () => {
    this.setState({
      artistActive: false,
      categoryIds: [],
      fanActive: true,
    }, this.updateCreatorTypes)
  }

  onClickModalSubmit = () => {
    const { dispatch } = this.props
    const { categoryIds } = this.state
    dispatch(
      saveProfile({ creator_type_category_ids: categoryIds,
        web_onboarding_version: ONBOARDING_VERSION }))
    dispatch(closeModal(<CreatorTypesModal />))
  }

  updateCreatorTypes = () => {
    const { isModal, dispatch } = this.props
    const { categoryIds } = this.state
    if (!isModal) {
      dispatch(saveProfile({ creator_type_category_ids: categoryIds }))
    }
  }

  render() {
    const { categories, classModifier, isModal } = this.props
    const { artistActive, categoryIds, fanActive } = this.state
    const showSubmit = isModal && (fanActive || categoryIds.length > 0)
    return (
      <div className={`${classModifier} ${containerStyle}`}>
        <h2 className={headerStyle}>I am here as:</h2>
        <div>
          <button
            className={`${buttonStyle} ${artistActive ? 'isActive' : ''}`}
            disabled={artistActive}
            onClick={this.onClickArtist}
          >
            An Artist
          </button>
          <button
            className={`${buttonStyle} ${fanActive ? 'isActive' : ''}`}
            disabled={fanActive}
            onClick={this.onClickFan}
          >
            A Fan
          </button>
        </div>
        {artistActive &&
          <div>
            <h2 className={catHeaderStyle}>I make:</h2>
            <div className={categoriesStyle}>
              {categories.map(cat => (
                <CategoryButton
                  category={cat}
                  isActive={categoryIds.indexOf(Number(cat.get('id'))) > -1}
                  key={`category_${cat.get('id')}`}
                  onCategoryClick={this.onCategoryClick}
                />
              ))}
            </div>
          </div>
        }
        { showSubmit ? <FormButton
          className={`FormButton Submit isRounded ${submitButtonStyle}`}
          onClick={this.onClickModalSubmit}
        >
          Submit
        </FormButton> : null }
      </div>
    )
  }
}

export default connect(mapStateToProps)(CreatorTypeContainer)

