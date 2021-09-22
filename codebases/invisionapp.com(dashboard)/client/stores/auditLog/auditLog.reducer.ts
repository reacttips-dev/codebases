import { Reducer } from 'redux'
import { FETCH } from './auditLog.actions'
import { AuditLogState } from './auditLog.types'

const initialState: AuditLogState = {
  status: 'initial'
}

const auditLogReducer: Reducer<AuditLogState> = (state = initialState, action) => {
  switch (action.type) {
    case FETCH.REQUEST: {
      return {
        ...state,
        status: 'loading'
      }
    }
    case FETCH.SUCCESS_CSV: {
      return {
        ...state,
        csvData: action.payload.data,
        filename: action.payload.filename,
        status: 'loaded'
      }
    }
    case FETCH.SUCCESS_JSON: {
      return {
        ...state,
        jsonData: action.payload.data,
        status: 'loaded'
      }
    }
    case FETCH.FAILURE: {
      return {
        ...state,
        data: undefined,
        message: action.payload.message,
        status: 'error'
      }
    }
    case FETCH.CLEAR: {
      return {
        ...state,
        csvData: undefined,
        jsonData: undefined,
        message: undefined,
        status: 'initial'
      }
    }
    default: {
      return state
    }
  }
}

export default auditLogReducer
