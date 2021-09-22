import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import { Icon, Nav, Text, Link, Skeleton } from '@invisionapp/helios-one-web'

import Title from '../common/Title'
import ProjectIcon from './ProjectIcon'

import { useRoute } from '../sidebar/hooks/useRoute'

import { PROP_TYPE_COLOR } from '../../constants/custom-prop-types'
import { PROJECT_SHAPES } from '../../constants/project-props'

import styles from './css/header.css'

const Header = ({
  isLoading,
  title,
  canEdit,
  color,
  shape,
  spaceName,
  spaceUrl,
  updateTitle,
  path,
  overviewPageUrl
}) => {
  const { pathname } = useRoute()

  let links = [
    {
      as: 'a',
      icon: (
        <Icon
          name='Documents'
          size='24'
          color='surface-100'
          isDecorative
          aria-label='All documents'
        />
      ),
      label: 'All documents',
      href: path,
      isSelected: pathname === path
    }
  ]

  if (overviewPageUrl !== '') {
    links.unshift({
      as: 'a',
      icon: (
        <Icon
          name='AlignLeft'
          size='24'
          color='surface-100'
          isDecorative
          aria-label='Project overview'
        />
      ),
      label: 'Project overview',
      href: overviewPageUrl,
      isSelected: pathname === overviewPageUrl
    })
  }

  return (
    <div className={styles.root}>
      <div className={styles.spaceLink}>
        { isLoading
          ? <div className={styles.spaceLinkLoading}>
            <Skeleton />
          </div>
          : <Link
            order='surface'
            hasUnderline={false}
            href={spaceUrl}>
            <Icon
              aria-hidden='true'
              name='ChevronLeft'
            />
            <Text
              align='left'
              color='text'
              size='heading-13'>
              {spaceName + ' '}
            </Text>
          </Link>
        }
      </div>

      <div className={styles.projectIconWrap}>
        <ProjectIcon
          isLoading={isLoading}
          shape={shape}
          color={color}
        />
      </div>

      <div className={styles.titleWrap}>
        { isLoading
          ? <div className={styles.titleLoading}>
            <Skeleton />
          </div>
          : <Text order='title' size='heading-32'>
            <Title
              allowEdit={canEdit}
              charLimit={100}
              className={cx(styles.title, {
                [styles.readonly]: !canEdit
              })}
              isLoading={isLoading && !title}
              onSubmit={updateTitle}
              placeholder='Name your project'
              title={title}
              error={null}
            />
          </Text>
        }
      </div>

      <div className={styles.links}>
        { !isLoading &&
          <Nav
            aria-label='Project navigation'
            links={links}
            order='primary'
          />
        }
      </div>
    </div>
  )
}

Header.propTypes = {
  isLoading: PropTypes.bool,
  title: PropTypes.string,
  canEdit: PropTypes.bool,
  color: PROP_TYPE_COLOR,
  shape: PropTypes.oneOf(PROJECT_SHAPES),
  spaceName: PropTypes.string,
  spaceUrl: PropTypes.string,
  updateTitle: PropTypes.func,
  overviewPageUrl: PropTypes.string,
  path: PropTypes.string
}

export default Header
