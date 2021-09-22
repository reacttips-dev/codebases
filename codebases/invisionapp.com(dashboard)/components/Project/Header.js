/**
 * This is a prototype for UI testing.  This should never be seen
 * by customers :)
 */
import React from 'react'
import cx from 'classnames'
import { Link, Text } from '@invisionapp/helios'
import { Back, Documents, Rhombus } from '@invisionapp/helios/icons'

import Title from '../SpaceView/Title'

import { GenerateIDURL } from '../../utils/urlIDParser'

import styles from '../../css/project-prototype/header.css'
import { ROUTE_PAGES } from '../../constants/AppRoutes'

const Header = ({
  isLoading,
  description,
  title,
  canEdit,
  projectId,
  setSelectedUrl,
  spaceName,
  spaceUrl,
  updateTitle
}) => {
  return (<div className={styles.root}>
    <div className={styles.spaceLink}>
      { isLoading
        ? <div className={styles.spaceLinkLoading} />
        : <Link href={spaceUrl}>
          <Back
            aria-label='Back to space'
            fill='text-lighter'
            size={24}
            strokeWidth='1'
            viewBox='24'
          />
          <Text order='body' color='text-lighter'>
            {spaceName + ' '}
          </Text>
        </Link>
      }
    </div>

    <div className={styles.titleWrap}>
      { isLoading
        ? <div className={styles.titleLeftLoading} />
        : <Text order='title' color='text-darker'>
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
      <Link href='#' onClick={() => setSelectedUrl(ROUTE_PAGES)} title={description}>
        <Rhombus size={20} className={styles.icon} />
        <Text size='smaller' order='subtitle' className={styles.text}>Project overview</Text>
      </Link>
      <Link href={`/projects/${GenerateIDURL(projectId, title)}`} className={styles.linkAllDocs}>
        <Documents size={20} className={cx(styles.icon, styles.iconAllDocs)} />
        <Text size='smaller' order='subtitle' className={cx(styles.text, styles.allDocs)}>All documents</Text>
      </Link>
    </div>
  </div>)
}

export default Header
