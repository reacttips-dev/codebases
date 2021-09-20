interface ITiming {
  FAST: number
  STANDARD: number
}

export const TIMING: ITiming = {
  FAST: 250,
  STANDARD: 500,
}

export const BUMP_UP = {
  TRANSITION: 'transform 0.5s',
  TRANSFORM: 'translateY(-10px)',
}
