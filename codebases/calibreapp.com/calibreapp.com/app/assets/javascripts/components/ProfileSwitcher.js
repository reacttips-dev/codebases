import React from 'react'
import classnames from 'classnames'
import RadioButtonGroup from './RadioButtonGroup'

import { ChevronIcon as Chevron } from './Icon'
import truncate from '../utils/smart-truncate'

class ProfileSwitcher extends React.Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      panelIsOpen: false,
      profile: this.props.selectedProfile
    }

    this.toggleFilterVisibility = this.toggleFilterVisibility.bind(this)
    this.handleProfileChange = this.handleProfileChange.bind(this)
    this.closeMenu = this.closeMenu.bind(this)
  }

  componentDidMount() {
    document.body.addEventListener('click', this.closeMenu, false)
  }

  componentWillUnmount() {
    document.body.removeEventListener('click', this.closeMenu)
  }

  closeMenu(event) {
    let els = []
    let element = event.target
    while (element.parentNode) {
      els.unshift(element.parentNode)
      element = element.parentNode
    }

    const withinDropdown = els.reverse().some(el => {
      if (el.classList) return el.classList.contains('dropdown')
    })

    if (!withinDropdown) this.setState({ panelIsOpen: false })
  }

  toggleFilterVisibility() {
    this.setState({
      panelIsOpen: !this.state.panelIsOpen
    })
  }

  handleProfileChange(profile) {
    this.toggleFilterVisibility()

    this.setState(
      {
        profile: profile
      },
      () => {
        this.props.onApply.call(this, {
          profile: this.state.profile
        })
      }
    )
  }

  get activeFilter() {
    const profile = this.props.profiles.find(
      profile => profile.uuid == this.selectedProfile
    )

    if (!profile) return null

    return <span>{truncate(profile.name, 25)}</span>
  }

  get selectedProfile() {
    return this.props.selectedProfile || this.props.profiles[0].uuid
  }

  render() {
    const profiles = this.props.profiles.map(profile => {
      return {
        label: profile.name,
        value: profile.uuid
      }
    })

    const classes = classnames('dropdown', {
      'dropdown--isActive': this.state.panelIsOpen
    })

    return (
      <div className={classes} style={{ display: 'inline-block' }}>
        <button
          className="dropdown__trigger type-semibold type-c-dark-grey "
          onClick={this.toggleFilterVisibility}
          style={{ cursor: 'pointer' }}
        >
          {this.activeFilter}
          <div className="dropdown__chevron">
            <Chevron />
          </div>
        </button>

        <div className="dropdown__target">
          <div className="dropdown__content">
            <span className="dropdown__heading">Profile</span>

            <RadioButtonGroup
              onChange={this.handleProfileChange}
              checked={this.selectedProfile}
              items={profiles}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default ProfileSwitcher
