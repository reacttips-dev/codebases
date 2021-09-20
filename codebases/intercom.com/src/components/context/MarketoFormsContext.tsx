import { IMarketoField } from 'marketing-site/lib/marketo/client'
import { createContext, useContext } from 'react'

export interface IMarketoFormWithFields {
  id: number
  fields: IMarketoField[]
}

const MarketoFormsContext = createContext<IMarketoFormWithFields[]>([])

MarketoFormsContext.displayName = 'MarketoFormsContext'

export function useMarketoForms() {
  return useContext(MarketoFormsContext)
}

export default MarketoFormsContext
