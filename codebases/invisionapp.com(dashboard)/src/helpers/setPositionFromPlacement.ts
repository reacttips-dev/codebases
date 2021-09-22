import { Placement } from '../types'

export interface Dimensions {
  left: number
  top: number
  width: number
  height: number
}

export interface Position {
  left: number
  top: number
}

function setPositionFromPlacement(
  placement: Placement,
  triggerDimensions: Dimensions,
  contentsDimensions: Dimensions
): Position {
  const margin = 12
  if (placement === 'top-right') {
    return {
      top: triggerDimensions.top - contentsDimensions.height - margin,
      left:
        triggerDimensions.left +
        triggerDimensions.width +
        12 -
        contentsDimensions.width,
    }
  }
  if (placement === 'top-center') {
    return {
      top: triggerDimensions.top - contentsDimensions.height - margin,
      left:
        triggerDimensions.left +
        triggerDimensions.width / 2 -
        contentsDimensions.width / 2,
    }
  }
  if (placement === 'top-left') {
    return {
      top: triggerDimensions.top - contentsDimensions.height - margin,
      left: triggerDimensions.left - 12,
    }
  }
  if (placement === 'bottom-right') {
    return {
      top: triggerDimensions.top + triggerDimensions.height + margin,
      left:
        triggerDimensions.left +
        triggerDimensions.width +
        12 -
        contentsDimensions.width,
    }
  }
  if (placement === 'bottom-center') {
    return {
      top: triggerDimensions.top + triggerDimensions.height + margin,
      left:
        triggerDimensions.left +
        triggerDimensions.width / 2 -
        contentsDimensions.width / 2,
    }
  }
  if (placement === 'bottom-left') {
    return {
      top: triggerDimensions.top + triggerDimensions.height + margin,
      left: triggerDimensions.left - 12,
    }
  }
  if (placement === 'right-bottom') {
    return {
      top: triggerDimensions.top + triggerDimensions.height / 2 - 16,
      left: triggerDimensions.left + triggerDimensions.width + margin,
    }
  }
  if (placement === 'right-center') {
    return {
      top:
        triggerDimensions.top +
        triggerDimensions.height / 2 -
        contentsDimensions.height / 2,
      left: triggerDimensions.left + triggerDimensions.width + margin,
    }
  }
  if (placement === 'right-top') {
    return {
      top:
        triggerDimensions.top +
        triggerDimensions.height / 2 -
        contentsDimensions.height +
        16,
      left: triggerDimensions.left + triggerDimensions.width + margin,
    }
  }
  if (placement === 'left-bottom') {
    return {
      top: triggerDimensions.top + triggerDimensions.height / 2 - 16,
      left: triggerDimensions.left - contentsDimensions.width - margin,
    }
  }
  if (placement === 'left-center') {
    return {
      top:
        triggerDimensions.top +
        triggerDimensions.height / 2 -
        contentsDimensions.height / 2,
      left: triggerDimensions.left - contentsDimensions.width - margin,
    }
  }
  if (placement === 'left-top') {
    return {
      top:
        triggerDimensions.top +
        triggerDimensions.height / 2 -
        contentsDimensions.height +
        16,
      left: triggerDimensions.left - contentsDimensions.width - margin,
    }
  }
  return {
    left: 0,
    top: 0,
  }
}

export default setPositionFromPlacement
