import styled from 'styled-components'

import { InlineBox } from '../Grid'

const StyledIcon = styled(InlineBox)`
  svg {
    width: ${({ width }) => width}px;
    height: ${({ height }) => height}px;
    cursor: pointer;
  }
  ${({ rotate }) => (rotate ? `transform: rotate(${rotate});` : null)}
`
StyledIcon.defaultProps = {
  color: 'inherit',
  height: 15,
  width: 15,
  verticalAlign: 'text-top',
  lineHeight: 0
}

export default StyledIcon

export { default as InfoIcon } from './Information'
export { default as LoadingIcon } from './Loading'
export { default as ExpandIcon } from './Expand'
export { default as CheckIcon } from './Check'
export { default as CrossIcon } from './Cross'
export { default as ChevronIcon } from './Chevron'
export { default as ChevronRightIcon } from './ChevronRight'
export { default as OpenIcon } from './Open'
export { default as HelpIcon } from './Help'
export { default as PlusIcon } from './Plus'
export { default as MinusIcon } from './Minus'
export { default as TrashIcon } from './Trash'
export { default as GuideIcon } from './Guide'
export { default as WarningIcon } from './Warning'
export { default as LaptopIcon } from './Laptop'
export { default as IpadIcon } from './Ipad'
export { default as IphoneIcon } from './Iphone'
export { default as ChromeIcon } from './Chrome'
export { default as SearchIcon } from './Search'
export { default as ArrowRightIcon } from './ArrowRight'
export { default as CheckRoundIcon } from './CheckRound'
export { default as DragIcon } from './Drag'
export { default as CrossRoundIcon } from './CrossRound'
export { default as MinusRoundIcon } from './MinusRound'
export { default as HelpRoundIcon } from './HelpRound'
export { default as ArrowUpIcon } from './ArrowUp'
export { default as ArrowDownIcon } from './ArrowDown'
export { default as CreditCardIcon } from './CreditCard'
export { default as PadlockIcon } from './Padlock'
export { default as DownloadIcon } from './Download'
export { default as LoadingRoundIcon } from './LoadingRound'
export { default as DesktopIcon } from './Desktop'
export { default as MobileIcon } from './Mobile'
export { default as CustomiseIcon } from './Customise'
export { default as InfoRoundIcon } from './InfoRound'
export { default as CalibreIcon } from './Calibre'
export { default as CalibreIconDark } from './CalibreDark'
export { default as SpadeIcon } from './Spade'
export { default as SwitcherIcon } from './Switcher'
export { default as ExportIcon } from './Export'
export { default as ReorderIcon } from './Reorder'
export { default as EditIcon } from './Edit'
export { default as DeleteIcon } from './Delete'
export { default as CopyIcon } from './Copy'
export { default as GeckoboardIcon } from './Geckoboard'
export { default as GoogleIcon } from './Google'
export { default as GitHubIcon } from './GitHub'
export { default as NetlifyIcon } from './Netlify'
export { default as ZapierIcon } from './Zapier'
export { default as WebhooksIcon } from './Webhooks'
export { default as SlackIcon } from './Slack'
export { default as ResendIcon } from './Resend'
