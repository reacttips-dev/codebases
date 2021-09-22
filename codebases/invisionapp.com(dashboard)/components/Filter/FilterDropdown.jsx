import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import { Dropdown, Text, DocumentIcon } from '@invisionapp/helios'

import styles from '../../css/filter-dropdown.css'

class FilterDropdown extends React.PureComponent {
  static propTypes = {
    align: PropTypes.oneOf(['left', 'right']),
    name: PropTypes.string.isRequired,
    onSelect: PropTypes.func.isRequired,
    options: PropTypes.array.isRequired,
    selected: PropTypes.string.isRequired,
    externalDocConfig: PropTypes.object,
    externalDocFilterEntries: PropTypes.object
  }

  static defaultProps = {
    options: [],
    selected: 'All types'
  }

  constructor (props) {
    super(props)

    this.filterOptions = this.filterOptions.bind(this)
    this.selectItem = this.selectItem.bind(this)

    this.state = {
      filteredOptions: props.options || [],
      label: null,
      menu: null,
      open: false,
      searchInput: null
    }
  }

  componentDidUpdate (prevProps) {
    if (this.props.options && prevProps.options !== this.props.options) {
      this.setState({
        filteredOptions: this.props.options
      })
    }
  }

  filterOptions (e) {
    const val = e.target.value

    this.setState({
      filteredOptions: this.props.options.filter(opt => {
        return opt.name.toLowerCase().indexOf(val.toLowerCase()) >= 0
      })
    })
  }

  selectItem (idx) {
    this.props.onSelect(idx)
  }

  getDocumentIcon = (name) => {
    const dictionary = {
      'Prototypes': 'prototype',
      'Specs': 'spec',
      'Designs': 'harmony',
      'Boards': 'board',
      'Freehands': 'freehand',
      'Docs': 'rhombus',
      'All types': 'all-types'
    }
    return dictionary[name]
  }

  getOptions () {
    const { useName, name, selected, externalDocConfig } = this.props

    const externalDocTypes = (externalDocConfig &&
      externalDocConfig.filterExtResourceConfigs ? externalDocConfig.filterExtResourceConfigs.flat().map(externalType => {
        const typeKey = externalType.id

        return {
          onClick: !externalType.children && (() => this.selectItem(externalType.id)),
          selected: !externalType.children && typeKey === selected,
          label: externalType.title,
          icon: <DocumentIcon size='16' src={externalType.logoSrc} title={externalType.title} />,
          type: 'item',
          items: externalType.children ? externalType.children.flat().map(subType => (
            {
              label: subType.title,
              icon: <DocumentIcon size='16' src={subType.logoSrc} title={subType.title} />,
              selected: subType.id === selected,
              onClick: () => {
                this.selectItem(subType.id)
                this.toggleVisibility()
              },
              type: 'item'
            }
          )) : null
        }
      }) : [])

    const invisionDocType = this.state.filteredOptions.map((item, idx) => ({
      onClick: () => this.selectItem(useName ? item.name : idx),
      selected: item.name === selected,
      label: item.name,
      icon: name === 'filter' && this.getDocumentIcon(item.name) && <DocumentIcon size='16' documentType={this.getDocumentIcon(item.name)} className={styles.icon} />,
      type: 'item'
    }))

    return invisionDocType.concat(externalDocTypes)
  }

  toggleVisibility = () => {
    const { open } = this.state
    this.setState({
      open: !open
    })
  }

  render () {
    const {
      align: propsAlign,
      selected,
      externalDocFilterEntries,
      mqs
    } = this.props

    const {
      open
    } = this.state

    const align = (mqs && mqs.sDown) || propsAlign === 'left' ? 'left' : 'right'

    const thirdpartyDocsSelectedTitle = externalDocFilterEntries && externalDocFilterEntries[selected] ? externalDocFilterEntries[selected].parentTitle ? `${externalDocFilterEntries[selected].parentTitle} ${externalDocFilterEntries[selected].title}` : externalDocFilterEntries[selected].title : ''

    return (
      <div className={cx(styles.root, { [styles.alignLeft]: propsAlign === 'left' })}>
        <Dropdown
          menuClassName={styles.dropdownMenu}
          items={this.getOptions()}
          open={open}
          align={align}
          onRequestToggleVisibility={this.toggleVisibility}
          trigger={<Text order='body' color={null} element='span'>{thirdpartyDocsSelectedTitle !== '' ? thirdpartyDocsSelectedTitle : selected}</Text>}
          closeOnClick
        />
      </div>
    )
  }
}

export default FilterDropdown
