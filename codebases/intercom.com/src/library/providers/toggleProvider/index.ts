import { AllSystemColors, Color } from '../../utils'
export { ToggleProvider, useModeToggle } from './toggleProvider'

export const modes = {
  customer: {
    background: '#FFFFFF',
    'font-family': 'Sans Serif',
    toggleUncheckColor: Color.LightBlue,
    toggleCheckColor: Color.Black,
  },
  teams: {
    background: '#F0F0F0',
    'font-family': 'Pacifico',
    toggleUncheckColor: Color.UIGray,
    toggleCheckColor: Color.Black,
  },
} as const

export const ModeOptions = {
  ...Object.fromEntries(Object.entries(modes).map(([key]) => [key, key])),
} as IAvailableModeOPtions

export interface IMode {
  background: string
  'font-family': string
  toggleUncheckColor: AllSystemColors
  toggleCheckColor: AllSystemColors
}

export type IModeOptions = keyof typeof modes

export type IAvailableModeOPtions = {
  [key in IModeOptions]: IModeOptions
}

export interface IContextProps {
  mode: IMode
  setMode: (mode: IModeOptions) => void
}

export interface IProps {
  initialMode?: IModeOptions
}
