import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { SVGBox, SVGIcon } from './SVGComponents'
import { css, media, parent } from '../../styles/jss'
import * as s from '../../styles/jso'

// -------------------------------------
// Shapes for building icons

const FillShapeForty = props =>
  <path className={props.className} d="M0 0h40v40h-40z" />

FillShapeForty.propTypes = {
  className: PropTypes.string,
}

FillShapeForty.defaultProps = {
  className: 'svg-fill',
}

const FillShapeSixty = props =>
  <path className={props.className} d="M0 0h60v60h-60z" />

FillShapeSixty.propTypes = {
  className: PropTypes.string,
}

FillShapeSixty.defaultProps = {
  className: 'svg-fill',
}

const SmileShapeForty = () =>
  <path className="SmileShape" d="M20.5 32c-5.5 0-10.2-3.7-11.6-9-.2-.6.2-1.2.8-1.4.6-.2 1.2.2 1.4.8 1.1 4.3 5 7.3 9.4 7.3s8.3-3 9.4-7.3c.2-.6.8-1 1.4-.8.6.2 1 .8.8 1.4-1.3 5.3-6.1 9-11.6 9z" />

const BadgeShape = () =>
  (<g className="BadgeShape svg-fill-stroke svg-stroke-round">
    <polygon points="12,1 14.2,3.8 17.5,2.5 18,6 21.5,6.5 20.2,9.8 23,12 20.2,14.2 21.5,17.5 18,18 17.5,21.5 14.2,20.2 12,23 9.8,20.2 6.5,21.5 6,18 2.5,17.5 3.8,14.2 1,12 3.8,9.8 2.5,6.5 6,6 6.5,2.5 9.8,3.8" />
  </g>)

const CheckShape = () =>
  (<g className="CheckShape svg-stroke svg-stroke-bevel">
    <polyline points="8,11.9 11.3,16 16,8" />
  </g>)

// -------------------------------------
export const ElloLogoType = props => (
  <SVGBox className={classNames('ElloLogoType', props.className)} width="60" height="20">
    <g fill="#000">
      <polygon points="0.553093412 18.8839646 13.0829656 18.8839646 13.0829656 14.3044562 5.9500649 14.3044562 5.9500649 12.3233353 12.5311465 12.3233353 12.5311465 7.78481023 5.9500649 7.78481023 5.9500649 5.80368928 13.0829656 5.80368928 13.0829656 1.20372861 0.553093412 1.20372861" />
      <polygon points="20.452468 1.20374435 15.0555752 1.20374435 15.0555752 18.8839803 27.1969322 18.8839803 27.1969322 14.2226627 20.452468 14.2226627" />
      <polygon points="34.5711937 1.20374435 29.1742222 1.20374435 29.1742222 18.8839803 41.3156578 18.8839803 41.3156578 14.2226627 34.5711937 14.2226627" />
      <path d="M53.7152802,10.0949774 C53.7152802,11.6944267 53.4339036,12.9529518 52.9015143,13.7347021 C52.453058,14.3931091 51.8235988,14.7131878 50.9773451,14.7131878 C50.0901082,14.7131878 49.473707,14.409471 49.0377581,13.7572783 C48.5215733,12.9851249 48.2597837,11.7529518 48.2597837,10.0949774 C48.2597837,8.46563618 48.5386431,7.19059194 49.066234,6.40766175 C49.5130383,5.74461357 50.1203147,5.43578368 50.9773451,5.43578368 C51.7548476,5.43578368 52.3836775,5.77238151 52.8464503,6.43629499 C53.4148673,7.25171288 53.7152802,8.51684562 53.7152802,10.0949774 M57.13294,3.3985762 C55.6650147,1.81564602 53.5364798,0.978910521 50.9773451,0.978910521 C45.8741003,0.978910521 42.5766372,4.55719961 42.5766372,10.0949774 C42.5766372,12.9353314 43.3177188,15.1842203 44.7792724,16.7791858 C46.2371288,18.370061 48.3803736,19.2108869 50.9773451,19.2108869 C53.4908555,19.2108869 55.6056244,18.3669145 57.0931367,16.7699823 C58.5879646,15.1652625 59.3780531,12.8570619 59.3780531,10.0949774 C59.3780531,7.29788791 58.6017306,4.98229302 57.13294,3.3985762" id="Fill-9" />
    </g>
  </SVGBox>
)

ElloLogoType.propTypes = {
  className: PropTypes.string,
}

export const ElloPrideLogoType = props => (
  <SVGBox className={classNames('ElloLogoType', props.className)} width="60" height="20">
    <linearGradient id="grad" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0%" stopColor="red" />
      <stop offset="16.66%" stopColor="red" />
      <stop offset="16.66%" stopColor="orange" />
      <stop offset="33.33%" stopColor="orange" />
      <stop offset="33.33%" stopColor="yellow" />
      <stop offset="50%" stopColor="yellow" />
      <stop offset="50%" stopColor="green" />
      <stop offset="66.66%" stopColor="green" />
      <stop offset="66.66%" stopColor="blue" />
      <stop offset="83.33%" stopColor="blue" />
      <stop offset="83.33%" stopColor="purple" />
      <stop offset="100%" stopColor="purple" />
    </linearGradient>
    <g>
      <path
        fill="url(#grad)"
        d="
          M0.553093412,18.8839646
          L13.0829656,18.8839646
          L13.0829656,14.3044562
          L5.9500649,14.3044562
          L5.9500649,12.3233353
          L12.5311465,12.3233353
          L12.5311465,7.78481023
          L5.9500649,7.78481023
          L5.9500649,5.80368928
          L13.0829656,5.80368928
          L13.0829656,1.20372861
          L0.553093412,1.20372861
          Z

          M20.452468,1.20374435
          L15.0555752,1.20374435
          L15.0555752,18.8839803
          L27.1969322,18.8839803
          L27.1969322,14.2226627
          L20.452468,14.2226627
          Z

          M34.5711937,1.20374435
          L29.1742222,1.20374435
          L29.1742222,18.8839803
          L41.3156578,18.8839803
          L41.3156578,14.2226627
          L34.5711937,14.2226627
          Z

          M53.7152802,10.0949774
          C53.7152802,11.6944267 53.4339036,12.9529518 52.9015143,13.7347021
          C52.453058,14.3931091 51.8235988,14.7131878 50.9773451,14.7131878
          C50.0901082,14.7131878 49.473707,14.409471 49.0377581,13.7572783
          C48.5215733,12.9851249 48.2597837,11.7529518 48.2597837,10.0949774
          C48.2597837,8.46563618 48.5386431,7.19059194 49.066234,6.40766175
          C49.5130383,5.74461357 50.1203147,5.43578368 50.9773451,5.43578368
          C51.7548476,5.43578368 52.3836775,5.77238151 52.8464503,6.43629499
          C53.4148673,7.25171288 53.7152802,8.51684562 53.7152802,10.0949774
          M57.13294,3.3985762
          C55.6650147,1.81564602 53.5364798,0.978910521 50.9773451,0.978910521
          C45.8741003,0.978910521 42.5766372,4.55719961 42.5766372,10.0949774
          C42.5766372,12.9353314 43.3177188,15.1842203 44.7792724,16.7791858
          C46.2371288,18.370061 48.3803736,19.2108869 50.9773451,19.2108869
          C53.4908555,19.2108869 55.6056244,18.3669145 57.0931367,16.7699823
          C58.5879646,15.1652625 59.3780531,12.8570619 59.3780531,10.0949774
          C59.3780531,7.29788791 58.6017306,4.98229302 57.13294,3.3985762"
      />
    </g>
  </SVGBox>
)

