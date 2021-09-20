import { IProps } from './index'
import MagicLine4Image from 'marketing-site/src/images/magic-line-4.svg'
import MagicLine6Image from 'marketing-site/src/images/magic-line-6.svg'
import MagicLineSparkleLeftImage from 'marketing-site/src/images/magic-line-sparkle-left.svg'
import MagicLineSparkleRightImage from 'marketing-site/src/images/magic-line-sparkle-right.svg'

interface IMagicLineDefaultProps {
  minWidth: IProps['minWidth'] & string
  minHeight: IProps['minHeight'] & string
  topOverlappingSize: IProps['topOverlappingSize'] & string
  bottomOverlappingSize: IProps['bottomOverlappingSize'] & string
  mobileTopOverlappingSize: IProps['mobileTopOverlappingSize'] & string
  mobileBottomOverlappingSize: IProps['mobileBottomOverlappingSize'] & string
  position: IProps['position'] & string
  flipHorizontally: IProps['flipHorizontally'] & boolean
  containerHeight: IProps['containerHeight'] & number
  containerMobileHeight: IProps['containerMobileHeight'] & number
}

interface IInitializedProps extends IMagicLineDefaultProps {
  showInMobile: IProps['showInMobile'] & boolean
}

export interface IMagicLineTexture {
  image: string
  designViewport: number
  width: number
  height: number
  maxWidth: string
  maxHeight: string
  defaultProps: IMagicLineDefaultProps
}

const magicLine4: IMagicLineTexture = {
  image: MagicLine4Image,
  designViewport: 1440,
  width: 238,
  height: 238,
  maxWidth: '238px',
  maxHeight: '238px',
  defaultProps: {
    minWidth: '169px',
    minHeight: '169px',
    topOverlappingSize: '130px',
    bottomOverlappingSize: '0',
    mobileTopOverlappingSize: '130px',
    mobileBottomOverlappingSize: '0',
    position: 'right',
    flipHorizontally: false,
    containerHeight: 63,
    containerMobileHeight: 63,
  },
}

const magicLine6: IMagicLineTexture = {
  image: MagicLine6Image,
  designViewport: 1440,
  width: 87,
  height: 81,
  maxWidth: '87px',
  maxHeight: '81px',
  defaultProps: {
    minWidth: '22px',
    minHeight: '47px',
    topOverlappingSize: '55%',
    bottomOverlappingSize: '0',
    mobileTopOverlappingSize: '4%',
    mobileBottomOverlappingSize: '0',
    position: 'left',
    flipHorizontally: false,
    containerHeight: 0,
    containerMobileHeight: 0,
  },
}

const magicLineSparkleLeft: IMagicLineTexture = {
  image: MagicLineSparkleLeftImage,
  designViewport: 1440,
  width: 166,
  height: 345,
  maxWidth: '166px',
  maxHeight: '345px',
  defaultProps: {
    minWidth: '141px',
    minHeight: '293px',
    topOverlappingSize: '125%',
    bottomOverlappingSize: '0',
    mobileTopOverlappingSize: '125%',
    mobileBottomOverlappingSize: '0',
    position: 'left',
    flipHorizontally: false,
    containerHeight: 0,
    containerMobileHeight: 0,
  },
}

const magicLineSparkleRight: IMagicLineTexture = {
  image: MagicLineSparkleRightImage,
  designViewport: 1440,
  width: 192,
  height: 482,
  maxWidth: '192px',
  maxHeight: '482px',
  defaultProps: {
    minWidth: '192px',
    minHeight: '482px',
    topOverlappingSize: '558px',
    bottomOverlappingSize: '0',
    mobileTopOverlappingSize: '558px',
    mobileBottomOverlappingSize: '0',
    position: 'right',
    flipHorizontally: false,
    containerHeight: 0,
    containerMobileHeight: 0,
  },
}

const magicLineTextures: { [key: string]: IMagicLineTexture } = {
  'magicLine-4': magicLine4,
  'magicLine-6': magicLine6,
  'magicLine-sparkle-left': magicLineSparkleLeft,
  'magicLine-sparkle-right': magicLineSparkleRight,
}

interface IMatch {
  groups: { number?: string; units?: string }
}
const getValidOverlappingSize = (overlappingSize: IProps['topOverlappingSize']) => {
  if (!overlappingSize) {
    overlappingSize = ''
  }
  const validationRegex = /(?<number>-?\d+)(?<units>px|%|vw|vh)?.*?$/
  const defaultMatch: IMatch = { groups: { number: '0', units: 'px' } }
  const {
    groups: { number = defaultMatch.groups.number, units = defaultMatch.groups.units },
  } = (overlappingSize.match(validationRegex) as IMatch) || defaultMatch
  return `${number}${units}`
}

const formatProps = ({
  topOverlappingSize,
  bottomOverlappingSize,
  mobileTopOverlappingSize,
  mobileBottomOverlappingSize,
  ...props
}: IInitializedProps) => ({
  topOverlappingSize: getValidOverlappingSize(topOverlappingSize),
  bottomOverlappingSize: getValidOverlappingSize(bottomOverlappingSize),
  mobileTopOverlappingSize: getValidOverlappingSize(mobileTopOverlappingSize),
  mobileBottomOverlappingSize: getValidOverlappingSize(mobileBottomOverlappingSize),
  ...props,
})

export const getMagicLineTexture = (texture: IProps['texture']) =>
  magicLineTextures[`magicLine-${texture}`]

export const getMagicLineProps = (magicLineTexture: IMagicLineTexture, config: IProps) => {
  const magicProps = formatProps({
    showInMobile: false,
    ...magicLineTexture.defaultProps,
    ...config,
  })

  return magicProps
}
