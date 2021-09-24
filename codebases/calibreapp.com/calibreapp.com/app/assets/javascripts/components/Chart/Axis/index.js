export const PositionOnAxis = {
  x: {
    line: (height, width) => ({
      x1: 0,
      x2: width || '100%',
      y1: 0,
      y2: 0
    }),
    transform: position => `translate(${position}, 0)`,
    tick: (size, align) => ({
      x1: 0,
      x2: 0,
      y1: 0,
      y2: align === 'top' ? size : -size
    }),
    text: (offset, fontSize, align) =>
      `0, ${align === 'top' ? offset + fontSize : -offset * 1.4}`,
    textAnchor: () => 'middle'
  },
  y: {
    line: height => ({
      x1: 0,
      x2: 0,
      y1: 0,
      y2: height || '100%'
    }),
    transform: position => `translate(0, ${position})`,
    tick: size => ({
      x1: 0,
      x2: -size,
      y1: 0,
      y2: 0
    }),
    text: (offset, fontSize) => `-${offset * 1.4}, ${(fontSize * 0.5) / 2}`,
    textAnchor: () => 'end'
  }
}

export { default as Ticks } from './Ticks'
export { default as TickLabels } from './TickLabels'
export { default } from './Axis'