ElloPrideLogoType.propTypes = {
  className: PropTypes.string,
}

// Ello icons 40 x 40
export const ElloMark = props =>
  (<SVGBox className={classNames('ElloMark', props.className)}>
    <FillShapeForty className="SVGBoxBG" />
    <SmileShapeForty />
  </SVGBox>)

ElloMark.propTypes = {
  className: PropTypes.string,
}

export const ElloBoxMark = () =>
  (<SVGBox className="ElloBoxMark">
    <FillShapeForty className="SVGBoxBG" />
    <SmileShapeForty />
  </SVGBox>)

export const ElloRainbowMark = () =>
  (<SVGBox className="ElloRainbowMark">
    <rect fill="#e31e26" y="0" width="40" height="7" />
    <rect fill="#f78c1f" y="7" width="40" height="7" />
    <rect fill="#fdec0a" y="14" width="40" height="7" />
    <rect fill="#0c8140" y="21" width="40" height="7" />
    <rect fill="#3f5fac" y="28" width="40" height="7" />
    <rect fill="#732a83" y="35" width="40" height="7" />
    <SmileShapeForty />
  </SVGBox>)

export const ElloDonutMark = () =>
  (<SVGBox className="ElloDonutMark">
    <rect fill="#fcc688" width="40" height="40" />
    <rect fill="#ffffff" x="11" y="11" width="16" height="16" />
    <path fill="#ef628a" d="M38.2,19.7c0-1.8-1.1-3.4-2.7-4.1c1.2-1.4,1.5-3.4,0.5-5.1c-0.9-1.6-2.7-2.4-4.4-2.2c0.4-1.8-0.4-3.7-2.1-4.7 C27.9,2.8,25.9,3,24.5,4c-0.6-1.7-2.2-3-4.2-3c-1.8,0-3.4,1.1-4,2.7c-1.4-1.2-3.4-1.4-5-0.5C9.7,4.2,8.9,5.9,9.1,7.7 C7.3,7.3,5.4,8.1,4.4,9.7c-0.9,1.6-0.8,3.5,0.3,4.9c-1.7,0.6-3,2.2-3,4.2c0,1.9,1.1,3.4,2.7,4.1C3.3,24.3,3,26.3,4,28 c0.9,1.6,2.7,2.4,4.4,2.2C8,32,8.8,33.9,10.5,34.9c1.6,0.9,3.5,0.7,4.9-0.3c0.6,1.7,2.2,3,4.2,3c1.9,0,3.4-1.1,4.1-2.7 c1.4,1.2,3.4,1.5,5.1,0.5c1.6-0.9,2.4-2.7,2.2-4.4c1.8,0.4,3.7-0.4,4.7-2.1c0.9-1.6,0.7-3.5-0.3-4.9C37,23.3,38.2,21.7,38.2,19.7z M20,26.3c-3.9,0-7-3.1-7-7s3.1-7,7-7s7,3.1,7,7S23.9,26.3,20,26.3z" />
    <path fill="#fb9a4a" d="M20,14.1c3.6,0,6.5,2.7,6.9,6.1c0-0.3,0.1-0.6,0.1-0.9c0-3.9-3.1-7-7-7c-3.9,0-7,3.1-7,7c0,0.3,0,0.6,0.1,0.9 C13.5,16.8,16.4,14.1,20,14.1z" />
    <SmileShapeForty />
  </SVGBox>)

export const ElloOutlineMark = () =>
  (<SVGBox className="ElloOutlineMark">
    <FillShapeForty className="svg-fill-transparent" />
    <SmileShapeForty />
  </SVGBox>)

// Modifier overlays on top of any logo marks
export const ElloNinjaSuit = () =>
  (<svg className="ElloNinjaSuit" height="40" width="48">
    <path d="M5.6,6.2C3.8,8,2.4,10.2,1.4,12.7h44.2l-3.1-3.2l3.1-3.2H5.6z" />
  </svg>)

export const ElloQuickEmoji = () =>
  (<SVGIcon className="ElloQuickEmoji">
    <g fill="none">
      <circle cx="9" cy="9" r="6" />
      <path d="M12.5 9c0 1.9-1.6 3.5-3.5 3.5s-3.5-1.6-3.5-3.5" />
    </g>
  </SVGIcon>)

// -------------------------------------
// Badge icons 24 x 24

export const BadgeCheckIcon = () =>
  (<SVGBox className="BadgeCheckIcon" size="24">
    <BadgeShape />
    <CheckShape />
  </SVGBox>)

