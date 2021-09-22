import flatten from 'lodash/flatten'
import { createSelector } from 'reselect'
import bffRequest from '../../utils/bffRequest'
import { selectLocationQuery } from '../location'
import { DocumentsList, TransferResponseBody } from './bulkTransfer.types'

export function transferDocsToUser(fromUserId: string, toUserId: string) {
  return bffRequest.patch(
    '/teams/api/bulk-transfer/transfer-documents-user',
    {
      fromUserId,
      toUserId
    },
    // increase timeout to account for longer transfers of larger assets
    { timeout: 30000 }
  )
}

// TODO: return just the counts instead of the actual results
export function transferCounts(responseBody: TransferResponseBody) {
  const failed = responseBody.documents.filter(d => d.transferStatus === 'Failed')
  const succeeded = responseBody.documents.filter(d => d.transferStatus === 'Succeeded')
  const all = responseBody.documents

  return {
    succeeded,
    failed,
    all
  }
}

type TransferDocumentsToTeamArgs = {
  toTeamId: string
  documents: DocumentsList
}

export function transferDocumentsToTeam({ toTeamId, documents }: TransferDocumentsToTeamArgs) {
  return bffRequest.post(
    `/teams/api/bulk-transfer/transfer-to-team/${toTeamId}`,
    {
      documents
    },
    // increase timeout to account for longer transfers of larger assets
    {
      timeout: 30000
    }
  )
}

export function documentListCount(documents: DocumentsList) {
  return flatten(Object.values(documents)).length
}

// Selectors

export const selectDecodedTransferDocData = createSelector(
  [selectLocationQuery('transferDocuments')],
  encodedDocumentIds => {
    try {
      const documentsDataString = window.atob(encodedDocumentIds)
      const decodedDocuments = JSON.parse(documentsDataString)

      /*
      Format the document ids for bulk transfer api

      prototype: ['3'] --> prorotype: [{ id: 3}]
    */
      const formattedDocuments: DocumentsList = Object.entries(decodedDocuments).reduce(
        (output, [docTypeName, ids]) => {
          return {
            ...output,
            [docTypeName]: (ids as string[]).map(id => ({ id }))
          }
        },
        {}
      )
      return formattedDocuments
    } catch (e) {
      return undefined
    }
  }
)
