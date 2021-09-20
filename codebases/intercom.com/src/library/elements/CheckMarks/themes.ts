import { IProps } from './index'
import { SizeOptions } from '../Text'

export interface ITheme {
  listTextSize: SizeOptions
}

type ThemePropsFactory = (component: IProps) => ITheme

const themeFactories: Record<string, ThemePropsFactory> = {
  default: getDefaultThemeProps,
  inbound: getInboundThemeProps,
}

export function getThemeProps(component: IProps): ITheme {
  let themeProps

  try {
    themeProps = component.theme && themeFactories[component.theme](component)
  } catch (error) {
    throw new Error(`Theme "${component.theme}" not defined for Checkmarks component`)
  }

  return themeProps || themeFactories.default(component)
}

function getDefaultThemeProps(component: IProps): ITheme {
  return { listTextSize: component.large ? 'lg' : 'caption' }
}

function getInboundThemeProps(): ITheme {
  return { listTextSize: 'md' }
}