export const BadgeFeaturedIcon = ({ color }) =>
  (<SVGBox className="BadgeFeaturedIcon">
    <g>
      <g>
        <path fill={color} d="M12,24L12,24c-0.162,0-0.314-0.074-0.413-0.202L9.545,21.16l-3.087,1.263 C6.309,22.483,6.14,22.473,6,22.391c-0.14-0.081-0.234-0.221-0.256-0.381l-0.45-3.305L1.99,18.253 c-0.16-0.021-0.301-0.116-0.382-0.256c-0.081-0.14-0.092-0.309-0.031-0.459l1.262-3.088l-2.637-2.044 C0.074,12.309,0,12.156,0,11.995s0.075-0.314,0.202-0.413l2.637-2.043L1.577,6.45C1.516,6.301,1.528,6.132,1.608,5.992 C1.689,5.852,1.83,5.757,1.99,5.735l3.304-0.451l0.45-3.305C5.766,1.82,5.86,1.679,6,1.598c0.14-0.08,0.309-0.092,0.458-0.031 l3.087,1.263l2.042-2.638c0.198-0.255,0.628-0.256,0.825,0l2.043,2.638l3.087-1.263C17.693,1.506,17.86,1.518,18,1.598 c0.14,0.081,0.234,0.222,0.256,0.382l0.451,3.305l3.304,0.451c0.16,0.022,0.301,0.117,0.381,0.256 c0.082,0.14,0.093,0.309,0.032,0.459l-1.263,3.088l2.637,2.043C23.926,11.681,24,11.833,24,11.995s-0.074,0.314-0.202,0.412 l-2.637,2.044l1.263,3.088c0.061,0.15,0.05,0.319-0.032,0.459c-0.081,0.14-0.221,0.234-0.381,0.256l-3.304,0.452l-0.451,3.305 c-0.021,0.16-0.116,0.301-0.256,0.381c-0.14,0.082-0.308,0.092-0.459,0.032l-3.087-1.263l-2.043,2.638 C12.314,23.926,12.162,24,12,24z" />
      </g>
      <g>
        <polygon fill="#FFFFFF" points="10.735,16.576 7.316,12.274 8.337,11.462 11.166,15.021 15.612,7.486 16.735,8.15 11.807,16.502" />
      </g>
    </g>
  </SVGBox>)

BadgeFeaturedIcon.propTypes = {
  color: PropTypes.string,
}

BadgeFeaturedIcon.defaultProps = {
  color: '#00D101',
}

export const CurateIcon = ({ color }) =>
  (<SVGBox className="CurateIcon">
    <path fill={color} d="M13.476,7.152l4.16,1.387c0.279,0.093,0.429,0.394,0.336,0.673 c-0.053,0.159-0.178,0.283-0.336,0.336l-4.134,1.378l1.949,3.898c0.131,0.263,0.025,0.582-0.238,0.714 c-0.15,0.075-0.326,0.075-0.476,0l-3.922-1.961l-1.353,4.06c-0.093,0.279-0.394,0.429-0.673,0.336 c-0.159-0.053-0.283-0.178-0.336-0.336l-1.353-4.06l-3.922,1.961c-0.263,0.131-0.582,0.025-0.714-0.238 c-0.075-0.15-0.075-0.326,0-0.476l1.961-3.922l-4.06-1.353C0.085,9.455-0.065,9.154,0.027,8.875C0.08,8.716,0.205,8.591,0.364,8.538 L4.45,7.176L2.524,3.324C2.392,3.061,2.499,2.741,2.762,2.61c0.15-0.075,0.326-0.075,0.476,0l3.828,1.914l1.387-4.16 c0.093-0.279,0.394-0.429,0.673-0.336C9.284,0.08,9.409,0.205,9.462,0.364l1.387,4.16l3.828-1.914 c0.263-0.131,0.582-0.025,0.714,0.238c0.075,0.15,0.075,0.326,0,0.476L13.476,7.152z" />
  </SVGBox>)

CurateIcon.propTypes = {
  color: PropTypes.string,
}

CurateIcon.defaultProps = {
  color: '#00D101',
}

// -------------------------------------
// SVG icons 20 x 20

const arrowStrokeAnimationStyle = css(
  { fill: '#fff' },
  { animation: `animateUploaderMover 0.666s infinite ${s.easeInOutCubic}` },
)

export const ArrowIcon = props =>
  (<SVGIcon className="ArrowIcon">
    <g>
      <line x1="14.5" x2="4.5" y1="10" y2="10" />
    </g>
    {props.isAnimated &&
      <rect className={arrowStrokeAnimationStyle} height="4" width="4" x="0" y="8" />
    }
    <g>
      <polyline points="10,5.5 14.5,10 10,14.5" />
    </g>
  </SVGIcon>)

ArrowIcon.propTypes = {
  isAnimated: PropTypes.bool,
}

export const BoltIcon = () =>
  (<SVGIcon className="BoltIcon">
    <g className="svg-stroke-bevel">
      <polygon points="14,7.4 9,7.4 9,1 4,11.6 9,11.6 9,18" />
    </g>
  </SVGIcon>)

export const BrowseIcon = () => (
  <SVGIcon className="BrowseIcon">
    <g transform="translate(1, 1)">
      <rect x="0" y="0" width="18" height="18" rx="2" />
      <polyline points="2.9 18 11.6 7.2 18 13.7" />
      <circle cx="5.4" cy="5.4" r="1.8" />
    </g>
  </SVGIcon>
)

export const BubbleIcon = () =>
  (<SVGIcon className="BubbleIcon">
    <g className="svg-stroke-round">
      <path d="M6.6,12.6l-3.1,3.1 l0-10.3c0-0.7,0.5-1.2,1.2-1.2h10.6c0.7,0,1.2,0.5,1.2,1.2v6c0,0.7-0.5,1.2-1.2,1.2H6.6z" />
    </g>
    <g className="svg-stroke-round">
      <path d="M3.5,11.4v-6c0-0.7,0.5-1.2,1.2-1.2 h10.6c0.7,0,1.2,0.5,1.2,1.2v6c0,0.7-0.5,1.2-1.2,1.2H4.7C4,12.6,3.5,12.1,3.5,11.4z" />
      <polygon points=" 6.6,12.6 3.5,15.8 3.5,11.6 " />
    </g>
  </SVGIcon>)

export const CheckCircleIcon = () =>
  (<SVGIcon className="CheckCircleIcon">
    <g>
      <circle cx="10.5" cy="10.5" r="7" />
    </g>
    <g className="svg-stroke-bevel">
      <polyline points="7.5,10 10,13 13.5,7" />
    </g>
  </SVGIcon>)

export const CheckIcon = () =>
  (<SVGIcon className="CheckIcon">
    <CheckShape />
  </SVGIcon>)

export const CheckIconLG = () =>
  (<SVGIcon className="CheckIconLG CheckMark">
    <g className="svg-stroke-bevel">
      <polyline points="4.8,10.8 9.9,17 17.2,5" />
    </g>
  </SVGIcon>)

export const CheckIconSM = () =>
  (<SVGIcon className="CheckIconSM">
    <g className="svg-stroke-bevel">
      <polyline points="7,10.4 9.5,13.5 13,7.5" />
    </g>
  </SVGIcon>)

