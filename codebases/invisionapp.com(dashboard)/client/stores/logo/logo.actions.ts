import { Dispatch } from 'redux'
import { trackSettingsTeamIconFailed } from '../../helpers/analytics'
import { showFlash } from '../flash'
import { Notification } from './logo.types'

export const UPLOAD_LOGO = {
  REQUEST: 'teams/logo/UPLOAD.REQUEST',
  SUCCESS: 'teams/logo/UPLOAD.SUCCESS',
  FAILURE: 'teams/logo/UPLOAD.FAILURE'
}

export const DELETE_LOGO = {
  REQUEST: 'teams/logo/DELETE.REQUEST',
  SUCCESS: 'teams/logo/DELETE.SUCCESS',
  FAILURE: 'teams/logo/DELETE.FAILURE'
}

export const RESET_LOGO = 'teams/logo/RESET'

export const uploadLogo = {
  request: (file: File, notification: Notification) => ({
    type: UPLOAD_LOGO.REQUEST,
    payload: { file, notification }
  }),
  success: (logo: { previewPutUrl: string }) => (dispatch: Dispatch) => {
    dispatch({
      type: UPLOAD_LOGO.SUCCESS,
      payload: { logo }
    })

    dispatch(
      showFlash({
        message: 'Your team icon has been updated.',
        status: 'success'
      })
    )
  },
  failure: (message: string, notification: Notification) => {
    trackSettingsTeamIconFailed()
    return {
      type: UPLOAD_LOGO.FAILURE,
      payload: { message, notification }
    }
  }
}

export const deleteLogo = {
  request: (notification: Notification) => ({
    type: DELETE_LOGO.REQUEST,
    payload: { notification }
  }),
  success: () => (dispatch: Dispatch) => {
    dispatch({
      type: DELETE_LOGO.SUCCESS
    })

    dispatch(
      showFlash({
        message: 'Your team logo has been deleted.',
        status: 'success'
      })
    )
  },
  failure: (message: string, notification: Notification) => ({
    type: DELETE_LOGO.FAILURE,
    payload: { message, notification }
  })
}

export const resetLogoState = () => ({ type: RESET_LOGO })
