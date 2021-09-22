import React, { useState } from 'react'
import cx from 'classnames'
import PropTypes from 'prop-types'

import { DocumentIcon, Dropdown, Skeleton, Spaced, Text } from '@invisionapp/helios'
import { ExpandMenuAlt } from '@invisionapp/helios/icons'

import styles from '../../css/document-type-filter.css'
import {
  FILTER_ALL,
  FILTER_INVISION,
  FILTER_ARCHIVED_ONLY,
  FILTER_FREEHANDX_TITLES
} from '../../constants/FilterTypes'

const iconNames = {
  'Prototypes': 'prototype',
  'Specs': 'spec',
  'Designs': 'harmony',
  'Boards': 'board',
  'Freehands': 'freehand',
  'Docs': 'rhombus'
}

const DocumentTypeFilter = ({
  onChange,
  selectedType,
  types,
  canChange,
  externalTypesConfig,
  externalDocFilterEntries,
  enableFreehandXFilteringSorting,
  isArchived
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const getOptions = () => {
    const invisionDocTypes = types.map(item => {
      const textProps = item === selectedType
        ? { order: 'subtitle' }
        : {
          order: 'body',
          size: 'larger'
        }

      return {
        onClick: () => onChange(item),
        selected: item === selectedType,
        label: <Spaced left='xxs'><Text {...textProps}>{item}</Text></Spaced>,
        icon: <DocumentIcon size='32' documentType={iconNames[item] || 'all-types'} />,
        type: 'item'
      }
    })

    const externalDocTypes = externalTypesConfig?.filterExtResourceConfigs ? externalTypesConfig.filterExtResourceConfigs.flatMap(
      externalTypeGroup => {
        const docTypeGroup = externalTypeGroup.reduce((listOfExtTypes, externalType) => {
          const typeKey = externalType.id
          const textProps = typeKey === selectedType

          listOfExtTypes.push({
            onClick: !externalType.children && (() => onChange(typeKey, true)),
            selected: !externalType.children && typeKey === selectedType,
            label: <Spaced left='xxs'><Text {...textProps} className={styles.docTitle}>{externalType.title}</Text></Spaced>,
            icon: <DocumentIcon size='32' src={externalType.logoSrc} title={externalType.title} />,
            type: 'item',
            items: externalType.children ? externalType.children.flatMap(subTypeGroup => {
              return subTypeGroup.reduce((listOfSubTypes, subType) => {
                listOfSubTypes.push({
                  label: <Spaced left='xxs'><Text {...textProps} className={styles.docTitle}>{subType.title}</Text></Spaced>,
                  icon: <DocumentIcon size='32' src={subType.logoSrc} title={subType.title} />,
                  selected: subType.id === selectedType,
                  onClick: () => {
                    onChange(subType.id, true)
                    toggleVisibility()
                  },
                  type: 'item'
                })
                return listOfSubTypes
              }, [])
            }) : null
          })
          return listOfExtTypes
        }, [])
        return docTypeGroup
      }) : []

    return invisionDocTypes.concat(externalDocTypes)
  }

  const getText = () => {
    if (enableFreehandXFilteringSorting) {
      let titleLookup = selectedType
      if (isArchived) {
        titleLookup = FILTER_ARCHIVED_ONLY
      }
      return iconNames[selectedType] || selectedType === FILTER_ALL || selectedType === FILTER_INVISION ? FILTER_FREEHANDX_TITLES[titleLookup] : (<div className={styles.titleSkeletonWrap}><Skeleton height={16} /></div>)
    } else {
      return iconNames[selectedType] || selectedType === FILTER_ALL ? selectedType : (<div className={styles.titleSkeletonWrap}><Skeleton height={16} /></div>)
    }
  }

  const renderIcons = () => {
    if (iconNames[selectedType] || (externalDocFilterEntries && !externalDocFilterEntries[selectedType]) || selectedType === FILTER_ALL || externalTypesConfig === null) {
      return (
        <DocumentIcon
          size='32'
          documentType={iconNames[selectedType] || 'all-types'}
          className={styles.icon}
        />
      )
    } else {
      return (
        <DocumentIcon
          size='32'
          src={externalDocFilterEntries[selectedType].logoSrc}
          className={styles.icon}
        />
      )
    }
  }

  const renderDropdownTrigger = () => {
    const classes = cx({
      [styles.root]: true,
      [styles.staticTitle]: !canChange || enableFreehandXFilteringSorting
    })

    return (
      <div className={classes}>
        {!enableFreehandXFilteringSorting ? renderIcons() : null}
        {iconNames[selectedType] || (externalDocFilterEntries && !externalDocFilterEntries[selectedType]) || selectedType === FILTER_ALL || externalTypesConfig === null ? (
          <Text
            className={!enableFreehandXFilteringSorting ? styles.title : ``}
            order='title'
            color='text'>
            {getText()}
          </Text>
        ) : (
          <Text
            className={!enableFreehandXFilteringSorting ? styles.title : ``}
            order='title'
            color='text'>
            {externalDocFilterEntries[selectedType].parentTitle ? `${externalDocFilterEntries[selectedType].parentTitle} ${externalDocFilterEntries[selectedType].title}` : externalDocFilterEntries[selectedType].title}
          </Text>
        )
        }

        {(canChange && !enableFreehandXFilteringSorting) && <Spaced left='xxs'>
          <div className={styles.expandIcon}>
            <ExpandMenuAlt size={24} />
          </div>
        </Spaced>
        }
      </div>
    )
  }

  const toggleVisibility = () => {
    setIsOpen(!isOpen)
  }

  const renderDropdown = () => {
    return (
      <div>
        <Dropdown
          aria-label='Document type selection'
          className={styles.dropdown}
          closeOnClick
          items={getOptions()}
          menuClassName={styles.menu}
          onChangeVisibility={() => {}}
          onRequestToggleVisibility={toggleVisibility}
          placement='bottom'
          trigger={renderDropdownTrigger()}
          unstyledTrigger
          width={329}
          align='left'
          open={isOpen}
          withIconButtonBackground={false}
        />
      </div>
    )
  }

  const renderStatic = () => {
    return renderDropdownTrigger()
  }

  return (canChange && !enableFreehandXFilteringSorting) ? renderDropdown() : renderStatic()
}

DocumentTypeFilter.propTypes = {
  onChange: PropTypes.func,
  selectedType: PropTypes.string,
  types: PropTypes.array,
  canChange: PropTypes.bool,
  externalDocConfig: PropTypes.object,
  externalDocFilterEntries: PropTypes.object,
  enableFreehandXFilteringSorting: PropTypes.bool,
  isArchived: PropTypes.bool
}

DocumentTypeFilter.defaultProps = {
  canChange: true,
  enableFreehandXFilteringSorting: false,
  isArchived: false
}

export default DocumentTypeFilter
