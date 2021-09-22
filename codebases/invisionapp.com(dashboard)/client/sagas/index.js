import { all } from 'redux-saga/effects'
import request from './request'
import uploadLogo from './uploadLogo'
import updateUserProfile from './updateUserProfile'

export default function* root() {
  yield all([request(), uploadLogo(), updateUserProfile()])
}
