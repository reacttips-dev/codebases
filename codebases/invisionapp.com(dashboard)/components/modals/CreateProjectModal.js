import React, { useEffect, useRef, useState } from 'react'
import cx from 'classnames'

import {
  Alert,
  Button,
  Spaced,
  Stack,
  Text,
  Input
} from '@invisionapp/helios-one-web'

import ProjectPreview from './CreateProject/ProjectPreview'
import RainbowSwatch from './CreateProject/RainbowSwatch'
import SmallShape from './CreateProject/SmallShape'

import {
  PROJECT_COLORS,
  PROJECT_SHAPE_SQUARE_UP,
  PROJECT_SHAPE_SQUARE_DOWN,
  PROJECT_SHAPE_CIRCLE_UP,
  PROJECT_SHAPE_CIRCLE_DOWN,
  PROJECT_SHAPE_ARCH_UP,
  PROJECT_SHAPE_ARCH_DOWN
} from '../../constants/project-props'
import { GET_PROJECTS_DETAIL } from '../../constants/server-urls'

import sanitizeName from '../../utils/sanitizeName'
import { request } from '../../utils/API'

import styles from './css/create-project.css'

const generateRandomDirection = () => {
  return Math.round(Math.random()) === 1 ? 'up' : 'down'
}

const CreateProject = props => {
  const input = useRef(null)
  const colorInput = useRef(null)
  const direction = useRef(generateRandomDirection())

  const squareShape = direction.current && direction.current === 'up' ? PROJECT_SHAPE_SQUARE_UP : PROJECT_SHAPE_SQUARE_DOWN
  const circleShape = direction.current && direction.current === 'up' ? PROJECT_SHAPE_CIRCLE_UP : PROJECT_SHAPE_CIRCLE_DOWN
  const archShape = direction.current && direction.current === 'up' ? PROJECT_SHAPE_ARCH_UP : PROJECT_SHAPE_ARCH_DOWN

  const [projectName, setProjectName] = useState('')
  const [projectColor, setProjectColor] = useState(PROJECT_COLORS[0])
  const [isCustomColor, setIsCustomColor] = useState(false)
  const [projectShape, setProjectShape] = useState(squareShape)
  const [projectError, setProjectError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const { error, errorCode, isCreating, modalData, serverActions } = props

  const isEditing = modalData.projectId && modalData.projectId !== ''

  useEffect(() => {
    if (input.current && input.current.focus) {
      input.current.focus()
    }
    if (errorCode !== 409) {
      setProjectName('')
    }
  }, [])

  useEffect(() => {
    if (modalData.projectId) {
      request(`${GET_PROJECTS_DETAIL}?ids=${modalData.projectId}`, {
        method: 'GET'
      }).then(res => {
        if (res.response && res.response.data && res.response.data[modalData.projectId]) {
          const activeProject = res.response.data[modalData.projectId]
          setProjectName(activeProject.title)
          if (activeProject.color) {
            setProjectColor(activeProject.color)

            if (PROJECT_COLORS.indexOf(activeProject.color) === -1) {
              setIsCustomColor(true)
            } else {
              setIsCustomColor(false)
            }
          }
          if (activeProject.shape) setProjectShape(activeProject.shape)
        }

        setIsLoading(false)
      })
    }
  }, [modalData.projectId])

  const handleCreateProject = () => {
    if (projectName.length === 0) {
      setProjectError('Please add a Project name')
      return
    } else {
      setProjectError('')
    }

    if (isEditing) {
      serverActions.updateProjectSidebar.request(
        modalData.spaceId,
        modalData.projectId,
        sanitizeName(projectName),
        modalData.description,
        projectShape,
        projectColor
      )
    } else {
      serverActions.createProject.request(
        modalData.spaceId,
        sanitizeName(projectName),
        projectShape,
        projectColor,
        modalData.context || 'sidebar'
      )
    }
  }

  const handleKeyUp = e => {
    if (e.which === 13) {
      handleCreateProject()
    }
  }

  const setPresetColor = color => {
    setIsCustomColor(false)
    setProjectColor(color)
  }

  const handleColorBlur = e => {
    if (e.target.value.length < 7) {
      setProjectColor(e.target.value.padEnd(7, 'F'))
    }
  }

  const handleSetColor = e => {
    const { target: { value } } = e
    setIsCustomColor(true)

    let color = value.replace(/[^0-9a-fA-F]/g, '')
    color = '#' + color
    setProjectColor(color)
  }

  const handleProjectNameChange = e => {
    setProjectName(sanitizeName(e.target.value))
  }

  const isSquare = [PROJECT_SHAPE_SQUARE_UP, PROJECT_SHAPE_SQUARE_DOWN].indexOf(projectShape) >= 0
  const isCircle = [PROJECT_SHAPE_CIRCLE_UP, PROJECT_SHAPE_CIRCLE_DOWN].indexOf(projectShape) >= 0
  const isArch = [PROJECT_SHAPE_ARCH_UP, PROJECT_SHAPE_ARCH_DOWN].indexOf(projectShape) >= 0

  return (
    <div className={styles.root}>
      <Stack spacing='24' justifyContent='center'>
        {(props.error || projectError !== '') && (
          <div className={styles.error}>
            <Alert
              className={styles.alertMessage}
              dismissable
              status='danger'
            >
              {projectError !== '' ? projectError : errorCode === 409 ? 'Project name is already in-use' : error}
            </Alert>
          </div>
        )}

        <Text
          size='heading-24'
          align='center'
          element='div'
          color='surface-100'>
          { isEditing ? 'Customize project' : 'Create a new project' }
        </Text>

        <ProjectPreview
          isLoading={isLoading && !!modalData.projectId}
          title={projectName}
          color={projectColor.padEnd(7, 'F')}
          shape={projectShape}
        />

        <Input
          id='new-project-name'
          label='Project name'
          placeholder='Project name'
          labelPosition='top'
          ref={input}
          onChange={handleProjectNameChange}
          onKeyUp={handleKeyUp}
          type='text'
          value={projectName}
          size='48'
          className={styles.nameInput}
        />

        <div className={styles.metaWrap}>
          <div className={styles.colorWrap}>
            <Spaced bottom='8'>
              <Text align='left' size='label-12' color='surface-100'>Color</Text>
            </Spaced>
            <div className={styles.colors}>
              {PROJECT_COLORS.map(color => (
                <button
                  tabIndex={0}
                  aria-label={color}
                  aria-pressed={projectColor === color && !isCustomColor ? 'true' : 'false'}
                  key={`color-${color}`}
                  className={cx(styles.color, { [styles.selected]: projectColor === color && !isCustomColor })}
                  onClick={() => setPresetColor(color)}
                  style={{ backgroundColor: color }} />
              ))}

              <button
                tabIndex={0}
                aria-label='Select a custom color'
                aria-pressed={isCustomColor ? 'true' : 'false'}
                className={cx(styles.color, { [styles.selected]: isCustomColor })}
                onClick={() => {
                  setIsCustomColor(true)
                  colorInput.current.select()
                  colorInput.current.focus()
                }}>
                <RainbowSwatch />
              </button>

              <input
                aria-label='Custom color'
                ref={colorInput}
                type='text'
                maxLength={7}
                value={projectColor}
                onBlur={handleColorBlur}
                onChange={handleSetColor}
              />
            </div>
          </div>

          <div className={styles.shapeWrap}>
            <Spaced bottom='8'>
              <Text align='left' size='label-12' color='surface-100'>Shape</Text>
            </Spaced>
            <div className={styles.shapes}>
              <button
                tabIndex={0}
                aria-label='Square'
                aria-pressed={isSquare ? 'true' : 'false'}
                className={cx(styles.shape, { [styles.selected]: isSquare })}
                onClick={() => setProjectShape(squareShape)}>
                <SmallShape type='square' isSelected={isSquare} />
              </button>
              <button
                tabIndex={0}
                aria-label='Circle'
                aria-pressed={isCircle ? 'true' : 'false'}
                className={cx(styles.shape, { [styles.selected]: isCircle })}
                onClick={() => setProjectShape(circleShape)}>
                <SmallShape type='circle' isSelected={isCircle} />
              </button>
              <button
                tabIndex={0}
                aria-label='Arch'
                aria-pressed={isArch ? 'true' : 'false'}
                className={cx(styles.shape, { [styles.selected]: isArch })}
                onClick={() => setProjectShape(archShape)}>
                <SmallShape type='arch' isSelected={isArch} />
              </button>
            </div>
          </div>
        </div>

        <div className={styles.buttons}>
          <Button
            order='secondary'
            size='40'
            onClick={() => props.closeModal(false)}
            className={styles.cancelButton}>
            Cancel
          </Button>

          <Button
            order='primary'
            size='40'
            disabled={isCreating}
            onClick={handleCreateProject}
            className={styles.createButton}>
            {!isCreating && (isEditing ? 'Update' : 'Create')}
            {isCreating && (isEditing ? 'Updating project...' : 'Creating project...')}
          </Button>
        </div>
      </Stack>
    </div>
  )
}

export default CreateProject
