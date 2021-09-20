import { createContext, useContext } from 'react'

export interface IAssignedVariation {
  variationKey: string
  source: string
}
export interface IAssignedVariations {
  [experimentKey: string]: IAssignedVariation
}

const AssignedVariationsContext = createContext<IAssignedVariations>({})

export function useAssignedVariations() {
  return useContext(AssignedVariationsContext)
}

export default AssignedVariationsContext
