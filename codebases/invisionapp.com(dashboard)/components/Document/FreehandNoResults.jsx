import React from 'react'
import { useSelector } from 'react-redux'
import { Button, Padded, Spaced, Text } from '@invisionapp/helios'
import { Add } from '@invisionapp/helios/icons'
import { getSpaceId } from '../../selectors/space'
import styles from '../../css/freehand-no-results.css'
import BrainstormingIcon from '../../img/freehand/brainstorm.svg'
import EffectiveMeetingsIcon from '../../img/freehand/effective-meetings.svg'
import StrategyAndPlanningIcon from '../../img/freehand/strategy-and-planning.svg'
import WireframeIcon from '../../img/freehand/wireframe.svg'
import LearnIcon from '../../img/freehand/learn-icon.svg'

export default function FreehandNoResults () {
  const spaceId = useSelector(getSpaceId)

  return (
    <div className={styles.container}>
      <Spaced bottom='s'>
        <Text order='title' size='smaller'>
            Collaborate with the online whiteboard for everyone
        </Text>
      </Spaced>
      <Padded bottom='xl'>
        <Text order='body' size='larger'>
            How do you want to start today?
        </Text>
      </Padded>

      <Spaced top='xs'>
        <ul className={styles.actionTiles}>
          {actions.map(action => {
            return (
              <li className={styles.actionTile} key={action.url}>
                <a href={action.url(spaceId)} onClick={action.internal ? handleTileClick : undefined} target='_blank' rel='noopener noreferrer'>
                  {action.render()}
                </a>
              </li>
            )
          })}
        </ul>
      </Spaced>
    </div>
  )
}

const actions = [
  {
    render (spaceId) {
      return (
        <div className={styles.tileContainer}>
          <Add fill='primary' className={styles.blankIcon} />
          <Text className={styles.text} order='body'>Blank Freehand</Text>
          <Button className={styles.actionButton}>Create</Button>
        </div>
      )
    },
    internal: true,
    url: spaceId => {
      const params = new URLSearchParams()

      params.set('blank', '')
      if (spaceId) {
        params.set('spaceId', spaceId)
      }

      return `/freehand/new?${params.toString()}`
    }
  },
  {
    render () {
      return (
        <div className={styles.tileContainer}>
          <div className={styles.templateIcon}><BrainstormingIcon /></div>
          <Text className={styles.text} order='body'>Brainstorm</Text>
          <Button className={styles.actionButton}>Explore</Button>
        </div>
      )
    },
    internal: true,
    url: (spaceId) => {
      const params = new URLSearchParams()

      params.set('blank', '')
      params.set('template', 'brainstorming')

      if (spaceId) {
        params.set('spaceId', spaceId)
      }

      return `/freehand/new?${params.toString()}`
    }
  },
  {
    render () {
      return (
        <div className={styles.tileContainer}>
          <div className={styles.templateIcon}><StrategyAndPlanningIcon /></div>
          <Text className={styles.text} order='body'>Strategy and Planning</Text>
          <Button className={styles.actionButton}>Explore</Button>
        </div>
      )
    },
    internal: true,
    url: (spaceId) => {
      const params = new URLSearchParams()

      params.set('blank', '')
      params.set('template', 'brainstorming')

      if (spaceId) {
        params.set('spaceId', spaceId)
      }

      return `/freehand/new?${params.toString()}`
    }
  },
  {
    render () {
      return (
        <div className={styles.tileContainer}>
          <div className={styles.templateIcon}><WireframeIcon /></div>
          <Text className={styles.text} order='body'>Wireframe</Text>
          <Button className={styles.actionButton}>Explore</Button>
        </div>
      )
    },
    internal: true,
    url: (spaceId) => {
      const params = new URLSearchParams()

      params.set('blank', '')
      params.set('template', 'brainstorming')

      if (spaceId) {
        params.set('spaceId', spaceId)
      }

      return `/freehand/new?${params.toString()}`
    }
  },
  {
    render () {
      return (
        <div className={styles.tileContainer}>
          <div className={styles.templateIcon}><EffectiveMeetingsIcon /></div>
          <Text className={styles.text} order='body'>Effective meetings</Text>
          <Button className={styles.actionButton}>Explore</Button>
        </div>
      )
    },
    internal: true,
    url: (spaceId) => {
      const params = new URLSearchParams()

      params.set('blank', '')
      params.set('template', 'brainstorming')

      if (spaceId) {
        params.set('spaceId', spaceId)
      }

      return `/freehand/new?${params.toString()}`
    }
  },
  {
    render () {
      return (
        <div className={styles.learnFreehandContainer}>
          <div className={styles.learnFreehandText}>
            <LearnIcon />
            <Text order='body' size='larger' color='white' className={styles.learnFreehandTitle}>Learn Freehand</Text>
            <Text order='body' size='smallest' color='white'>Get to know Freehand with our<br /> self-guided learning experience</Text>
          </div>
          <Button order='secondary' reversed className={styles.learnFreehandButton}>Start learning</Button>
        </div>
      )
    },
    internal: false,
    url: () => 'https://learn.invisionapp.com/learning-paths/freehand-for-everyone'
  }
]

function handleTileClick (e) {
  e.preventDefault()
  e.stopPropagation()

  window.inGlobalContext.appShell.navigate(e.currentTarget.href)
}