export const ChevronCircleIcon = () =>
  (<SVGIcon className="ChevronCircleIcon">
    <g>
      <circle cx="10" cy="10" r="7" />
    </g>
    <g>
      <polyline points="8.2,6.5 11.8,10 8.2,13.5" />
    </g>
  </SVGIcon>)

const chevronStyle = css(
  parent('.TreeButton', s.absolute, { top: 10, left: 0 }, s.rotate90, s.transitionTransform),
  parent('.TreeButton.isCollapsed', s.transformNone),
  media(s.minBreak2, parent('.TreeButton', { top: 8, left: -30 })),
)
export const ChevronIcon = () =>
  (<SVGIcon className={`ChevronIcon ${chevronStyle}`}>
    <g>
      <polyline points="6,16 12,10 6,4" />
    </g>
  </SVGIcon>)

export const BackIcon = () =>
  (<SVGIcon className={`ChevronIcon ${chevronStyle}`}>
    <g>
      <polyline points="12,16 6,10 12,4" />
    </g>
  </SVGIcon>)

export const CircleIcon = () =>
  (<SVGIcon className="CircleIcon">
    <g>
      <circle cx="11" cy="11" r="5" />
    </g>
  </SVGIcon>)

export const CircleIconLG = () =>
  (<SVGIcon className="CircleIconLG">
    <g>
      <circle cx="12" cy="12" r="6" />
    </g>
  </SVGIcon>)

export const CircleAddRemove = () =>
  (<SVGIcon className="CircleAddRemove">
    <g>
      <circle cx="10" cy="10" r="9" />
      <line x1="15.318" y1="10.223" x2="4.682" y2="10.223" />
      <line x1="10" y1="15.541" x2="10" y2="4.904" />
    </g>
  </SVGIcon>)

export const DotsIcon = () =>
  (<SVGIcon className="DotsIcon">
    <g>
      <circle cx="3" cy="10" r="2.5" />
    </g>
    <g>
      <circle cx="10" cy="10" r="2.5" />
    </g>
    <g>
      <circle cx="17" cy="10" r="2.5" />
    </g>
  </SVGIcon>)

export const DragIcon = () =>
  (<SVGIcon className="DragIcon">
    <g>
      <line x1="15" x2="5" y1="10" y2="10" />
    </g>
    <g>
      <polyline points="7.4,13 5,10 7.4,7" />
      <polyline points="12.6,7 15,10 12.6,13" />
    </g>
  </SVGIcon>)

export const EyeIcon = () =>
  (<SVGIcon className="EyeIcon">
    <g>
      <path d="M19,9.9c0,0-4,4.9-9,4.9S1,9.9,1,9.9S5,5,10,5 S19,9.9,19,9.9z" />
      <circle cx="10" cy="10" r="5" />
    </g>
    <circle cx="10" cy="10" r="2" />
  </SVGIcon>)

export const FlagIcon = () =>
  (<SVGIcon className="FlagIcon">
    <g className="svg-stroke-round">
      <line x1="5" y1="3.7" x2="5" y2="16.8" />
    </g>
    <g className="svg-stroke-round">
      <path d="M15,10.2 c0,0-2.9,1.1-5,0s-5,0-5,0V3.7c0,0,2.9-1.1,5,0s5,0,5,0V10.2z" />
    </g>
  </SVGIcon>)

export const GridIcon = () =>
  (<SVGIcon className="GridIcon">
    <g>
      <circle cx="6.2" cy="6.2" r="2.5" />
      <circle cx="13.8" cy="6.2" r="2.5" />
      <circle cx="6.2" cy="13.8" r="2.5" />
      <circle cx="13.8" cy="13.8" r="2.5" />
    </g>
  </SVGIcon>)

export const HeartIcon = () =>
  (<SVGIcon className="HeartIcon">
    <g>
      <path d="M10,7.4c0-1.8,1.5-3.2,3.3-3.2s3.3,1.4,3.3,3.2c0,4.5-6.5,8.4-6.5,8.4S3.5,12,3.5,7.4c0-1.8,1.5-3.2,3.3-3.2S10,5.6,10,7.4z" />
    </g>
  </SVGIcon>)

export const LockIcon = () =>
  (<SVGIcon className="LockIcon">
    <g>
      <rect x="6.5" y="8.8" width="7" height="6.6" />
    </g>
    <g>
      <path d="M12,8.8V7c0-1.1-0.9-2-2-2S8,5.9,8,7v1.8" />
    </g>
  </SVGIcon>)

export const LinkIcon = () =>
  (<SVGIcon className="LinkIcon">
    <g>
      <path d="M9.4,10.6l-0.5-0.5c-0.6-0.6-0.6-1.5,0-2.1 L11,5.9c0.6-0.6,1.5-0.6,2.1,0l1,1c0.6,0.6,0.6,1.5,0,2.1L13,10.1" />
      <path d="M10.6,9.4l0.5,0.5c0.6,0.6,0.6,1.5,0,2.1L9,14.1 c-0.6,0.6-1.5,0.6-2.1,0l-1-1c-0.6-0.6-0.6-1.5,0-2.1L7,9.9" />
    </g>
  </SVGIcon>)

export const ListIcon = () =>
  (<SVGIcon className="ListIcon">
    <g>
      <path d="M6.2,8.8c-1.4,0-2.5-1.1-2.5-2.5s1.1-2.5,2.5-2.5h7.5c1.4,0,2.5,1.1,2.5,2.5s-1.1,2.5-2.5,2.5H6.2z" />
      <path d="M6.2,16.2c-1.4,0-2.5-1.1-2.5-2.5s1.1-2.5,2.5-2.5h7.5c1.4,0,2.5,1.1,2.5,2.5s-1.1,2.5-2.5,2.5H6.2z" />
    </g>
  </SVGIcon>)

export const MarkerIcon = () =>
  (<SVGIcon className="MarkerIcon">
    <path className="svg-fill" d="M10,2C6.7,2,4,4.7,4,8c0,3.7,4.3,9.4,5.6,11.1c0.2,0.3,0.6,0.3,0.8,0C11.7,17.4,16,11.8,16,8 C16,4.7,13.3,2,10,2z M10,9.9C9,9.9,8.1,9,8.1,8C8.1,7,9,6.1,10,6.1S11.9,7,11.9,8C11.9,9,11,9.9,10,9.9z" />
  </SVGIcon>)

