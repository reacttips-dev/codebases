import { createSelector } from 'reselect'
import { AuditLogState } from '.'
import { AppState } from '..'
import { AuditLogCsvData } from './auditLog.types'

const auditLogState = (state: AppState) => state.auditLog

export const selectAuditLogJsonData = createSelector(
  auditLogState,
  (auditLogState: AuditLogState) => {
    const auditLogData = auditLogState?.jsonData
    if (auditLogData === undefined) {
      return null
    }

    return auditLogData
  }
)

export const selectAuditLogCsvData = createSelector(
  auditLogState,
  (auditLogState: AuditLogState): AuditLogCsvData | null => {
    if (!auditLogState.csvData) {
      return null
    }

    return {
      auditLogCsvData: auditLogState?.csvData,
      auditLogCsvFilename: auditLogState?.filename
    }
  }
)
