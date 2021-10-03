import { CircularProgressbarStyles } from './types';

export default function buildStyles({
  rotation,
  strokeLinecap,
  textColor,
  textSize,
  pathColor,
  pathTransition,
  pathTransitionDuration,
  trailColor,
  backgroundColor,
}: {
  rotation?: number; // Number of turns, 0-1
  strokeLinecap?: any;
  textColor?: string;
  textSize?: string | number;
  pathColor?: string;
  pathTransition?: string;
  pathTransitionDuration?: number; // Measured in seconds
  trailColor?: string;
  backgroundColor?: string;
}): CircularProgressbarStyles {
  const rotationTransform = rotation == null ? undefined : `rotate(${rotation}turn)`;
  const rotationTransformOrigin = rotation == null ? undefined : 'center center';

  return {
    root: {},
    path: removeUndefinedValues({
      stroke: pathColor,
      strokeLinecap: strokeLinecap,
      transform: rotationTransform,
      transformOrigin: rotationTransformOrigin,
      transition: pathTransition,
      transitionDuration: pathTransitionDuration == null ? undefined : `${pathTransitionDuration}s`,
    }),
    trail: removeUndefinedValues({
      stroke: trailColor,
      strokeLinecap: strokeLinecap,
      transform: rotationTransform,
      transformOrigin: rotationTransformOrigin,
    }),
    text: removeUndefinedValues({
      fill: textColor,
      fontSize: textSize,
    }),
    background: removeUndefinedValues({
      fill: backgroundColor,
    }),
  };
}

function removeUndefinedValues(obj: { [key: string]: any }) {
  Object.keys(obj).forEach((key: string) => {
    if (obj[key] == null) {
      delete obj[key];
    }
  });
  return obj;
}