export const MoneyIconCircle = () => (
  <SVGIcon className="MoneyIconCircle">
    <g transform="translate(1, 1)">
      <path d="M9.46476375,12.4701474 C10.6538445,12.3364755 11.1027425,11.7179939 11.1027425,10.8807161 C11.1027425,10.1039564 10.6418739,9.55796352 9.53725246,9.35180298 L9.39227505,9.32786176 L9.39227505,12.4701474 L9.46476375,12.4701474 Z M8.59090909,5.11686653 C7.61995946,5.25053836 7.0866022,5.88165562 7.0866022,6.62183845 C7.0866022,7.54424059 7.65653633,7.98116793 8.50644977,8.12614534 L8.59090909,8.13811595 L8.59090909,5.11686653 Z M8.59090909,14.7272727 L8.59090909,13.4045201 C6.73479922,13.2828189 5.86094456,12.2147743 5.72727273,10.7470443 L6.80728793,10.7470443 C6.94095976,11.5843221 7.41446396,12.3484461 8.59090909,12.482118 L8.59090909,9.16958367 L8.37277794,9.13367183 C6.87977663,8.85435756 6.04316387,8.0902335 6.04316387,6.62183845 C6.04316387,5.35960394 7.0866022,4.38931934 8.59090909,4.2436769 L8.59090909,3.27272727 L9.39227505,3.27272727 L9.39227505,4.2436769 C11.0302538,4.38931934 11.9519909,5.35960394 12.0251446,6.76748089 L10.9571,6.76748089 C10.8600051,5.97875058 10.4357134,5.27514462 9.39227505,5.11686653 L9.39227505,8.28442343 L9.74407803,8.34494152 C11.5396698,8.66016763 12.1947283,9.50941604 12.1947283,10.7836212 C12.1947283,12.3125343 11.2244437,13.2708483 9.39227505,13.4045201 L9.39227505,14.7272727 L8.59090909,14.7272727 Z" />
      <circle strokeWidth="1.25" cx="9" cy="9" r="9" />
    </g>
  </SVGIcon>
)
export const MoneyIcon = () => (
  <SVGIcon className="MoneyIcon">
    <g>
      <path d="M9.6,16.6v-1.5c-2.1-0.1-3.2-1.4-3.3-3.1h1.2 c0.2,1,0.7,1.8,2.1,2v-3.8l-0.3,0C7.6,9.8,6.6,8.9,6.6,7.3c0-1.5,1.2-2.6,2.9-2.7V3.4h0.9v1.1c1.9,0.2,3,1.3,3,2.9h-1.2 c-0.1-0.9-0.6-1.7-1.8-1.9v3.7l0.4,0.1c2.1,0.4,2.8,1.3,2.8,2.8c0,1.8-1.1,2.9-3.2,3v1.5H9.6z M9.6,5.5C8.5,5.7,7.8,6.4,7.8,7.3 c0,1.1,0.7,1.6,1.6,1.7l0.1,0V5.5z M10.6,14c1.4-0.2,1.9-0.9,1.9-1.8c0-0.9-0.5-1.5-1.8-1.8l-0.2,0L10.6,14L10.6,14z" />
    </g>
  </SVGIcon>
)

export const PencilIcon = () =>
  (<SVGIcon className="PencilIcon">
    <g>
      <polygon points="12.6,4 16,7.3 7.4,15.9 4,15.9 4,12.5" />
    </g>
    <g>
      <line x1="10.2" y1="6.4" x2="13.6" y2="9.7" />
    </g>
  </SVGIcon>)

export const PlusCircleIcon = () =>
  (<SVGIcon className="PlusCircleIcon">
    <g>
      <circle cx="10.5" cy="10.5" r="7" />
    </g>
    <g>
      <line x1="10.5" x2="10.5" y1="7.5" y2="13.5" />
      <line x1="13.5" x2="7.5" y1="10.5" y2="10.5" />
    </g>
  </SVGIcon>)

export const PlusIconSM = () =>
  (<SVGIcon className="PlusIconSM">
    <g>
      <line x1="10.5" x2="10.5" y1="6.5" y2="12.5" />
      <line x1="13.5" x2="7.5" y1="9.5" y2="9.5" />
    </g>
  </SVGIcon>)

export const RelationshipIcon = () =>
  (<SVGIcon className="RelationshipIcon">
    <g>
      <circle cx="7.5" cy="4.8" r="1.8" />
      <path d="M7.5 8.6c-1.9 0-3.5 1.6-3.5 3.5v2.9h7v-2.9M12.7 6.1v5M15.2 8.6h-5" />
    </g>
  </SVGIcon>)

export const ReplyIcon = () =>
  (<SVGIcon className="ReplyIcon">
    <g>
      <path d="M17,14.2c0-2.3-1.9-4.2-4.2-4.2H3" />
    </g>
    <g>
      <polyline points="7,14 3,10 7,6 " />
    </g>
  </SVGIcon>)

export const ReplyAllIcon = () =>
  (<SVGIcon className="ReplyAllIcon">
    <g>
      <path d="M17.3,14.2c0-2.3-1.9-4.2-4.2-4.2H7.2" />
    </g>
    <g>
      <polyline points="11.2,14 7.2,10 11.2,6" />
    </g>
    <g>
      <polyline points="7,14 3,10 7,6" />
    </g>
  </SVGIcon>)

export const RepostIcon = () =>
  (<SVGIcon className="RepostIcon">
    <g className="svg-stroke-round">
      <path d="M15.2,6.7H5 c-0.5,0-1,0.4-1,1V10" />
      <path d="M4.8,14.4H15 c0.6,0,1-0.4,1-1v-2.3" />
    </g>
    <g className="svg-stroke-round">
      <polyline points="13.3,4 16,6.7 13.2,9.5" />
      <polyline points="6.7,17.1 4,14.4 6.8,11.7" />
    </g>
  </SVGIcon>)

export const RolesIcon = () =>
  (<SVGIcon className="RolesIcon">
    <g>
      <path d="M15.126,20h-1.21v-3.625c0-1.487-1.195-2.697-2.665-2.697H3.874c-1.469,0-2.664,1.21-2.664,2.697V20H0v-3.625 c0-2.163,1.738-3.922,3.874-3.922h7.378c2.137,0,3.874,1.759,3.874,3.922V20z" />
      <path d="M7.78,9.2c-2.611,0-4.736-2.064-4.736-4.6C3.044,2.064,5.169,0,7.78,0s4.736,2.064,4.736,4.6 C12.516,7.137,10.392,9.2,7.78,9.2z M7.78,1.224c-1.945,0-3.527,1.514-3.527,3.376S5.836,7.976,7.78,7.976s3.527-1.515,3.527-3.376 S9.725,1.224,7.78,1.224z" />
      <path d="M20,19.992h-1.21v-3.618c0-1.487-1.195-2.697-2.665-2.697h-0.55v-1.224h0.55c2.137,0,3.874,1.759,3.874,3.922V19.992z" />
      <path d="M13.184,9.2V7.976c1.945,0,3.527-1.515,3.527-3.376s-1.582-3.376-3.527-3.376V0c2.612,0,4.736,2.064,4.736,4.6 C17.92,7.137,15.796,9.2,13.184,9.2z" />
    </g>
  </SVGIcon>)

