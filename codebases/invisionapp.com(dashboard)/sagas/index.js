import { fork } from 'redux-saga/effects'
import account from './account'
import batch from './batch'
import create from './create'
import documents from './documents'
import mediaQueries from './mediaQueries'
import metadata from './metadata'
import project from './project'
import space from './space'
import spaces from './spaces'
import projects from './projects'
import subscription from './subscription'

export default function * root () {
  yield [
    fork(account),
    fork(batch),
    fork(create),
    fork(documents),
    fork(mediaQueries),
    fork(metadata),
    fork(project),
    fork(space),
    fork(spaces),
    fork(projects),
    fork(subscription)
  ]
}
