import React from 'react'

export enum Icon {
  Arrow = 'Arrow',
  Play = 'Play',
  More = 'More',
  Plus = 'Plus',
  FeatureCheckmark = 'FeatureCheckmark',
  Checkmark = 'Checkmark',
}

export function renderIconSVG(icon: Icon, classes = '') {
  switch (icon) {
    case Icon.Play:
      return <PlayIcon classes={classes} />
    case Icon.Arrow:
      return <ArrowIcon classes={classes} />
    case Icon.More:
      return <MoreIcon classes={classes} />
    case Icon.FeatureCheckmark:
      return <FeatureChechmarkIcon classes={classes} />
    case Icon.Checkmark:
      return <CheckmarkIcon classes={classes} />
    case Icon.Plus:
      return <PlusIcon classes={classes} />
    default:
      return null
  }
}

interface IIcon {
  classes: string
}

export function getTypedIcon(icon: string): Icon {
  // @ts-ignore
  if (Icon[icon] === undefined) {
    console.warn(`Icon not recognized: ${icon}`)
  }

  // @ts-ignore
  return Icon[icon] as Icon
}

const PlayIcon = ({ classes }: IIcon) => (
  <svg
    className={classes}
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="transparent"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="9"
      cy="9"
      r="8"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 11V7L11 9L8 11Z"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const ArrowIcon = ({ classes }: IIcon) => (
  <svg
    className={classes}
    focusable="false"
    aria-hidden="true"
    width="13"
    height="10"
    viewBox="0 0 13 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6 9L12 5L6 1"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M1 5L11 5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const MoreIcon = ({ classes }: IIcon) => (
  <svg
    className={classes}
    focusable="false"
    aria-hidden="true"
    width="8"
    height="5"
    viewBox="0 0 8 5"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1 4L4 1L7 4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const FeatureChechmarkIcon = ({ classes }: IIcon) => (
  <svg
    className={classes}
    width="23"
    height="24"
    viewBox="0 0 23 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>Included Checkmark</title>
    <rect width="23" height="24" rx="11.5" fill="#F5F5F5" />
    <path
      d="M9.71878 18C9.41726 18 9.21625 17.8998 9.01523 17.5994L6.10051 13.1924C5.89949 12.892 6 12.3912 6.40203 12.0907C6.70355 11.8904 7.20609 11.9906 7.40711 12.3912L9.71878 15.7965L10.0203 15.2957C10.0203 15.2957 10.0203 15.1956 10.1208 15.1956L10.6234 14.5946L12.533 11.7902L13.0355 11.1893V11.0891L14.0406 9.88725L14.9452 8.48504C14.9452 8.48504 14.9452 8.38489 15.0457 8.38489L15.5482 7.78394L15.9503 6.98268C16.0508 6.98268 16.0508 6.98268 16.0508 6.88253L16.6538 6.28158C16.9553 5.98111 17.4579 5.88095 17.7594 6.18142C18.0609 6.4819 18.0609 6.98268 17.8599 7.28316L17.3574 7.8841L16.9553 8.5852L16.8548 8.68536L16.3523 9.2863L15.4477 10.6885C15.4477 10.6885 15.4477 10.7887 15.3472 10.7887L14.3421 12.0907L13.9401 12.6917L11.93 15.5962C11.93 15.5962 11.93 15.6964 11.8294 15.6964L11.3269 16.2973L10.4223 17.6995C10.2213 17.8998 10.0203 18 9.71878 18Z"
      fill="currentColor"
    />
  </svg>
)

const PlusIcon = ({ classes }: IIcon) => (
  <svg
    className={classes}
    width="9"
    height="9"
    viewBox="0 0 9 9"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>Plus</title>
    <path
      d="M3.86262 8.544H5.75062V5.424H8.63063V3.68H5.75062V0.559999H3.86262V3.68H0.982625V5.424H3.86262V8.544Z"
      fill="currentColor"
    />
  </svg>
)

const CheckmarkIcon = ({ classes }: IIcon) => (
  <svg className={classes} width="12" height="12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <title>Checkmark</title>
    <path
      d="M3.719 12c-.302 0-.503-.1-.704-.4L.101 7.191c-.202-.3-.101-.8.301-1.101.302-.2.804-.1 1.005.3L3.72 9.797l.301-.501s0-.1.1-.1l.503-.601 1.91-2.805.503-.6v-.1L8.04 3.886l.904-1.402s0-.1.1-.1l.503-.601.402-.801c.1 0 .1 0 .1-.1l.604-.601c.301-.3.804-.401 1.105-.1.302.3.302.8.1 1.101l-.502.601-.402.701-.1.1-.503.601-.904 1.403s0 .1-.1.1L8.341 6.09l-.402.6-2.01 2.905s0 .1-.1.1l-.503.601-.905 1.402c-.2.2-.402.301-.703.301z"
      fill="#000000"
    />
  </svg>
)