export const SearchIcon = () =>
  (<SVGIcon className="SearchIcon">
    <g className="svg-stroke-round">
      <circle cx="8.5" cy="8.5" r="5.5" />
    </g>
    <g className="svg-stroke-round">
      <path d="M12.5 12.5l4.5 4.5" />
    </g>
  </SVGIcon>)

export const ShareIcon = () =>
  (<SVGIcon className="ShareIcon">
    <g>
      <polyline points="7.8,7.3 5,7.3 5,17.3 15,17.3 15,7.3 12.2,7.3" />
    </g>
    <g>
      <line x1="10" y1="2" x2="10" y2="12" />
      <polyline className="svg-stroke-round" points="7.2,4.7 10,2 12.8,4.8" />
    </g>
  </SVGIcon>)

export const SparklesIcon = () =>
  (<SVGIcon className="SparklesIcon">
    <g>
      <path d="M10,7c-2.8,0-5,2.2-5,5c0-2.8-2.2-5-5-5c2.8,0,5-2.2,5-5 C5,4.8,7.2,7,10,7z" />
    </g>
    <g>
      <path d="M15,14.5c-1.9,0-3.5,1.6-3.5,3.5c0-1.9-1.6-3.5-3.5-3.5 c1.9,0,3.5-1.6,3.5-3.5C11.5,12.9,13.1,14.5,15,14.5z" />
    </g>
    <g>
      <path d="M19,4.5c-1.9,0-3.5,1.6-3.5,3.5c0-1.9-1.6-3.5-3.5-3.5 c1.9,0,3.5-1.6,3.5-3.5C15.5,2.9,17.1,4.5,19,4.5z" />
    </g>
  </SVGIcon>)

export const XBoxIcon = () =>
  (<SVGIcon className="XBoxIcon">
    <g>
      <rect x="3.5" y="3.5" width="12" height="12" />
    </g>
    <g>
      <line x1="12" y1="7" x2="7" y2="12" />
      <line x1="12" y1="12" x2="7" y2="7" />
    </g>
  </SVGIcon>)

export const XIcon = () =>
  (<SVGIcon className="XIcon">
    <g>
      <line x1="6" x2="14" y1="6" y2="14" />
      <line x1="14" x2="6" y1="6" y2="14" />
    </g>
  </SVGIcon>)

export const XIconLG = () =>
  (<SVGIcon className="XIconLG">
    <g>
      <line x1="17" y1="5" x2="5" y2="17" />
      <line x1="17" y1="17" x2="5" y2="5" />
    </g>
  </SVGIcon>)


export const StarIcon = () => (
  <SVGIcon className="StarIcon">
    <g transform="translate(1.000000, -1.000000)">
      <g transform="translate(0.000000, 3.000000)">
        <polygon points="6.309 8.95 10.208 11 9.463 6.658 12.618 3.583 8.259 2.95 6.309 -1 4.359 2.95 0 3.583 3.155 6.658 2.41 11" />
      </g>
    </g>
  </SVGIcon>
)

// -------------------------------------
// Misc icons

export const LightBoxTrigger = () => (
  <SVGBox className="LightBoxTrigger" width="18px" height="18px">
    <g>
      <polygon points="2.231,6.538 1,6.538 1,1 6.538,1 6.538,2.231 2.231,2.231" />
    </g>
    <g>
      <polygon points="17,6.538 15.769,6.538 15.769,2.231 11.462,2.231 11.462,1 17,1" />
    </g>
    <g>
      <polygon points="6.538,17 1,17 1,11.462 2.231,11.462 2.231,15.769 6.538,15.769" />
    </g>
    <g>
      <polygon points="17,17 11.462,17 11.462,15.769 15.769,15.769 15.769,11.462 17,11.462" />
    </g>
  </SVGBox>
)

export const LightBoxTriggerSmall = () => (
  <SVGBox className="LightBoxTriggerSmall" width="12px" height="12px">
    <g>
      <polygon points="1.25,4.625 0,4.625 0,0 4.625,0 4.625,1.25 1.25,1.25" />
    </g>
    <g>
      <polygon points="12,4.625 10.75,4.625 10.75,1.25 7.375,1.25 7.375,0 12,0" />
    </g>
    <g>
      <polygon points="4.625,12 0,12 0,7.375 1.25,7.375 1.25,10.75 4.625,10.75" />
    </g>
    <g>
      <polygon points="12,12 7.375,12 7.375,10.75 10.75,10.75 10.75,7.375 12,7.375" />
    </g>
  </SVGBox>
)

export const LightBoxArrow = () => (
  <SVGBox className="LightBoxArrow" width="14px" height="13px">
    <g>
      <path d="M1,7.111V5.889l9.771-0.001L7.108,2.043c-0.227-0.239-0.227-0.625,0-0.864s0.596-0.239,0.824,0L13,6.5l-5.068,5.322 C7.818,11.941,7.669,12,7.52,12s-0.298-0.059-0.412-0.179c-0.227-0.239-0.227-0.626,0-0.865l3.664-3.846L1,7.111z" />
    </g>
  </SVGBox>
)

// -------------------------------------
// RSS icon
export const RSSIcon = () => (
  <SVGBox className="RSSIcon" size="22">
    <g>
      <rect fill="#aaa" x="0" y="0" width="22" height="22" rx="5" />
      <g transform="translate(4.714286, 4.714286)" fill="#FFFFFF">
        <path d="M12.4928571,11.3928571 C12.4928571,5.14414969 7.42727888,0.0785714286 1.17857143,0.0785714286 C0.527664402,0.0785714286 0,0.606235831 0,1.25714286 C0,1.90804988 0.527664402,2.43571429 1.17857143,2.43571429 C6.12546483,2.43571429 10.1357143,6.44596374 10.1357143,11.3928571 C10.1357143,12.0437642 10.6633787,12.5714286 11.3142857,12.5714286 C11.9651927,12.5714286 12.4928571,12.0437642 12.4928571,11.3928571 Z" fillRule="nonzero" />
        <path d="M7.77857143,11.3928571 C7.77857143,7.74777779 4.82365078,4.79285714 1.17857143,4.79285714 C0.527664402,4.79285714 0,5.32052154 0,5.97142857 C0,6.6223356 0.527664402,7.15 1.17857143,7.15 C3.52183672,7.15 5.42142857,9.04959185 5.42142857,11.3928571 C5.42142857,12.0437642 5.94909297,12.5714286 6.6,12.5714286 C7.25090703,12.5714286 7.77857143,12.0437642 7.77857143,11.3928571 Z" fillRule="nonzero" />
        <circle id="Oval-3" cx="1.17857143" cy="11.3928571" r="1.17857143" />
      </g>
    </g>
  </SVGBox>
)

