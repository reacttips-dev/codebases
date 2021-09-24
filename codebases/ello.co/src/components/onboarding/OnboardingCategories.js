import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import OnboardingNavbar from './OnboardingNavbar'
import { MainView } from '../views/MainView'
import { CheckIconSM } from '../assets/Icons'
import { categoryLinkStyle, categoryLinkTextStyle } from '../buttons/Buttons'
import { Title } from './OnboardingParts'
import { css, media } from '../../styles/jss'
import * as s from '../../styles/jso'

// TODO: Eventually move to Buttons
class CategoryButton extends PureComponent {

  static propTypes = {
    category: PropTypes.object.isRequired,
    onCategoryClick: PropTypes.func.isRequired,
  }

  componentWillMount() {
    this.state = { isActive: false }
  }

  onClick = () => {
    const { category, onCategoryClick } = this.props
    this.setState({ isActive: !this.state.isActive })
    onCategoryClick(category.get('id'))
  }

  render() {
    const { category } = this.props
    const { isActive } = this.state
    return (
      <button
        onClick={this.onClick}
        className={classNames(`${categoryLinkStyle}`, { isActive })}
        style={{ backgroundImage: `url("${category.getIn(['tileImage', 'large', 'url'])}")` }}
      >
        <span className={categoryLinkTextStyle}>
          {isActive ? <CheckIconSM /> : null}
          {category.get('name')}
        </span>
      </button>
    )
  }
}

const categoriesStyle = css(
  s.flex,
  s.flexRow,
  s.flexWrap,
  s.mt10,
  { marginLeft: -20 },
  media(s.minBreak4, s.mt20, { marginLeft: -40 }),
)

const OnboardingCategories = ({ categories, isNextDisabled, onCategoryClick }) => {
  const btns = []
  categories.map(category =>
    btns.push(
      <CategoryButton
        category={category}
        key={`CategoryLink_${category.get('slug')}`}
        onCategoryClick={onCategoryClick}
      />,
    ),
  )
  return (
    <MainView className="Onboarding OnboardingCategories">
      <Title
        text1="Pick what you're into. "
        text2="Slow down & check out some cool ass shit."
      />
      <section className="StreamContainer">
        <div className={categoriesStyle}>{btns}</div>
      </section>
      <OnboardingNavbar isNextDisabled={isNextDisabled} />
    </MainView>
  )
}

OnboardingCategories.propTypes = {
  categories: PropTypes.array.isRequired,
  isNextDisabled: PropTypes.bool.isRequired,
  onCategoryClick: PropTypes.func.isRequired,
}

export default OnboardingCategories