// -------------------------------------
// Social icons 60 x 60

export const FacebookIcon = () =>
  (<SVGBox className="FacebookIcon" size="60">
    <FillShapeSixty className="SVGBoxBG" />
    <path className="SVGBoxFG" d="M31.3 38h-3.5v-8h-1.8v-2.8h1.8v-1.7c0-2.2 1-3.6 3.8-3.6h2.4v2.8h-1.5c-1.1 0-1.2.4-1.2 1.1v1.4h2.7l-.3 2.8h-2.4v8z" />
  </SVGBox>)

export const GooglePlusIcon = () =>
  (<SVGBox className="GooglePlusIcon" size="60">
    <FillShapeSixty className="SVGBoxBG" />
    <path className="SVGBoxFG" d="M38 25v-3h-1v3h-3v1h3v3h1v-3h3v-1zM32.2 21h-5s-4.8.1-4.8 4.4c0 4.3 4.7 3.8 4.7 3.8v1.1c0 .4.4.3.4 1.2-.3 0-6.4-.2-6.4 3.8 0 3.9 5.2 3.7 5.2 3.7s6 .3 6-4.6c0-2.9-3.4-3.8-3.4-5 0-1.2 2.6-1.5 2.6-4.3 0-1.7-.2-2.6-1.5-3.2-.1-.4 2.2-.1 2.2-.9zm-1.6 13.8c.1 1.5-1.5 2.9-3.6 3-2.1.1-3.8-1-3.9-2.5-.1-1.5 1.5-2.9 3.6-3 2-.2 3.8.9 3.9 2.5zm-3.1-6.6c-1.2.3-2.6-.8-3.1-2.5s.1-3.4 1.4-3.7c1.2-.3 2.6.8 3.1 2.5s-.2 3.4-1.4 3.7z" />
  </SVGBox>)

export const LinkedInIcon = () =>
  (<SVGBox className="LinkedInIcon" size="60">
    <FillShapeSixty className="SVGBoxBG" />
    <path className="SVGBoxFG" d="M25.9 38v-10.8h-3.6v10.8h3.6zm-1.9-12.3c1.3 0 2.1-.8 2.1-1.9 0-1.1-.8-1.9-2-1.9s-2.1.8-2.1 1.9c0 1.1.8 1.9 2 1.9zM27.9 38h3.6v-6c0-.3 0-.6.1-.9.3-.6.9-1.3 1.9-1.3 1.3 0 1.8 1 1.8 2.4v5.8h3.7v-6.2c0-3.3-1.8-4.9-4.2-4.9-2 0-2.8 1.1-3.3 1.8v-1.6h-3.6v10.9z" />
  </SVGBox>)

export const MailIcon = () =>
  (<SVGBox className="MailIcon" size="60">
    <FillShapeSixty className="SVGBoxBG" />
    <polygon className="SVGBoxFG" points="20.724,25.067 20.724,34.632 26.574,29.605" />
    <polygon className="SVGBoxFG" points="33.426,29.605 39.277,34.632 39.277,25.066" />
    <path className="SVGBoxFG" d="M29.617,31.964l-2.034-1.578l-5.173,4.444h15.18l-5.173-4.444l-2.034,1.578 C30.158,32.139,29.842,32.139,29.617,31.964z" />
    <polygon className="SVGBoxFG" points="30,30.68 38.451,24.125 21.549,24.125" />
  </SVGBox>)

export const PinterestIcon = () =>
  (<SVGBox className="PinterestIcon" size="60">
    <FillShapeSixty className="SVGBoxBG" />
    <path className="SVGBoxFG" d="M30 21c-5 0-9 4-9 9 0 3.7 2.2 6.8 5.4 8.2 0-.6 0-1.4.2-2.1.2-.7 1.2-4.9 1.2-4.9s-.3-.6-.3-1.4c0-1.3.8-2.3 1.7-2.3.8 0 1.2.6 1.2 1.4 0 .8-.5 2.1-.8 3.2-.2 1 .5 1.7 1.4 1.7 1.7 0 2.9-2.2 2.9-4.8 0-2-1.3-3.4-3.7-3.4-2.7 0-4.4 2-4.4 4.3 0 .8.2 1.3.6 1.8.2.2.2.3.1.5 0 .2-.1.6-.2.7-.1.2-.2.3-.5.2-1.3-.5-1.8-1.9-1.8-3.4 0-2.6 2.2-5.6 6.4-5.6 3.4 0 5.7 2.5 5.7 5.2 0 3.5-2 6.2-4.9 6.2-1 0-1.9-.5-2.2-1.1 0 0-.5 2.1-.6 2.5-.2.7-.6 1.4-.9 1.9.8.2 1.7.4 2.5.4 5 0 9-4 9-9 0-5.2-4-9.2-9-9.2z" />
  </SVGBox>)

export const RedditIcon = () =>
  (<SVGBox className="RedditIcon" size="60">
    <FillShapeSixty className="SVGBoxBG" />
    <path className="SVGBoxFG" d="M38.1 22c0 .9.7 1.6 1.6 1.6.9 0 1.6-.7 1.6-1.6 0-.9-.7-1.6-1.6-1.6-.8 0-1.6.7-1.6 1.6zm-.1-.9l-5.4-1.1c-.2 0-.5.1-.5.3l-2.1 5.7h1l1.8-5.1 5 1 .2-.8zm-18.9 11.4c.4-1.5 1.5-2.9 3-4-.4-.4-1-.6-1.6-.6-1.4 0-2.5 1.1-2.5 2.5 0 .8.4 1.6 1.1 2.1zm22.5 1.3c0-3.9-4.9-7-10.9-7s-10.9 3.1-10.9 7 4.9 7 10.9 7 10.9-3.1 10.9-7zm1.9-3.4c0-1.4-1.1-2.5-2.5-2.5-.6 0-1.2.3-1.7.7 1.5 1.1 2.6 2.5 3 4 .7-.5 1.2-1.3 1.2-2.2z" />
    <circle className="SVGBoxBG" cx="34.7" cy="32.4" r="1.7" />
    <circle className="SVGBoxBG" cx="26.7" cy="32.4" r="1.7" />
    <path className="SVGBoxBG" d="M34.4 36.9c-.7.7-1.9 1.1-3.6 1.1-1.7 0-2.9-.3-3.6-1.1-.2-.2-.4-.2-.6 0s-.2.4 0 .6c.9.9 2.2 1.3 4.2 1.3 1.9 0 3.3-.4 4.2-1.3.2-.2.2-.4 0-.6-.2-.1-.5-.1-.6 0z" />
  </SVGBox>)

export const TumblrIcon = () =>
  (<SVGBox className="TumblrIcon" size="60">
    <FillShapeSixty className="SVGBoxBG" />
    <path className="SVGBoxFG" d="M30.6 22v4h3.9v2.5h-3.9v4.1c0 .9 0 1.5.1 1.8.1.3.3.5.6.6.4.2.8.3 1.2.3.8 0 1.6-.3 2.5-.8v2.5c-.7.3-1.3.5-1.9.7-.6.1-1.2.2-1.8.2-.7 0-1.4-.1-2-.3-.6-.2-1.1-.4-1.5-.8-.4-.3-.7-.7-.8-1.1-.2-.4-.2-.9-.2-1.7v-5.6h-1.8v-2.3c.6-.2 1.2-.5 1.6-.9.5-.4.8-.8 1.1-1.4.3-.5.5-1.2.6-2h2.3z" />
  </SVGBox>)

export const TwitterIcon = () =>
  (<SVGBox className="TwitterIcon" size="60">
    <FillShapeSixty className="SVGBoxBG" />
    <path className="SVGBoxFG" d="M40 23.9c-.7.3-1.5.5-2.4.6.8-.5 1.5-1.3 1.8-2.2-.8.5-1.7.8-2.6 1-.7-.8-1.8-1.3-3-1.3-2.3 0-4.1 1.8-4.1 4 0 .3 0 .6.1.9-3.4-.2-6.4-1.8-8.5-4.2-.4.6-.6 1.3-.6 2 0 1.4.7 2.6 1.8 3.4-.7 0-1.3-.2-1.9-.5v.1c0 2 1.4 3.6 3.3 4-.3.1-.7.1-1.1.1-.3 0-.5 0-.8-.1.5 1.6 2 2.8 3.8 2.8-1.4 1.1-3.2 1.7-5.1 1.7-.3 0-.7 0-1-.1 1.8 1.1 4 1.8 6.3 1.8 7.8.1 12-6.1 12-11.4v-.5c.8-.6 1.5-1.3 2-2.1z" />
  </SVGBox>)

export const ArtistInviteSubmissionApprovedIcon = () =>
  (<SVGIcon className="ArtistInviteSubmissionApprovedIcon">
    <g>
      <path fill="#00d100" d="M12,6.08C12,2.722,9.314,0,6,0S0,2.722,0,6.08C0,8,0.878,9.712,2.25,10.826l0,7.136 c0,0.162,0.051,0.32,0.146,0.451c0.246,0.338,0.715,0.41,1.049,0.161l2.44-1.823l2.439,1.823c0.129,0.096,0.285,0.148,0.445,0.148 c0.414,0,0.75-0.34,0.75-0.76l-0.002-6.957C11.022,9.901,12,8.106,12,6.08z M7.52,15.477l-1.635-1.221L4.25,15.477l0-3.579 C4.804,12.068,5.391,12.16,6,12.16c0.525,0,1.034-0.068,1.52-0.197V15.477z M6,10.16c-2.206,0-4-1.83-4-4.08S3.794,2,6,2 c2.206,0,4,1.83,4,4.08S8.206,10.16,6,10.16z" />
    </g>
  </SVGIcon>)


export const ArtistInviteSubmissionSelectedIcon = () =>
  (<SVGIcon className="ArtistInviteSubmissionSelectedIcon">
    <g>
      <path fill="#f4c023" fillRule="evenodd" d="M10,20,8.22,18.67,6.43,20V17.14h-2v5.31a.8.8,0,0,0,.15.47.76.76,0,0,0,1.09.17l2.55-1.92,2.54,1.92a.81.81,0,0,0,.47.16.79.79,0,0,0,.78-.8V17.14H10Z" />
      <path fill="#f4c023" fillRule="evenodd" d="M16.69,8.24A.54.54,0,0,0,16.47,8l-2-1a4.21,4.21,0,0,0-.16-.61L15.5,4.67a.48.48,0,0,0,.08-.31.49.49,0,0,0-.53-.46L13,4l-.39-.4.14-2.1a.46.46,0,0,0-.08-.3A.48.48,0,0,0,12,1.1l-1.7,1.14q-.35-.11-.72-.18L8.66.28A.49.49,0,0,0,8.44.05a.5.5,0,0,0-.67.23l-.9,1.84q-.3.07-.6.18L4.67,1.22a.56.56,0,0,0-.31-.09.5.5,0,0,0-.46.54L4,3.7a6.51,6.51,0,0,0-.51.54l-2-.13a.5.5,0,0,0-.31.08.49.49,0,0,0-.13.69L2.3,6.67c0,.13-.07.27-.1.41L.28,8a.51.51,0,0,0-.23.23.51.51,0,0,0,.23.67l2,1a1.46,1.46,0,0,0,0,.2L1,12a.49.49,0,0,0,.44.77l2.21-.15c.1.12.21.23.32.34l-.15,2.16a.5.5,0,0,0,.46.54.56.56,0,0,0,.31-.09L6.35,14.4a4.34,4.34,0,0,0,.48.14l.94,1.93a.49.49,0,0,0,.67.22.52.52,0,0,0,.22-.22l.91-1.86.6-.15L12,15.68a.49.49,0,0,0,.69-.13.5.5,0,0,0,.08-.31L12.61,13l.2-.2,2.3.16a.5.5,0,0,0,.54-.46.56.56,0,0,0-.09-.31l-1.27-1.88c0-.14.08-.27.11-.4l2.07-1A.49.49,0,0,0,16.69,8.24ZM8.37,12.45a4.08,4.08,0,1,1,4.08-4.08A4.08,4.08,0,0,1,8.37,12.45Z" />
    </g>
  </SVGIcon>)
